from flask_restful import Resource, reqparse
from flaskApi import bcrypt, db, app
import jwt
from flaskApi.models import User
import datetime

parser = reqparse.RequestParser()

parser.add_argument('username', "Username cannot be blank")
parser.add_argument('email', "Email cannot be blank", required=True)
parser.add_argument('password', "Password cannot be blank", required=True)


class UserRegistration(Resource):
    def post(self):
        try:
            data = parser.parse_args()
            if User.query.filter(User.email == data['email']).first():
                return {"error": "Email already in use"}
            if User.query.filter(User.username == data['username']).first():
                return {"error": "username already in use"}

            hash_password = bcrypt.generate_password_hash(
                data['password']).decode('utf-8')

            user = User(username=data['username'],
                        email=data['email'], password=hash_password, created_date=datetime.date.today())
            db.session.add(user)
            db.session.commit()
            return {"msg": "user successfully registered"}

        except Exception as e:
            return(str(e))


class UserLogin(Resource):
    def post(self):
        data = parser.parse_args()
        try:
            if not data['email']:
                return {"error": "email cannot be blank"}
            current_user = User.query.filter_by(email=data['email']).first()
            if not current_user:
                return {"error": "No account with this email"}

            verify_password = bcrypt.check_password_hash(
                current_user.password, data['password'])

            if verify_password and not(current_user.isDisabled):
                current_user.last_login_time = datetime.datetime.now()
                db.session.commit()

                token = jwt.encode({
                    'email': current_user.email,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=1440)
                }, app.config['SECRET_KEY'])

                return {"token": token.decode('utf-8')}

            else:
                return {"error": "Username or password is incorrect."}
        except Exception as e:
            return(str(e))
