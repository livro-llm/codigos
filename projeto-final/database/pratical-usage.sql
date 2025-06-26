--SET CONFIGS
select set_config('ai.ollama_host', 'http://host.docker.internal:11434', false);

--CREATE TABLE
CREATE TABLE course_faq (
    id SERIAL PRIMARY KEY,
    course VARCHAR(255),
    section VARCHAR(255),
    question TEXT,
    question_ptbr TEXT,
    answer TEXT,
    answer_ptbr text,
    embedding_question vector(768),
    embedding_question_ptbr vector(768)
);


-- SELECT TABLE
select * from course_faq where id in (3,4,5);


-- TRANSLATE DATA WITH LLM
with cte as (
	 select id,
			question,
			ollama_generate(
				'llama3', 
				'Traduza o texto fornecido apos Text>> para pt-br. Mantenha os termos tecnicos em ingles. Retorne unicamente o texto traduzido, mais nada. Text>> ' || question
			)->'response' as question_ptbr,
			ollama_generate(
				'llama3', 
				'Traduza o texto fornecido apos Text>> para pt-br. Mantenha os termos tecnicos em ingles. Retorne unicamente o texto traduzido, mais nada. Text>> ' || answer
			)->'response' as answer_ptbr
	  from course_faq
	 where id in (3,4,5)
)
update course_faq cf
   set question_ptbr = cte.question_ptbr,
       answer_ptbr = cte.answer_ptbr
  from cte
 where cf.id = cte.id;
 

-- CREATE EMBEDDINGS
with cte as (
	 select id,
			question,
			ollama_embed('nomic-embed-text', question) as embedding_question,
			question_ptbr,
			ollama_embed('nomic-embed-text', question_ptbr) as embedding_question_ptbr
	  from course_faq
	 where id in (3,4,5)
)
update course_faq cf
   set embedding_question = cte.embedding_question,
       embedding_question_ptbr = cte.embedding_question_ptbr
  from cte
 where cf.id = cte.id;
 

-- COMPARE SIMILARITY
 SELECT *
		,cf.embedding_question_ptbr <=> ollama_embed('nomic-embed-text', 'O que é importante fazer antes de iniciar o curso?') as distance
   FROM course_faq cf
  where cf.id in (3,4,5)
  ORDER BY cf.embedding_question_ptbr <=> ollama_embed('nomic-embed-text', 'O que é importante fazer antes de iniciar o curso?');
  
 
-- RAG
-- PRÓXIMO VIDEO
 
 
 
 
 