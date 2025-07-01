import psycopg2
import requests
import json
import sys
import traceback

OLLAMA_HOST = "http://localhost:11435"
MODEL = "deepseek-r1:1.5b"
POSTGRES_DSN = "dbname=postgres user=postgres password=postgres host=localhost port=5432"


def recuperar_contexto(pergunta, limite=10):
    query = """
    SELECT
        chunk,
        embedding <=> ai.ollama_embed('nomic-embed-text', %(texto)s, host => 'http://ollama:11435') AS distance
    FROM documents_embeddings
    ORDER BY
        (chunk ILIKE CONCAT('%%', %(texto)s, '%%')) DESC,
        distance ASC
    LIMIT %(limite)s;
    """
    conn = psycopg2.connect(POSTGRES_DSN)
    with conn.cursor() as cur:
        cur.execute(query, {'texto': pergunta, 'limite': limite})
        resultados = cur.fetchall()
    conn.close()
    return resultados


def chat_stream_rag(pergunta):
    try:
        resultados = recuperar_contexto(pergunta, limite=10)

        if not resultados:
            contexto = ""
        else:
            primeiro = resultados[0]
            if len(primeiro) == 2:
                contexto, distancia = primeiro
                print(
                    f"[LOG] Contexto encontrado (distância={distancia:.4f}):\n{contexto}\n")
            elif len(primeiro) == 1:
                contexto = primeiro[0]
            else:
                contexto = ""

        prompt = f"""Você é um assistente que responde em português do brasil sempre nunca em outro idioma.

Use o texto no contexto abaixo para responder a pergunta. Se a resposta não estiver no contexto, diga que não sabe O contexto é seu conhecimento então responda baseado no texto que estiver nele.

Contexto relevante:
{contexto}

Pergunta:
{pergunta}

Resposta:"""

        payload = {
            "model": MODEL,
            "prompt": prompt,
            "stream": True
        }
        url = f"{OLLAMA_HOST}/api/generate"
        with requests.post(url, json=payload, stream=True) as response:
            response.raise_for_status()
            for line in response.iter_lines():
                if line:
                    try:
                        data = json.loads(line.decode("utf-8"))
                        chunk = data.get("response", "")
                        sys.stdout.write(chunk)
                        sys.stdout.flush()
                    except json.JSONDecodeError as e:
                        print(f"\n❌ Erro no JSON: {e}")
        print()

    except Exception as e:
        print("\n❌ Erro na função chat_stream_rag:")
        traceback.print_exc()


def main():
    print("🤖 RAG com Ollama e PostgreSQL — digite 'sair' para encerrar\n")
    while True:
        pergunta = input("Você: ")
        if pergunta.lower() in ["sair", "exit", "quit"]:
            break
        try:
            print("Resposta: ", end="", flush=True)
            chat_stream_rag(pergunta)
        except Exception as e:
            print(f"\n❌ Erro inesperado no main: {e}")


if __name__ == "__main__":
    main()
