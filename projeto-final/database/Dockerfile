# Dockerfile para PostgreSQL com extensões pgvector, pgai e pg_search

# Usa PostgreSQL 17.2 como imagem base
FROM postgres:17.2

# Instala pacotes necessários:
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    git \
    postgresql-server-dev-all \
    python3.11 \
    python3-pip \
    postgresql-plpython3-17 \
    curl \
    && rm -rf /var/lib/apt/lists/* 

# Instala a ferramenta 'just' para execução de comandos
RUN mkdir -p /usr/local/bin && \
    curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to /usr/local/bin

# Clona os repositórios pgvector (para vetores) e pgai (para IA)
WORKDIR /tmp
RUN git clone https://github.com/pgvector/pgvector.git
RUN git clone https://github.com/timescale/pgai.git --branch extension-0.6.0

# Compila e instala pgvector
WORKDIR /tmp/pgvector
RUN make
RUN make install

# Instala a extensão pgai
WORKDIR /tmp/pgai
RUN just ext install

# Instala dependências para pg_search:
RUN apt-get update && apt-get install -y rpm libicu-dev

# Instala pg_search via pacote RPM pré-compilado para PostgreSQL 17
RUN curl -LO https://github.com/paradedb/paradedb/releases/download/v0.13.2/pg_search_17-0.13.2-1PARADEDB.el8.aarch64.rpm \
    && rpm -ivh --nodeps pg_search_17-0.13.2-1PARADEDB.el8.aarch64.rpm

# Configura o pg_search para ser carregado ao iniciar o PostgreSQL
RUN echo "shared_preload_libraries = 'pg_search'" >> /usr/share/postgresql/postgresql.conf.sample
