from app.llm import chain
from app.services.message_service import create_message
from app.services.user_service import get_user_by_id
from flask_jwt_extended import decode_token
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


contextos_por_chat = {}


def process_chat_message(token: str, chat_id: int | None, user_msg: str):
    """
    Valida token, usuário e chat.
    Cria a mensagem do usuário.
    Processa a resposta do LLM em streaming.
    Atualiza o contexto e grava a resposta.
    Retorna o user_id, um gerador que entrega os tokens da resposta,
    e o id do chat criado (se chat_id era None).
    """
    try:
        decoded = decode_token(token)
        user_id = int(decoded["sub"])
    except Exception as e:
        logger.error(f"Erro ao decodificar token: {e}")
        raise ValueError("Token inválido")

    user = get_user_by_id(user_id)
    if not user:
        logger.warning(f"Usuário ID {user_id} não encontrado")
        raise ValueError("Usuário não encontrado")

    created_chat_id = None

    if chat_id is None:
        # Cria novo chat com título baseado na primeira mensagem
        title = user_msg.strip()[:20]
        if len(user_msg) > 20:
            title += "..."
        chat = create_chat_for_user(user_id, title)
        chat_id = chat.id
        created_chat_id = chat_id
        logger.info(f"Novo chat criado: ID {chat_id} para usuário {user_id}")
    else:
        chat = get_chat_by_id(chat_id, user_id)
        if not chat:
            logger.warning(
                f"Chat {chat_id} não pertence ao usuário {user_id} ou não existe")
            raise ValueError("Acesso não autorizado ao chat")

    # Cria mensagem do usuário no chat
    create_message(chat_id=chat_id, sender="user", content=user_msg)

    # Recupera contexto atual do chat
    context = contextos_por_chat.get(chat_id, "")

    # Gera resposta do LLM em streaming
    stream = chain.stream({"context": context, "question": user_msg})

    bot_reply = ""

    def generator():
        nonlocal bot_reply
        for chunk in stream:
            if isinstance(chunk, str):
                token = chunk
            else:
                token = getattr(chunk, "content", str(chunk))
            bot_reply += token
            yield token

        # Salva mensagem da IA no banco
        create_message(chat_id=chat_id, sender="bot", content=bot_reply)

        # Atualiza contexto com diálogo recente
        novo_contexto = f"{context}\nUsuário: {user_msg}\nIA: {bot_reply}"
        contextos_por_chat[chat_id] = novo_contexto

    return user_id, generator(), created_chat_id
