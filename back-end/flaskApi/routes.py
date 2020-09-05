from flask import jsonify, url_for, request
from flaskApi import app, api, db, bcrypt
from datetime import datetime, timedelta
from flaskApi.resources import UserRegistration, UserLogin
from flaskApi.models import User, ConversationThread
import os
from werkzeug.utils import secure_filename
from functools import wraps
import jwt
import json
import uuid

baseDir = os.path.dirname(os.path.abspath(__file__))


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
            "image": current_user.image_file,
            "threadsCreated": current_user.threadsCreated,
            "threadsReplied": current_user.threadsReplied,
            "rating": current_user.rating,
            }
    return data


@app.route('/about')
def about():
    return {"title": "About"}


api.add_resource(UserRegistration, "/register")
api.add_resource(UserLogin, "/login")


@app.route('/updateprofile', methods=['POST'])
@token_required
def updateprofile(current_user):
    if request.method == 'POST':
        loggedin_user = User.query.filter(
            User.email == current_user.email).first()

        if request.files.get('selectedProfile'):
            user_dir = os.path.join(
                baseDir, 'static/users/'+current_user.email)
            if not os.path.exists(user_dir):
                os.makedirs(os.path.join(
                    baseDir, 'static/users/'+current_user.email))

            profile = request.files['selectedProfile']
            profile.save(os.path.join(user_dir, "profile_pic.jpg"))
            image = url_for("static", filename="users/" +
                            current_user.email+"/profile_pic.jpg")
            loggedin_user.image_file = image
            db.session.add(loggedin_user)
            db.session.commit()

        new_username = request.form['username']
        if loggedin_user.username != new_username:
            if User.query.filter(User.username == new_username).first():
                return {"error": "username already taken"}
            loggedin_user.username = new_username
            db.session.add(loggedin_user)
            db.session.commit()

        return {"msg": "profile updated successfully"}
    return {"error": "something went wrong"}


@app.route('/createThread', methods=["POST"])
@token_required
def createThread(current_user):
    try:
        if request.method == "POST":
            # get question from request
            question = request.form['question']

            # generate a unique id
            thread_id = uuid.uuid4().hex

            time = datetime.utcnow()
            # save question in a data dict
            data = {"id": thread_id, "question": question, "asked": str(time),
                    "author": current_user.email, "replies": []}

            # create and open a json file with that id
            conv_threads_dir = os.path.join(
                baseDir, 'static/conv_threads/' + thread_id+".json")
            threadFile = open(conv_threads_dir, "w+")

            # save data dict in the file
            with threadFile as fp:
                json.dump(data, fp)

            # save to db
            saveThread = ConversationThread(
                id=thread_id, user_id=current_user.id)
            db.session.add(saveThread)

            current_user.threadsCreated += 1
            db.session.commit()
            return {"message": "thread successfully created"}

    except Exception as e:
        print(str(e))


@app.route('/get_all_user_threads')
@token_required
def get_all_user_threads(current_user):
    t = current_user.threads
    if not t:
        return {"message": f"{current_user.username} has no threads yet!"}
    threads = []

    for x in range(len(t)-1, -1, -1):
        file_name = os.path.join(
            baseDir, f"static\conv_threads\{t[x].id}.json")
        with open(file_name) as json_file:
            threads.append(json.load(json_file))

    data = {"threads": threads}
    return data


@app.route('/delete_user_threads')
@token_required
def delete_user_threads(current_user):
    current_user_id = current_user.id
    print(request.args)
    thread_id = request.args['threadid']
    thread = ConversationThread.query.filter_by(id=thread_id).first()

    if thread.user_id == current_user_id:
        if thread:
            db.session.delete(thread)
            current_user.threadsCreated -= 1
            db.session.commit()
            file_name = os.path.join(
                baseDir, f"static\conv_threads\{thread_id}.json")
            os.remove(file_name)

            return {"message": "thread deleted successfully"}
        return {"message": "no such thread found"}
    else:
        return {"message": "you do not have permission to delete this thread"}
