--------------------------------------------------------------------------------
-- https://www.timescale.com/blog/improving-customer-satisfaction-in-pizza-shops-with-rag-and-pgai/
----------------------------------------------------------------------------------
-- Passo 1. Pré-configuração e verificação do ambiente
----------------------------------------------------------------------------------
-- Limpa as tabelas de teste anteriores
DROP TABLE IF EXISTS PUBLIC.pizza_reviews CASCADE;
DROP TABLE IF EXISTS PUBLIC.ai_report CASCADE;

-- Define temporariamente a api_key
SET ai.openai_api_key = 'substitua sua api key aqui ou use a api_key padrão do pgai no ambiente';
SELECT pg_catalog.current_setting('ai.openai_api_key', true) AS api_key;


----------------------------------------------------------------------------------
-- Passo 2. Cria a tabela de feedback dos clientes e insere os dados de demonstração.
----------------------------------------------------------------------------------
CREATE TABLE public.pizza_reviews (
    id bigserial NOT NULL,
    product text NOT NULL,
    customer_message text NULL,
    text_length INTEGER GENERATED ALWAYS AS (LENGTH(customer_message)) STORED,
    CONSTRAINT pizza_reviews_pkey PRIMARY KEY (id)
);

INSERT INTO public.pizza_reviews (product, customer_message) VALUES
    ('pizza', 'A melhor pizza que já comi. O molho estava tão saboroso!'),
    ('pizza', 'A pizza estava nojenta. Acho que o pepperoni era feito de rato.'),
    ('pizza', 'Eu pedi um cachorro-quente e me deram uma pizza, mas comi mesmo assim.'),
    ('pizza', 'Eu odeio abacaxi na pizza. É uma desgraça.'),
    ('pizza', 'Comi 11 pedaços e vomitei. A pizza estava gostosa nos dois sentidos.');


CREATE TABLE public.ai_report (
    send_message text NULL,
    chat_completion jsonb NULL,
    final_report text NULL,
    create_time timestamptz NULL
);



----------------------------------------------------------------------------------
-- Passo 3. Cria um vectorizer para a coluna customer_message
----------------------------------------------------------------------------------
-- Obtém o resultado do embedding e insere na tabela de embedding
SELECT ai.create_vectorizer(
   'pizza_reviews'::regclass,
   destination => 'pizza_reviews_embeddings',
   embedding => ai.embedding_openai('text-embedding-3-small', 768),
   chunking => ai.chunking_recursive_character_text_splitter('customer_message')
);

select * from ai.vectorizer_status;
select * from ai.vectorizer_errors;

INSERT INTO public.pizza_reviews (product, customer_message) VALUES
    ('pizza', 'A pior pizza da minha vida, deveria ser considerado um crime vender isso!');

select * from public.pizza_reviews pr;
select * from public.pizza_reviews_embeddings pre;



----------------------------------------------------------------------------------
-- Passo 4. Usando chat_completion da IA e o banco de dados para responder rapidamente a perguntas de negócios
----------------------------------------------------------------------------------
WITH
business_question AS (
    SELECT question 
    FROM (VALUES ('Por que os clientes não gostam da nossa pizza?')) AS t(question)	
),
embedding_question AS (
    SELECT 
        question, ai.openai_embed('text-embedding-3-small', question, dimensions=>768) AS embedding 
    FROM
        business_question
)
SELECT
    eqt.question, 
    emt.chunk, 
    emt.embedding <-> eqt.embedding AS similarity
FROM pizza_reviews_embeddings emt 
CROSS JOIN embedding_question eqt
ORDER BY emt.embedding <-> eqt.embedding
LIMIT 3;



----------------------------------------------------------------------------------
-- Passo 5. Passo final, vamos gerar um relatório de negócios com base nas descobertas acima usando chat_completion
----------------------------------------------------------------------------------
-- Cria uma função build_pizza_report para colocar uma instrução de IA nela e chamá-la com um comando SQL.
CREATE OR REPLACE FUNCTION build_pizza_report(_question text, _n_criteria smallint)
RETURNS SETOF ai_report AS
$$
BEGIN
RETURN QUERY
    
WITH
embedding_question AS (
    SELECT 
        _question AS question, ai.openai_embed('text-embedding-3-small', _question, dimensions=>768) AS embedding
),
reasons AS (
    SELECT
        eqt.question, 
        emt.chunk, 
        emt.embedding <-> eqt.embedding AS similarity
    FROM pizza_reviews_embeddings emt CROSS JOIN embedding_question eqt
    ORDER BY 
        emt.embedding <-> eqt.embedding
    LIMIT _n_criteria
),
agg_resons AS (
    SELECT 
        question, jsonb_pretty(jsonb_agg(chunk)) AS reasons
    FROM reasons
    GROUP BY question
),
report_needs AS (
    SELECT 
        chr(10)||'// 1. Requisitos:
        // 1.1 Gere um relatório de negócios para responder à pergunta do usuário com os dados fornecidos.
        // 1.2 O relatório deve estar no formato markdown e ter menos de 300 palavras' || chr(10) AS report_needs,
        chr(10)||'// 2. Dados' || chr(10) AS data_needs,
        chr(10)||'// 3. Pergunta do usuário'|| chr(10) AS user_question
),
ai_report AS (
    SELECT 
        report_needs || data_needs || reasons || user_question || question AS send_message,
        ai.openai_chat_complete(
            'gpt-4o-mini',
            jsonb_build_array(
                jsonb_build_object(
                    'role', 'user', 'content', 
                    report_needs || data_needs || reasons || user_question || question)
            )) AS chat_completion
    FROM 
        agg_resons CROSS JOIN report_needs
)
SELECT 
    send_message, chat_completion,
    REPLACE(chat_completion['choices'][0]['message']['content']::text, '\n', chr(10)) AS final_report,
    NOW() AS create_time
-- INTO ai_report
FROM ai_report;

    
END;
$$
LANGUAGE plpgsql;

---- Chama a função build_pizza_report agora

INSERT INTO ai_report (send_message, chat_completion, final_report, create_time) 
SELECT  
    send_message, chat_completion, final_report, create_time
FROM 
    build_pizza_report('Por que os clientes não gostam da nossa pizza'::text, 3::int2);


SELECT * FROM ai_report;