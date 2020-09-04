from flaskApi import routes
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
import jwt
from flask_bcrypt import Bcrypt
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SECRET_KEY'] = "RZzO7lehGbBltDju9YAxlhdyv7y26Dm7roayFAEzyHc"
app.config['CORS_HEADERS'] = 'Content-Type'


db = SQLAlchemy(app)
api = Api(app)
bcrypt = Bcrypt(app)
CORS(app)
