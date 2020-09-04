from flaskApi import db


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

    def __repr__(self):
        return f"{self.id}, {self.username}, {self.email}, {self.image_file}, {self.password}, {self.isDisabled}, {self.created_date}, {self.last_login_time}"
