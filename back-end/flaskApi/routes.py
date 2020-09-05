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
