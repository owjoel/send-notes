import json
import os
import time
import logging
from typing import Any, Dict
import pika
import threading
import json
import queue
import boto3

from urllib.parse import urlparse
from dataclasses import dataclass
from pika.channel import Channel
from dotenv import load_dotenv
from flask import Flask, jsonify, request, Request
from openai import APIConnectionError, InternalServerError, OpenAI, NotFoundError

from werkzeug.utils import secure_filename
from flask_cors import CORS

# Obtain environment variables
load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_KEY") 
VERIFIER_ASSISTANT_ID = os.getenv("VERIFIER_ASSISTANT_ID")
VECTOR_STORE_ID = os.getenv("VECTOR_STORE_ID")
AWS_ACCESS_KEY_ID=os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY=os.getenv("AWS_SECRET_KEY")

# Specify global variables
API_HEADER = '/api'
UPLOAD_FOLDER = os.getcwd() + '/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'json', 'xlsx', 'doc', 'docx', 'ppt', 'pptx'}
MAX_COMPLETION_TOKENS = 50

# Specify common errors
fileNotUploadedError = "No file uploaded error"
invalidFileFormat = f"Filename cannot be empty or file extension is not allowed. Allowed extensions: {ALLOWED_EXTENSIONS}"

# Create uploads folder if not present
if not os.path.exists(UPLOAD_FOLDER): 
    os.mkdir(UPLOAD_FOLDER)

# Verify credentials with OpenAI
client = OpenAI(api_key=OPENAI_KEY)

#Specifies app to run for flask
app = Flask(__name__)
CORS(app)


@app.route(API_HEADER + "/health")
def health_check():
    return jsonify({"message": "Verify Service is healthy"}), 200


# Function to check filename and decide if its 
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def retrieve_and_save_file(request: Request): 
    # Retrieve the file
    if 'file' not in request.files:
        print(fileNotUploadedError)
        return jsonify({"message", fileNotUploadedError}), 400
    file = request.files['file']
    # Check if filename is valid
    if file.filename == '' or not allowed_file(file.filename):
        print(invalidFileFormat)
        return jsonify({"message": invalidFileFormat}), 400
    # Save the file if valid
    filename = secure_filename(file.filename)
    path = UPLOAD_FOLDER + "/" + filename
    if file and allowed_file(file.filename):
        file.save(path)
    return path


def upload_file_to_openai(path: str):
    # Upload file onto OpenAI
    file_to_upload = open(path, "rb")
    # If file is not found, return from function
    if file_to_upload is None: 
        print("File not found in local directory")
        return None
    file = client.files.create(file=file_to_upload, purpose="assistants")
    vector_store_file = client.beta.vector_stores.files.create(file_id=file.id, vector_store_id=VECTOR_STORE_ID)
    time.sleep(0.5)
    print(f"Vector Store File Run Status: {vector_store_file.status}")
    while vector_store_file.status != "completed":
        # Handle failed file upload by reuploading the file
        if vector_store_file.status == "cancelled" or vector_store_file.status == "failed":
            print("Vector Store File upload failed. Retrying...")
            vector_store_file = client.beta.vector_stores.files.create(file_id=file.id, vector_store_id=VECTOR_STORE_ID)
        time.sleep(0.5)
        #Re-retrieve file status
        vector_store_file = client.beta.vector_stores.files.retrieve(file_id=file.id, vector_store_id=VECTOR_STORE_ID)
        logging.debug(f"Vector Store File Run Status: {vector_store_file.status}")
    # Close the file_to_upload
    file_to_upload.close()
    return file


def delete_file_from_local(path: str):
    if os.path.exists(path):
        os.remove(path)
    else:
        print("The file does not exist")

