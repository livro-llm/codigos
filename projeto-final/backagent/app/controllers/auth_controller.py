from flask import current_app, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from flask_jwt_extended import create_access_token, create_refresh_token
from app.services.user_service import get_or_create_user
from app.library.logger import logger


def handle_google_login(request):
    logger.info("🔐 Iniciando autenticação via Google...")
    data = request.get_json()
    token = data.get("id_token")
    if not token:
        return jsonify({"msg": "id_token ausente"}), 400

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            current_app.config["GOOGLE_CLIENT_ID"]
        )
        user = get_or_create_user(idinfo)

        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        logger.info(f"✅ Tokens JWT criados para ID {user.id}")
        return jsonify(access_token=access_token, refresh_token=refresh_token)

    except ValueError as e:
        logger.error(f"❌ Token inválido: {e}")
        return jsonify({"msg": "Token inválido"}), 401
