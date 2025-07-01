from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    name = db.Column(db.String, nullable=False)
    google_id = db.Column(db.String, unique=True)
    picture = db.Column(db.String)
    current_plan_id = db.Column(db.Integer, db.ForeignKey("plans.id"))
    current_plan = db.relationship("Plan", backref="users")