def create_run(thread_id: str):
    try: 
        # Create run
        run = client.beta.threads.runs.create(thread_id=thread_id, assistant_id=VERIFIER_ASSISTANT_ID, max_completion_tokens=MAX_COMPLETION_TOKENS)
        time.sleep(0.5)
        print(f"Verifier Run Status: {run.status}")
        # Ensure that the run has been completed before moving on
        while run.status != "completed":
            # Handle incomplete run status
            if run.status == "incomplete":
                print(f"Verifier Run Status: Fixing {run.status} run status...")
                # Add new message to run again
                client.beta.threads.messages.create(
                    thread_id=thread_id,
                    role="user",
                    content="Please ensure that response is in the JSON format is kept."
                )
                # Start a new run
                run = client.beta.threads.runs.create(thread_id=thread_id, assistant_id=VERIFIER_ASSISTANT_ID, max_completion_tokens=MAX_COMPLETION_TOKENS)
            elif run.status == "failed":
                print(f"Verifier Run Status: '{run.last_error.code}'-'{run.last_error.message}'. Fixing {run.status} run status...")
                # Identify whats the error
                if (run.last_error.code == "rate_limit_exceeded"):
                    print("Verifier Run Status: {run.last_error.code}, Sleeping for 1min before trying again...")
                    time.sleep(60)
                # Start a new run
                run = client.beta.threads.runs.create(thread_id=thread_id, assistant_id=VERIFIER_ASSISTANT_ID, max_completion_tokens=MAX_COMPLETION_TOKENS)
            elif run.status == "expired":
                print(f"Verifier Run Status: Fixing {run.status} run status...")
                # Start a new run
                run = client.beta.threads.runs.create(thread_id=thread_id, assistant_id=VERIFIER_ASSISTANT_ID, max_completion_tokens=MAX_COMPLETION_TOKENS)
            else: 
                run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
        time.sleep(0.5)
        # Print run status
        print(f"Verifier Run Status: {run.status}")
        # Returns from function once run has completed
        if run.status == "completed": return
        else: raise ValueError("Verifier could not complete")
    except InternalServerError: 
        print("OpenAI has experienced some internal server error. Retrying...")
    except APIConnectionError:
        print("OpenAI has experienced difficulties connecting to API. Retrying...")


def run_assistant(file):
    if file is None: raise ValueError(fileNotUploadedError)
    # Create messages
    messages = [{"role": "user", "content": f'''Given the file id """{file.id}""", verify if the file is appropriate based on the system instructions. Response must be in JSON format of {{"verified":<verified>}} is kept.'''}]
    # Create thread to run
    thread = client.beta.threads.create(messages=messages)
    # Create run
    create_run(thread_id=thread.id)
    # Retrieve the latest message
    messages = client.beta.threads.messages.list(thread_id=thread.id)
    while (True):
        # Obtain response from messages
        response = messages.data[0]
        new_message = response.content[0].text.value
        # Check if there is the common JSON parsing error
        if new_message.startswith("```json"): 
            print("Debug: Remove ```json")
            new_message = new_message[7:]
        if new_message.endswith("```"): 
            print("Debug: Remove ```")
            new_message = new_message[:len(new_message) - 3]
        print(f"Verifier message: {new_message}")
        # Jsonify output
        try:
            # Attempt to jsonify output
            json_response: dict = json.loads(new_message)
            if "verified" not in json_response.keys() or json_response['verified'] is None:
                print("Verified field not found in JSON output.")
                client.beta.threads.messages.create(thread_id=thread.id, role="user", content=f'''Please follow JSON format in system instructions.''')
                create_run(thread_id=thread.id)
            elif json_response['verified'] not in ["true", "false"]:
                print("Verified field does not contain desired outputs.")
                client.beta.threads.messages.create(thread_id=thread.id, role="user", content=f'''Verified field in JSON should only be "true" or "false".''')
                create_run(thread_id=thread.id)
            else:
                return json_response
            
        except json.JSONDecodeError:
            print("Error found when parsing response not in JSON format. Retrying...")


