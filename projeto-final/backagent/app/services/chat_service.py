from flask_jwt_extended import decode_token
from app.services.user_service import get_user_by_id
from app.services.message_service import create_message
from app.models.message import Message
from app.models.chat import Chat
from app.extensions import db
from app.library.logger import logger
from app.llm import get_chain, ENABLE_STREAMING

contextos_por_chat = {}


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


def get_chats_by_user_id(user_id: int) -> list[Chat]:
    return Chat.query.filter_by(user_id=user_id).order_by(Chat.updated_at.desc()).all()


def get_chat_by_id(chat_id: int, user_id: int = None) -> Chat | None:
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


def process_chat_message(token: str, chat_id: int | None, user_msg: str, sid: str):
    try:
        decoded = decode_token(token)
        user_id = int(decoded["sub"])
    except Exception as e:
        logger.error(f"Erro ao decodificar token: {e}")
        raise ValueError("Token inválido")

    user = get_user_by_id(user_id)
    if not user:
        raise ValueError("Usuário não encontrado")

    created_chat_id = None

    if chat_id is None:
        title = user_msg.strip()[:20] + ("..." if len(user_msg) > 20 else "")
        chat = create_chat_for_user(user_id, title)
        chat_id = chat.id
        created_chat_id = chat_id
    else:
        chat = get_chat_by_id(chat_id, user_id)
        if not chat:
            raise ValueError("Acesso não autorizado ao chat")

    create_message(chat_id=chat_id, sender="user", content=user_msg)

    context = contextos_por_chat.get(chat_id, "")
    chain = get_chain(user_id=str(user_id), sid=sid)

    bot_reply = ""

    if ENABLE_STREAMING:
        stream = chain.stream({"context": context, "question": user_msg})

        def generator():
            nonlocal bot_reply
            for chunk in stream:
                token = chunk if isinstance(chunk, str) else getattr(
                    chunk, "content", str(chunk))
                bot_reply += token
                yield token

            create_message(chat_id=chat_id, sender="bot", content=bot_reply)
            novo_contexto = f"{context}\nUsuário: {user_msg}\nIA: {bot_reply}"
            contextos_por_chat[chat_id] = novo_contexto

        return user_id, generator(), created_chat_id

    else:
        response = chain.invoke({"context": context, "question": user_msg})
        if hasattr(response, "content"):
            bot_reply = response.content
        else:
            bot_reply = str(response)

        create_message(chat_id=chat_id, sender="bot", content=bot_reply)
        novo_contexto = f"{context}\nUsuário: {user_msg}\nIA: {bot_reply}"
        contextos_por_chat[chat_id] = novo_contexto

        def generator():
            yield bot_reply

        return user_id, generator(), created_chat_id


def delete_chat_and_messages(user_id: int, chat_id: int) -> bool:
    chat = Chat.query.filter_by(id=chat_id, user_id=user_id).first()
    if not chat:
        logger.warning(
            f"❌ Chat ID {chat_id} não encontrado para user_id {user_id}")
        return False

    try:
        Message.query.filter_by(chat_id=chat_id).delete()
        db.session.delete(chat)
        db.session.commit()
        logger.info(
            f"🗑️ Chat ID {chat_id} e mensagens deletadas para user_id {user_id}")
        return True
    except Exception as e:
        logger.error(f"Erro ao deletar chat ID {chat_id}: {e}")
        db.session.rollback()
        return False


def update_chat_title(chat_id: int, new_title: str) -> Chat:
    chat = Chat.query.filter_by(id=chat_id).first()
    if not chat:
        logger.warning(f"❌ Chat ID {chat_id} não encontrado para atualização")
        return None

    chat.title = new_title
    db.session.commit()
    logger.info(f"✅ Chat ID {chat_id} atualizado com título: {new_title}")
    return chat
