from app.extensions import db
from app.models.message import Message
from app.models.chat import Chat
from app.library.logger import logger
from typing import Optional


def create_message(chat_id: int, sender: str, content: str, tokens_used: Optional[int] = None) -> Message:
    message = Message(
        chat_id=chat_id,
        sender=sender,
        content=content,
        tokens_used=tokens_used
    )
    db.session.add(message)
    db.session.commit()
    logger.info(f"💬 Mensagem criada no chat {chat_id}: \"{content}\"")
    return message


def get_messages_by_chat_id(chat_id: int):
    return Message.query.filter_by(chat_id=chat_id).order_by(Message.created_at.asc()).all()
