import os
import time
import logging
from dotenv import load_dotenv
from flask import Flask, flash, jsonify, redirect, request, make_response, url_for, Request
from openai import APIConnectionError, InternalServerError, OpenAI, NotFoundError

from werkzeug.utils import secure_filename
from flask_cors import CORS

#Obtain environment variables
load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_KEY") 
VERIFIER_ASSISTANT_ID = os.getenv("VERIFIER_ASSISTANT_ID")
VECTOR_STORE_ID = os.getenv("VECTOR_STORE_ID")

# Specify global variables
API_HEADER = '/api'
UPLOAD_FOLDER = os.getcwd() + '/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'json', 'xlsx', 'doc', 'docx', 'ppt', 'pptx'}

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
        logging.warning(fileNotUploadedError)
        return jsonify({"message", fileNotUploadedError}), 400
    file = request.files['file']
    # Check if filename is valid
    print(file.filename)
    if file.filename == '' or not allowed_file(file.filename):
        logging.warning(invalidFileFormat)
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
        logging.warning("File not found in local directory")
        return None, None, 0
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
        (f"Vector Store File Run Status: {vector_store_file.status}")
    # Close the file_to_upload
    file_to_upload.close()
    return file


def delete_file_from_local(path: str):
    if os.path.exists(path):
        os.remove(path)
    else:
        logging.warning("The file does not exist")





@app.route(API_HEADER + "/upload", methods=["POST"])
def upload_file():
    # Retrieve file from request and save to uploads dir
    path = retrieve_and_save_file(request=request)
    # Upload file to OpenAI
    file = upload_file_to_openai(path=path)
    # Delete file from uploads folder
    delete_file_from_local(path=path)
    # Run prompt with assistant


    return jsonify({"message": "File is successfully uploaded to OpenAI"}), 200

if __name__ == "__main__":
    app.run(debug=True)