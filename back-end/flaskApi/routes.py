from flask import jsonify, url_for, request
from flaskApi import app, api, db
from flaskApi.models import User


@app.route('/home')
def home():
    data = {"title": "home"}
    return data


@app.route('/about')
def about():
    return {"title": "About"}


@app.route('/contact')
@token_required
def contact(current_user):
    data = {"title": "Contact", "contact": "+91-960-498-7147"}
    return data
