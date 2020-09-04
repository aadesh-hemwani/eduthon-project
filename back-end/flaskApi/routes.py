from flask import jsonify, url_for, request
from flaskApi import app, api, db
from flaskApi.resources import UserRegistration, UserLogin
from flaskApi.models import User
from functools import wraps
import jwt


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if request.args:
            token = request.args['token']
        if not token:
            return jsonify({'message': 'a valid token is missing'})
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = User.query.filter_by(email=data['email']).first()
        except:
            return jsonify({'message': 'token is invalid or expired, please logout and login again'})
        return f(current_user, *args, **kwargs)
    return decorator


@app.route('/home')
@token_required
def home(current_user):
    data = {"username": current_user.username,
            "email": current_user.email,
            "image": current_user.image_file
            }
    return data


@app.route('/about')
def about():
    return {"title": "About"}


@app.route('/contact')
@token_required
def contact(current_user):
    data = {"title": "Contact", "contact": "+91-960-498-7147"}
    return data
