from langchain.callbacks.base import BaseCallbackHandler
from app.extensions import socketio


class SocketIOCallbackHandler(BaseCallbackHandler):
    def __init__(self, user_id, sid):
        self.user_id = user_id
        self.sid = sid

    def on_llm_new_token(self, token: str, **kwargs):
        socketio.emit("server_stream", {"token": token}, room=self.user_id)
