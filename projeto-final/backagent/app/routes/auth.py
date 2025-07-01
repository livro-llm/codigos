from flask import Blueprint, request
from app.controllers.auth_controller import handle_google_login

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/google", methods=["POST"])
def google_login():
    return handle_google_login(request)
