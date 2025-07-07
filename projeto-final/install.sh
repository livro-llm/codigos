#!/bin/bash

echo "Subindo containers..."
docker compose up --build -d database
docker compose run --rm --entrypoint "python -m pgai install -d postgres://postgres:postgres@database:5432/postgres" vectorizer-worker
docker compose up -d --build

echo "Aguardando containers iniciarem..."
sleep 10

echo "Baixando modelos Ollama..."
docker compose exec ollama ollama pull nomic-embed-text
docker compose exec ollama ollama pull all-minilm
docker compose exec ollama ollama pull deepseek-r1:1.5b