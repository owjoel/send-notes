import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request, make_response
from openai import APIConnectionError, InternalServerError, OpenAI, NotFoundError
from flask_cors import CORS

load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_KEY") 
VERIFIER_ASSISTANT_ID = os.getenv("VERIFIER_ASSISTANT_ID")
VECTOR_STORE_ID = os.getenv("VECTOR_STORE_ID")

#Specifies app to run for flask
app = Flask(__name__)
CORS(app)

@app.route("/health")
def health_check():
    return jsonify({"message": "Verify Service is healthy"})

if __name__ == "__main__":
    app.run(debug=True, port=8080)