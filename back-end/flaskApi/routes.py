from flask import jsonify, url_for, request
from flaskApi import app, api, db, bcrypt
from flask_mail import Message, Mail
from datetime import datetime, timedelta
from flaskApi.resources import UserRegistration, UserLogin
from flaskApi.models import User, ConversationThread, Classroom, JoinClassroom, ClassroomSchema
import os
from werkzeug.utils import secure_filename
from functools import wraps
#import utils
import jwt
import json
import uuid
import string
import random


app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
    MAIL_USERNAME='hackathon123.project@gmail.com',
    MAIL_PASSWORD='hackathon123'
)

mail = Mail(app)

baseDir = os.path.dirname(os.path.abspath(__file__))


def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def getCommonHeaders(uId):
    try:
        if User.query.filter(User.id == uId).first():
            user_details = User.query.filter(User.id == uId).first()
            print("userDetails: ", user_details.username)
            return {
                'username': user_details.username,
                'email': user_details.email,
                'userId': user_details.id,
                'login': True
            }
    except:
        raise Exception("error")


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


@app.route('/contact')
@token_required
def contact(current_user):
    data = {"title": "Contact", "contact": "+91-960-498-7147"}
    return data


@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        baseDir = os.path.dirname(os.path.abspath(__file__))
        uploads_dir = os.path.join(baseDir, 'uploads')
        if not os.path.exists(uploads_dir):
            os.makedirs(uploads_dir)
        profile = request.files['file']
        profile.save(os.path.join(
            uploads_dir, secure_filename(profile.filename)))
        return "upload Successful"
    return "no file found"


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


@app.route("/createClassroom", methods=["POST"])
@token_required
# add parameter current_user and change userId to current_user.id
def CreateClassroom(current_user):
    try:
        if request.method == 'POST':
            print(request.get_json())
            data = request.get_json()
            classroomId = id_generator()
            classRoom = Classroom(classroom_id=classroomId,
                                  classroom_link=data["classroom_link"], classroom_name=data["classroom_name"],
                                  teacher_id=current_user.id, created_date=datetime.utcnow())
            db.session.add(classRoom)
            db.session.commit()

            return jsonify({
                'classroom_details': getAllClassrooms(current_user),
                'userDetails': getCommonHeaders(data["userId"])
            })
        else:
            return "Invalid request."
    except:
        raise Exception("something went wrong")


@app.route("/joinClassroom", methods=["POST"])
@token_required
# add parameter current_user and change userId to current_user.id
def JoinClass(current_user):
    try:
        if request.method == 'POST':
            data = request.get_json()
            classroom_data = Classroom.query.filter(
                Classroom.classroom_id == data['classroom_id']).first()

            teacher_details = User.query.filter(
                User.id == classroom_data.teacher_id).first()

            join_classroom_data = JoinClassroom.query.filter(
                JoinClassroom.user_id == current_user.id, JoinClassroom.classroom_id == data["classroom_id"]).first()

            if not join_classroom_data:
                if classroom_data and teacher_details:
                    join_classroom = JoinClassroom(
                        user_id=current_user.id, classroom_id=data["classroom_id"], join_date=datetime.utcnow())
                    print(join_classroom)
                    db.session.add(join_classroom)
                    db.session.commit()
                    # add getAllClassroomDetails
                    return jsonify({
                        'classroom_details': getAllClassrooms(current_user),
                        'userDetails': getCommonHeaders(current_user.id)
                    })
                else:
                    return {"message": "classroom or teacher details not present"}
            else:
                return {"message": "Already joined the classroom"}
        else:
            return {"message": "Invalid request"}
    except:
        raise Exception("Something went wrong.")


@app.route("/updateClassroom", methods=["POST"])
@token_required
def UpdateClassroom(current_user):
    try:
        if request.method == 'POST':
            data = request.get_json()

            classRoom = Classroom.query.filter(
                Classroom.id == data["id"]).first()
            print("classroom: ", current_user.id)
            if classRoom.teacher_id == current_user.id:
                classRoom.classroom_name = data["classroom_name"]
                classRoom.subject = data["subject"]
                classRoom.section = data["section"]

                db.session.commit()
                message = "success"
            else:
                message = "error in updating classroom details"
            return jsonify({
                'classroom_details': getAllClassrooms(current_user),
                'userDetails': getCommonHeaders(data["userId"]),
                'message': message
            })
        else:
            return "Invalid request."
    except:
        raise Exception("something went wrong")


