from app.extensions import db


class Plan(db.Model):
    __tablename__ = 'plans'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    price_cents = db.Column(db.Integer, nullable=False)
    max_chats = db.Column(db.Integer, nullable=False)
    max_tokens = db.Column(db.Integer, nullable=False)