def delete_file_from_vector_store(file):
    client.files.delete(file_id=file.id)


@app.route(API_HEADER + "/upload", methods=["POST"])
def upload_file():
    # Retrieve file from request and save to uploads dir
    path = retrieve_and_save_file(request=request)
    # Upload file to OpenAI
    file = upload_file_to_openai(path=path)
    # Delete file from uploads folder
    delete_file_from_local(path=path)
    # Run prompt with assistant
    json_response = run_assistant(file=file)
    # Delete file from vector store
    delete_file_from_vector_store(file=file)
    return jsonify({"message": json_response['verified']}), 200

# AMQP Pub/Sub
protocol = os.getenv("RABBITMQ_PROTOCOL")
host = os.getenv('RABBITMQ_HOST')
username = os.getenv('RABBITMQ_USERNAME')
password = os.getenv('RABBITMQ_PASSWORD')
url = f"{protocol}://{username}:{password}@{host}"
exchange = os.getenv("RABBITMQ_EXCHANGE")
amqp_queue = os.getenv("RABBITMQ_QUEUE")

queue = queue.Queue()
s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_KEY)

@dataclass
class ListingStatus():
    _id: str
    status: str
    url: str
    price: int = None
    categoryCode: str = None

    def to_json(self) -> Dict[str, Any]:
        return {
            "_id": self._id,
            "status": self.status,
            "price": self.price,
            "categoryCode": self.categoryCode,
            "url": self.url
        }

def on_message(ch: Channel, method, properties, body: bytes) -> None:
    data = json.loads(body)
    listing: ListingStatus = ListingStatus(**data)
    print('Listing', listing)
    app.logger.info(listing)

    parsed_url = urlparse(listing.url)
    bucket = parsed_url.netloc.split('.')[0]
    key = parsed_url.path.lstrip('/')
    print(bucket, key)

    if not os.path.exists(f"{os.getcwd()}/tmp"):
        os.mkdir(f"{os.getcwd()}/tmp")

    local_path = f"{os.getcwd()}/tmp/{key}"
    try:
        s3.download_file(bucket, key, local_path)
        file = upload_file_to_openai(local_path)
        delete_file_from_local(local_path)
        json_response = run_assistant(file=file)
        delete_file_from_vector_store(file=file)
        verified = json_response['verified']

        if verified:
            listing.status = "Verified"
        else:
            listing.status = "Rejected"
        print('listingBefore:', listing)
        queue.put(listing)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(e)
    # finally:
    #     ch.basic_ack(delivery_tag=method.delivery_tag)
      
def consumer() -> None:
    conn = pika.BlockingConnection(pika.URLParameters(url))
    print(f"Consumer Connected: {host}")
    ch = conn.channel()

    ch.exchange_declare(exchange=exchange, exchange_type="topic", durable=True)
    ch.queue_declare(queue=amqp_queue)
    ch.queue_bind(exchange=exchange, queue=amqp_queue, routing_key="listings.uploaded")
    ch.basic_consume(queue=amqp_queue, on_message_callback=on_message)
    ch.start_consuming()

def producer() -> None:
    conn = pika.BlockingConnection(pika.URLParameters(url))
    print(f"Producer Connected: {host}")
    ch = conn.channel()
    ch.exchange_declare(exchange=exchange, exchange_type="topic", durable=True)
    while True:
        try:
            listing: ListingStatus = queue.get(block=True)
            if listing is None:
                break
            print(f"Listing type: {type(listing)}, content: {listing.to_json()}")
            ch.basic_publish(exchange=exchange, routing_key="listings.verified", body=json.dumps(listing.to_json()))

        except Exception as e:
            print("Caught:", e.__traceback__)


if __name__ == "__main__":
    consumer = threading.Thread(target=consumer, daemon=True)
    producer = threading.Thread(target=producer, daemon=True)
    consumer.start();
    producer.start();
    app.run(debug=True)