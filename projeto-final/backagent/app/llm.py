import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from app.services.streaming_handler import SocketIOCallbackHandler

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


def get_chain(user_id: str, sid: str):
    handler = SocketIOCallbackHandler(user_id, sid)

    if USE_OLLAMA:
        model = OllamaLLM(
            model="phi3:mini",
            temperature=0.7,
            streaming=True,
            callbacks=[handler]
        )
    else:
        model = ChatOpenAI(
            model="gpt-4",
            temperature=0.7,
            streaming=True,
            openai_api_key=os.getenv("OPEN_API_KEY"),
            callbacks=[handler],
        )

    return prompt | model
