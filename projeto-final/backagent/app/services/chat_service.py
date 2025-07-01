from app.extensions import db
from app.models.chat import Chat
from app.library.logger import logger


def create_chat_for_user(user_id: int, title: str) -> Chat:
    chat = Chat.query.filter_by(user_id=user_id, title=title).first()
    if chat:
        logger.info(
            f"🟡 Chat já existe: ID {chat.id} para usuário ID {user_id} com título '{title}'")
        return chat

    chat = Chat(user_id=user_id, title=title)
    db.session.add(chat)
    db.session.commit()
    logger.info(
        f"🆕 Chat criado: ID {chat.id} para usuário ID {user_id} com título '{title}'")
    return chat


def get_chat_by_id(chat_id: int, user_id: int = None) -> Chat | None:
    """
    Recupera um chat por ID. Se user_id for fornecido, garante que o chat pertença ao usuário.

    :param chat_id: ID do chat
    :param user_id: (opcional) ID do usuário
    :return: Chat ou None
    """
    query = Chat.query.filter_by(id=chat_id)

    if user_id:
        query = query.filter_by(user_id=user_id)

    chat = query.first()

    if chat:
        logger.info(f"✅ Chat ID {chat_id} recuperado com sucesso")
    else:
        logger.warning(
            f"❌ Chat ID {chat_id} não encontrado para user_id={user_id}")

    return chat


def get_chats_by_user_id(user_id: int) -> list[Chat]:
    return Chat.query.filter_by(user_id=user_id).order_by(Chat.updated_at.desc()).all()
