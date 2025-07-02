import os
from dotenv import load_dotenv
from langchain_ollama import OllamaLLM
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

USE_OLLAMA = False  # Pode configurar via variável de ambiente, se quiser

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


def get_chain():
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
    return prompt | model


chain = get_chain()
