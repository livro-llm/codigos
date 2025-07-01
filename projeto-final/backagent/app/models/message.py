from app.extensions import db
from datetime import datetime


class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chats.id'), nullable=False)
    sender = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    tokens_used = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True)

    chat = db.relationship('Chat', backref='messages')
