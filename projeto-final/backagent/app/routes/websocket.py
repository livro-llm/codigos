# app/routes/websocket.py

from flask_socketio import emit, join_room
from flask import request
from app.extensions import socketio
from app.library.logger import logger
from app.services.chat_service import process_chat_message
from flask_jwt_extended import decode_token


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


@socketio.on("disconnect")
def on_disconnect():
    logger.info(f"🔴 Socket desconectado: {request.sid}")


@socketio.on("chat_message")
def handle_chat(data):
    token = data.get("access_token")
    chat_id = data.get("chat_id")
    user_msg = data.get("message")

    if not token or not user_msg:
        emit("error", {"message": "access_token e message são obrigatórios"})
        return

    try:
        user_id, reply_generator, created_chat_id = process_chat_message(
            token, chat_id, user_msg, sid=request.sid
        )
    except Exception as e:
        emit("error", {"message": str(e)})
        return

    if created_chat_id:
        emit("chat_created", {"chat_id": created_chat_id}, to=str(user_id))

    emit("user_message", {"message": user_msg}, to=str(user_id))

    full_reply = ""
    for token in reply_generator:
        full_reply += token

    emit("server_message", {"message": full_reply}, to=str(user_id))
