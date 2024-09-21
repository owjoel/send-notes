import os
from dotenv import load_dotenv
from flask import Flask, flash, jsonify, redirect, request, make_response, url_for
from openai import APIConnectionError, InternalServerError, OpenAI, NotFoundError

from werkzeug.utils import secure_filename
from flask_cors import CORS

#Obtain environment variables
load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_KEY") 
VERIFIER_ASSISTANT_ID = os.getenv("VERIFIER_ASSISTANT_ID")
VECTOR_STORE_ID = os.getenv("VECTOR_STORE_ID")

# Specify global variables
UPLOAD_FOLDER = '/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg'}

# Verify credentials with OpenAI
client = OpenAI(api_key=OPENAI_KEY)

#Specifies app to run for flask
app = Flask(__name__)
CORS(app)

@app.route("/health")
def health_check():
    return jsonify({"message": "Verify Service is healthy"})

# Function to check filename and decide if its 
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/upload", methods=["POST"])
def upload_file():

    # Retrieve the file
    if 'file' not in request.files:
        raise ValueError("No file found")
    file = request.files['file']

    # Check if filename is valid
    if file.filename == '' or not allowed_file(file.filename):
        raise ValueError("Invalid filename / filetype")
    
    # Save the file if valid
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        print(os.getcwd() + UPLOAD_FOLDER + "/" + filename)
        file.save(os.getcwd() + UPLOAD_FOLDER + "/" + filename)

    # # Create path to temp file
    # path = f"{UPLOAD_FOLDER}/{filename}"

    # # Upload file onto OpenAI
    # file_to_upload = open(path, "rb")

    # # If file is not found, return from function
    # if file_to_upload is None: 
    #     print("File not found in local directory")
    #     return None, None, 0
    
    # file = client.files.create(file=file_to_upload, purpose="assistants")
    # vector_store_file = client.beta.vector_stores.files.create(file_id=file.id, vector_store_id=VECTOR_STORE_ID)
    # time.sleep(0.5)
    # print(f"Vector Store File Run Status: {vector_store_file.status}")
    # while vector_store_file.status != "completed":
    #     # Handle failed file upload by reuploading the file
    #     if vector_store_file.status == "cancelled" or vector_store_file.status == "failed":
    #         print("Vector Store File upload failed. Retrying...")
    #         vector_store_file = client.beta.vector_stores.files.create(file_id=file.id, vector_store_id=VECTOR_STORE_ID)
    #     time.sleep(0.5)
    #     #Re-retrieve file status
    #     vector_store_file = client.beta.vector_stores.files.retrieve(file_id=file.id, vector_store_id=VECTOR_STORE_ID)
    #     print(f"Vector Store File Run Status: {vector_store_file.status}")

    return jsonify({"message": "File is successfully uploaded to OpenAI"})

if __name__ == "__main__":
    app.run(debug=True, port=8080)