-- Aguarda extensões base
select set_config('ai.ollama_host', 'http://ollama:11435', false);

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS plpython3u;
CREATE EXTENSION IF NOT EXISTS ai CASCADE;

-- Criação da tabela de documentos
BEGIN;

-- Criação da tabela de planos
CREATE TABLE public.plans (
    id serial PRIMARY KEY,
    name text NOT NULL,
    price_cents integer NOT NULL,
    max_chats integer NOT NULL,
    max_tokens integer NOT NULL,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Criação da tabela de usuários com campos para login via Google
CREATE TABLE public.users (
    id serial PRIMARY KEY,
    email text NOT NULL UNIQUE,
    name text,
    google_id text UNIQUE,
    picture text,
    stripe_customer_id text,
    current_plan_id integer,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    deleted_at timestamp DEFAULT NULL,
    CONSTRAINT users_current_plan_id_fkey FOREIGN KEY (current_plan_id) REFERENCES public.plans(id)
);

-- Criação da tabela de chats
CREATE TABLE public.chats (
    id serial PRIMARY KEY,
    user_id integer NOT NULL,
    title text,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    deleted_at timestamp DEFAULT NULL,
    CONSTRAINT chats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Criação da tabela de mensagens
CREATE TABLE public.messages (
    id serial PRIMARY KEY,
    chat_id integer NOT NULL,
    sender text NOT NULL,
    content text NOT NULL,
    tokens_used integer,
    created_at timestamp DEFAULT now(),
    deleted_at timestamp DEFAULT NULL,
    CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE
);

-- Criação da tabela de assinaturas (subscriptions)
CREATE TABLE public.subscriptions (
    id serial PRIMARY KEY,
    user_id integer NOT NULL,
    stripe_subscription_id text,
    plan_id integer,
    status text,
    start_date date,
    end_date date,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    deleted_at timestamp DEFAULT NULL,
    CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id)
);

-- Dados iniciais

-- Planos
INSERT INTO public.plans (name, price_cents, max_chats, max_tokens)
VALUES
('Free', 0, 5, 1000),
('Pro', 2999, 50, 20000),
('Enterprise', 9999, 500, 100000);

-- Usuários
INSERT INTO public.users (email, name, stripe_customer_id, current_plan_id, google_id, picture)
VALUES
('michaeldouglas@gmail.com', 'Michael Douglas', 'cus_123', 1, 'google_001', 'https://pics.com/md.jpg'),
('levina@gmail.com', 'Levina Passos', 'cus_456', 2, 'google_002', 'https://pics.com/levina.jpg'),
('silvania@gmail.com.br', 'Maria Silvania', 'cus_789', 3, 'google_003', 'https://pics.com/silvania.jpg');

-- Chats (usuários 1 e 2)
INSERT INTO public.chats (user_id, title)
VALUES
(1, 'Chat com o MD'),
(1, 'Perguntas sobre IA'),
(2, 'Suporte Técnico');

-- Mensagens
INSERT INTO public.messages (chat_id, sender, content, tokens_used)
VALUES
(1, 'user', 'Olá, quero saber sobre o MD.', 5),
(1, 'bot', 'Claro! Temos planos Free, Pro e Enterprise.', 8),
(2, 'user', 'O que é LlamaIndex?', 3),
(3, 'user', 'Não consigo acessar minha conta.', 6);

-- Subscrições
INSERT INTO public.subscriptions (user_id, stripe_subscription_id, plan_id, status, start_date, end_date)
VALUES
(1, 'sub_abc123', 2, 'active', '2025-01-01', '2025-12-31'),
(2, 'sub_def456', 1, 'canceled', '2024-01-01', '2024-12-31');

END;