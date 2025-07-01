import requests
import sys
import json

OLLAMA_HOST = "http://localhost:11435"
MODEL = "deepseek-r1:1.5b"


def chat_with_model_stream(prompt, model=MODEL):
    url = f"{OLLAMA_HOST}/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": True
    }
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
                    print(f"\n❌ Erro ao decodificar linha: {line} - {e}")
    print()  # pula linha após resposta


def main():
    print("💬 Chat com o modelo deepseek-r1:1.5b (streaming ativo — digite 'sair' para encerrar)\n")
    while True:
        prompt = input("Você: ")
        if prompt.lower() in ["sair", "exit", "quit"]:
            break
        try:
            print("🤖 deepseek-r1:1.5b: ", end="", flush=True)
            chat_with_model_stream(prompt)
        except Exception as e:
            print(f"\n❌ Erro: {e}")


if __name__ == "__main__":
    main()