@app.route('/getAllClassrooms')
@token_required
def getAllClassrooms(current_user):
    output = []
    classrooms = Classroom.query.filter(
        Classroom.teacher_id == current_user.id).all()

    if len(classrooms) > 0:
        classroom_schema = ClassroomSchema(many=True)
        output = classroom_schema.dump(classrooms)
    else:
        joined_classrooms = JoinClassroom.query.filter(
            JoinClassroom.user_id == current_user.id).all()

        for jclass in joined_classrooms:
            # for getting all classroom details of a particular user
            classrooms = Classroom.query.filter(
                Classroom.classroom_id == jclass.classroom_id).first()

            # for getting the teacher details for the respective classroom
            teacher_data = User.query.filter(
                User.id == classrooms.teacher_id).first()

            classroom_schema = ClassroomSchema().dump(classrooms)
            classroom_schema["teacher_name"] = teacher_data.username
            output.append(classroom_schema)

    return jsonify({"classroom_details": output})


# @app.route('/assign_tasks', methods=["POST"])
# def assign_tasks_to_students(current_user):
#     if


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


@app.route('/get_thread_details')
@token_required
def get_thread_details(current_user):
    thread_id = request.args['threadid']
    get_thread = ConversationThread.query.filter_by(id=thread_id).first()
    thread = {}
    if not get_thread:
        return {"message": "no thread found"}

    file_name = os.path.join(baseDir, f"static\conv_threads\{thread_id}.json")
    with open(file_name) as json_file:
        thread = json.load(json_file)

    data = {"thread": thread}
    return data


@app.route('/reply_on_thread', methods=["POST"])
@token_required
def reply_on_thread(current_user):
    if request.method == "POST":
        reply = request.form['reply']
        thread_id = request.form['threadid']

        get_thread = ConversationThread.query.filter_by(id=thread_id).first()
        thread = {}
        if not get_thread:
            return {"message": "no thread found"}

        file_name = os.path.join(
            baseDir, f"static\conv_threads\{thread_id}.json")
        with open(file_name) as json_file:
            thread = json.load(json_file)

        time = datetime.utcnow()
        data = {"reply": reply, "replied": str(
            time), "author": current_user.email, "replies": []}
        thread['replies'].append(data)

        threadFile = open(file_name, "w+")

        with threadFile as fp:
            json.dump(thread, fp)

        current_user.threadsReplied += 1
        current_user.rating += 5

        db.session.commit()

        return {"message": "answered successfully"}


@app.route('/send-forgot-password-mail')
def send_forgot_password_mail():
    try:
        email = request.args['email']
        msg = Message("Forgot Password!",
                      sender="hackathon123.project@gmail.com",
                      recipients=[email])
        msg.body = "reset password! \nreset password link cannot work on other devices as the server is running on developement environment on localhost"
        mail.send(msg)
        return {"message": f"Mail sent! check in the inbox of {email}"}
    except Exception as e:
        return(str(e))


# FOR ADMIN PANEL
@app.route('/createAdmin', methods=["POST"])
@token_required
def createAdmin(current_user):
    if request.method == "POST":
        if current_user.isAdmin:
            if request.form:
                username = request.form['username']
                email = request.form['email']
                password = request.form['password']

                if User.query.filter(User.email == email).first():
                    return {"message": "Email already in use"}
                if User.query.filter(User.username == username).first():
                    return {"message": "username already in use"}

                hash_password = bcrypt.generate_password_hash(
                    password).decode('utf-8')

                user = User(username=username, email=email, password=hash_password,
                            created_date=datetime.utcnow(), isAdmin=True)
                db.session.add(user)
                db.session.commit()
                return {"message": "Admin created successfully"}
        else:
            return {"message": "Access Denied"}


@app.route('/get_all_users')
@token_required
def get_all_users(current_user):
    if current_user.isAdmin:
        users = User.query.filter_by(isAdmin=False).all()
        data = []
        for u in users:
            user = {}
            user['id'] = u.id
            user['username'] = u.username
            user['email'] = u.email
            user['image_file'] = u.image_file
            user['created_date'] = u.created_date
            user['last_login_time'] = u.last_login_time
            user['threadsCreated'] = u.threadsCreated
            user['threadsReplied'] = u.threadsReplied
            user['rating'] = u.rating

            data.append(user)

        return {"users": data}
    else:
        return {"message": "Access Denied"}

# FOR REFERENCE
# @app.route('/image')
# def image():
#     image = url_for("static", filename="/uploads/Screenshot_38.png")
#     # baseDir = os.path.dirname(os.path.abspath(__file__))
#     # uploads_dir = os.path.join(baseDir, 'static/uploads/Screenshot_32.png')
#     # print(uploads_dir)
#     # os.remove(uploads_dir)
#     return {"image": image}
