from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.user_service import get_user_by_id
from app.services.chat_service import create_chat_for_user, get_chat_by_id, get_chats_by_user_id
from app.services.message_service import get_messages_by_chat_id
from app.schemas.user import UserSchema
from app.schemas.chat import ChatSchema
from app.library.logger import logger

api_bp = Blueprint("api", __name__)


@api_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = int(get_jwt_identity())
    user = get_user_by_id(user_id)

    if not user:
        logger.warning(f"❌ Usuário ID {user_id} não encontrado.")
        return jsonify({"msg": "Usuário não encontrado"}), 404

    logger.info(f"✅ Dados retornados para usuário ID {user_id}")
    return jsonify(UserSchema.from_orm(user).dict())


@api_bp.route("/chats", methods=["POST"])
@jwt_required()
def create_chat():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    title = data.get("title")

    if not title:
        return jsonify({"msg": "Título do chat é obrigatório"}), 400

    chat = create_chat_for_user(user_id, title)
    return jsonify(ChatSchema.from_orm(chat).dict()), 201


@api_bp.route("/messages", methods=["GET"])
@jwt_required()
def get_messages():
    user_id = int(get_jwt_identity())
    chat_id = request.args.get("chat_id", type=int)

    if not chat_id:
        return jsonify({"msg": "Parâmetro 'chat_id' é obrigatório"}), 400

    chat = get_chat_by_id(chat_id)
    if not chat or chat.user_id != user_id:
        return jsonify({"msg": "Acesso negado ao chat"}), 403

    messages = get_messages_by_chat_id(chat_id)

    messages_serialized = [
        {
            "from": m.sender,
            "text": m.content
        }
        for m in messages
    ]

    logger.info(
        f"✅ Retornando {len(messages)} mensagens para usuário {user_id} no chat {chat_id}")
    return jsonify(messages_serialized)


@api_bp.route("/chats", methods=["GET"])
@jwt_required()
def get_user_chats():
    user_id = int(get_jwt_identity())

    chats = get_chats_by_user_id(user_id)

    chats_serialized = [
        {
            "id": chat.id,
            "title": chat.title
        }
        for chat in chats
    ]

    logger.info(
        f"✅ Retornando {len(chats_serialized)} chats para o usuário {user_id}")
    return jsonify(chats_serialized)
