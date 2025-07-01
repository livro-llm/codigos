import psycopg2

DB_PARAMS = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": 5432
}

conn = psycopg2.connect(**DB_PARAMS)
cur = conn.cursor()

try:
    sql = """
    INSERT INTO documents (title, content, embedding)
    VALUES (%s, %s, ai.embedding_ollama('nomic-embed-text', %s))
    """
    cur.execute(sql, ("Teste título", "Texto para teste", "Texto para teste"))
    conn.commit()
    print("Inserido com sucesso!")
except Exception as e:
    print("Erro:", e)
finally:
    cur.close()
    conn.close()
