from flask import Flask, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

messages = []


@app.route('/')
def home():
    return jsonify({"message": "API Flask WebSocket rodando 🔥"})


@app.route('/messages', methods=['GET'])
def get_messages():
    return jsonify(messages)


@socketio.on('connect')
def handle_connect():
    print('🟢 Cliente conectado')


@socketio.on('disconnect')
def handle_disconnect():
    print('🔴 Cliente desconectado')


@socketio.on('chat_message')
def handle_chat_message(data):
    print('💬 Mensagem recebida:', data)
    user_message = data.get('message')

    messages.append({'from': 'user', 'text': user_message})

    emit('user_message', {'message': user_message}, broadcast=True)

    response = f"Resposta do servidor para: {user_message}"

    messages.append({'from': 'server', 'text': response})

    emit('server_message', {'message': response}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
