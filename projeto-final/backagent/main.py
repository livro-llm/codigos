from flask import Flask
from app.config import Config
from app.extensions import db, socketio, cors, jwt
from app.routes.websocket import *
from app.routes.api import api_bp
from app.routes.auth import auth_bp
from app.routes.payments import payments_bp
from app.library.logger import logger


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    cors.init_app(app)
    # Inicializar socketio com eventlet
    socketio.init_app(app, async_mode="eventlet")
    jwt.init_app(app)

    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(payments_bp, url_prefix="/payments")

    @app.route("/")
    def home():
        return {"message": "Servidor rodando 🔥"}

    return app


app = create_app()
logger.info("🟢 Aplicação iniciada com sucesso")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
