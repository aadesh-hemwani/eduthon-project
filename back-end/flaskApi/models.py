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


class Classroom(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    classroom_name = db.Column(db.String, nullable=False)
    classroom_id = db.Column(db.String, unique=True, nullable=False)
    teacher_id = db.Column(db.Integer, nullable=False)
    classroom_link = db.Column(db.String, nullable=False)
    subject = db.Column(db.String)
    section = db.Column(db.String)
    created_date = db.Column(db.Date, nullable=False)
    classroom_desc = db.Column(db.String)

    def __repr__(self):
        return f"{self.id}, {self.classroom_name}, {self.classroom_id}, {self.teacher_id}, {self.classroom_link}, {self.classroom_desc}"


class JoinClassroom(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    classroom_id = db.Column(db.Integer, nullable=False)
    join_date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f"{self.id}, {self.user_id}, {self.classroom_id}, {self.join_date}"


class assignments(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    assignment_title = db.Column(db.String, nullable=False)
    classroom_id = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    assigned_date = db.Column(db.Date, nullable=False)
    file_path = db.Column(db.String)

    def __repr__(self):
        return f"{self.id}, {self.assignment_title}, {self.classroom_id}, {self.description}, {self.due_date}, {self.assigned_date}, {self.file_path}"


class submittedAssignments(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    assignment_id = db.Column(db.Integer, nullable=False)
    file_path = db.Column(db.String, nullable=False)
    student_id = db.Column(db.Integer, nullable=False)
    grade = db.Column(db.String)
    graded_date = db.Column(db.Date)
    is_submitted = db.Column(db.Boolean, nullable=False)
    remarks = db.Column(db.String)
    is_returned = db.Column(db.Boolean)

    def __repr__(self):
        return f"{self.id}, {self.assignment_id}, {self.file_path}, {self.student_id}, {self.grade}, {self.graded_date}, {self.is_submitted}, {self.remarks}, {self.is_returned}"


class ConversationThread(db.Model):
    id = db.Column(db.String, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.Date, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f"{self.id}, {self.user_id}, {self.created_at}"
		

# Db Schemas for json data
class ClassroomSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Classroom
        load_instance = True


class AssignmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = assignments
        load_instance = True