import os
from flask import Flask
from flask_restplus import Api
from flask_cors import CORS
from util.DB_Interface import DB

app = Flask(__name__)
CORS(app)
api = Api(app)
db = DB()


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    return "HELLO"
