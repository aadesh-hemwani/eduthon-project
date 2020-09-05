from flaskApi import db
import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    image_file = db.Column(db.String(20), nullable=False,
                           default='default.jpg')
    password = db.Column(db.String(60), nullable=False)
    isDisabled = db.Column(db.Boolean, nullable=False, default=False)
    isAdmin = db.Column(db.Boolean, nullable=False, default=False)
    created_date = db.Column(db.Date)
    last_login_time = db.Column(db.Date)
    threads = db.relationship('ConversationThread',
                              backref='creator', lazy=True)

    rating = db.Column(db.Integer, default=0)
    threadsCreated = db.Column(db.Integer, default=0)
    threadsReplied = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f"{self.id}, {self.username}, {self.email}, {self.image_file}, {self.password}, {self.isDisabled}, {self.created_date}, {self.last_login_time}"


class ConversationThread(db.Model):
    id = db.Column(db.String, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.Date, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f"{self.id}, {self.user_id}, {self.created_at}"
