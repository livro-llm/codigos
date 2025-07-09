from langchain.callbacks.base import BaseCallbackHandler
from app.extensions import socketio
from app.library.logger import logger


class SocketIOCallbackHandler(BaseCallbackHandler):
    def __init__(self, user_id, sid):
        self.user_id = user_id
        self.sid = sid

    def on_llm_new_token(self, token: str, **kwargs):
        logger.info(f"Token gerado para user {self.user_id}: {token}")
        socketio.emit("server_stream", {"token": token}, room=self.user_id)

    def on_llm_end(self, response, **kwargs):
        logger.info(f"Token encerrado")
        socketio.emit("server_stream_end", {}, room=self.user_id)
