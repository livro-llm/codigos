import os
from flask_socketio import emit, join_room
from flask import request
from flask_jwt_extended import decode_token
from app.extensions import socketio
from app.services.user_service import get_user_by_id
from app.services.message_service import create_message
from app.services.chat_service import get_chat_by_id
from app.library.logger import logger
from langchain_ollama import OllamaLLM
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
load_dotenv()

USE_OLLAMA = False

template = """
Você é um assistente jurídico altamente capacitado, com profundo conhecimento sobre leis brasileiras,
incluindo direito do consumidor, trabalhista, civil, tributário e empresarial.

Seu objetivo é ajudar usuários com dúvidas jurídicas, explicando conceitos de forma clara, objetiva e com base na legislação atual.

Aqui está o que já foi conversado: 
{context}

Pergunta do usuário: {question}

Resposta clara e objetiva:
"""

prompt = ChatPromptTemplate.from_template(template)

if USE_OLLAMA:
    model = OllamaLLM(model="llama3")
else:
    openai_key = os.getenv("OPEN_API_KEY")
    if not openai_key:
        raise ValueError("OPEN_API_KEY não encontrado no .env")

    model = ChatOpenAI(
        model="gpt-4",
        temperature=0.7,
        openai_api_key=openai_key
    )

chain = prompt | model


@socketio.on("connect")
def on_connect():
    token = request.args.get("access_token")
    if not token:
        logger.warning("⚠️ Conexão WebSocket sem token!")
        return

    try:
        decoded = decode_token(token)
        user_id = str(decoded["sub"])
        join_room(user_id)
        logger.info(
            f"🟢 Socket conectado: {request.sid} entrou na sala do usuário {user_id}")
    except Exception as e:
        logger.error(f"❌ Erro ao decodificar token no connect: {e}")
        return


@socketio.on("disconnect")
def on_disconnect():
    logger.info(f"🔴 Socket desconectado: {request.sid}")


contextos_por_chat = {}


@socketio.on("chat_message")
def handle_chat(data):
    token = data.get("access_token")
    chat_id = data.get("chat_id")
    user_msg = data.get("message")

    if not token or not chat_id or not user_msg:
        logger.warning("⚠️ Dados incompletos no socket.")
        emit(
            "error", {"message": "access_token, chat_id e message são obrigatórios"})
        return

    try:
        decoded = decode_token(token)
        user_id = int(decoded["sub"])
    except Exception as e:
        logger.error(f"❌ Erro ao decodificar token no chat_message: {e}")
        emit("error", {"message": "Token inválido"})
        return

    user = get_user_by_id(user_id)
    if not user:
        logger.warning(f"❌ Usuário ID {user_id} não encontrado")
        emit("error", {"message": "Usuário não encontrado"})
        return

    chat = get_chat_by_id(chat_id)
    if not chat or chat.user_id != user_id:
        logger.warning(f"🚫 Chat {chat_id} não pertence ao usuário {user_id}")
        emit("error", {"message": "Acesso não autorizado ao chat"})
        return

    create_message(chat_id=chat_id, sender="user", content=user_msg)
    emit("user_message", {"message": user_msg}, to=str(user_id))

    context = contextos_por_chat.get(chat_id, "")

    stream = chain.stream({"context": context, "question": user_msg})

    bot_reply = ""

    for chunk in stream:
        if isinstance(chunk, str):
            token = chunk
        else:
            token = chunk.content if hasattr(chunk, "content") else str(chunk)

        bot_reply += token
        emit("server_stream", {"token": token}, to=str(user_id))

    create_message(chat_id=chat_id, sender="bot", content=bot_reply)
    emit("server_message", {"message": bot_reply}, to=str(user_id))

    context += f"\nUsuário: {user_msg}\nIA: {bot_reply}"
    contextos_por_chat[chat_id] = context

    create_message(chat_id=chat_id, sender="bot", content=bot_reply)
    emit("server_message", {"message": bot_reply}, to=str(user_id))
