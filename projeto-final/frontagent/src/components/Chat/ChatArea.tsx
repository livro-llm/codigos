import { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/stores/Chat/useChatStore";
import { ModeToggle } from "@/components/Reusable/ThemeToggle";
import { useParams } from "react-router-dom";
import Loading from "@/components/Reusable/Loading";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

import TypingIndicator from "@/components/Reusable/TypingIndicator";

// Função para separar conteúdo do <think> e do restante da mensagem
function splitThinkAndResponse(text: string) {
  const thinkRegex = /<think>([\s\S]*?)<\/think>/i;
  const match = text.match(thinkRegex);

  if (match) {
    const thinkContent = match[1].trim();
    const responseContent = text.replace(thinkRegex, "").trim();
    return { thinkContent, responseContent };
  } else {
    return { thinkContent: null, responseContent: text };
  }
}

export default function ChatArea() {
  const messages = useChatStore((state) => state.messages);
  const sendMessageOriginal = useChatStore((state) => state.sendMessage);
  const connect = useChatStore((state) => state.connect);
  const disconnect = useChatStore((state) => state.disconnect);
  const loadHistory = useChatStore((state) => state.loadHistory);
  const loadingResponse = useChatStore((state) => state.isLoadingResponse);

  const { id: chatId } = useParams();

  const [input, setInput] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = (message: string, chatId: number) => {
    sendMessageOriginal(message, chatId);
  };

  useEffect(() => {
    if (!chatId) return;

    setLoadingHistory(true);
    loadHistory(Number(chatId))
      .catch(console.error)
      .finally(() => setLoadingHistory(false));
  }, [chatId, loadHistory]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !chatId) return;
    sendMessage(input.trim(), Number(chatId));
    setInput("");
  };

  const started = messages.length > 0;

  return (
    <div className="flex flex-col flex-grow h-full p-6 bg-white dark:bg-black text-black dark:text-white">
      <header className="hidden md:flex mb-4 items-center justify-end">
        <ModeToggle />
      </header>

      {/* Loading geral enquanto carrega histórico */}
      <AnimatePresence>
        {loadingHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center my-4"
          >
            <Loading />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boas-vindas */}
      <AnimatePresence>
        {!loadingHistory && !started && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col flex-grow items-center justify-center text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Olá, seja bem-vindo! 👋</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Comece sua conversa digitando abaixo.
            </p>

            <div className="w-full max-w-md">
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3 pr-10 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Digite sua mensagem..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-black dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white transition-colors"
                  onClick={handleSend}
                  aria-label="Enviar mensagem"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat com mensagens */}
      {!loadingHistory && started && (
        <>
          <div className="flex-grow overflow-y-auto mb-4">
            {messages.map((msg, i) => {
              const { thinkContent, responseContent } = splitThinkAndResponse(
                msg.text
              );

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`mb-2 p-3 rounded-lg whitespace-pre-wrap break-words ${
                    msg.from === "user"
                      ? "bg-blue-600 text-white self-end ml-auto"
                      : "bg-gray-200 dark:bg-gray-700 mr-auto"
                  } max-w-md`}
                >
                  {thinkContent && (
                    <div
                      className="mb-2 p-2 bg-yellow-100 dark:bg-yellow-700 rounded-md font-mono text-sm whitespace-pre-wrap"
                      style={{ borderLeft: "4px solid #facc15" }}
                    >
                      <strong>Think:</strong>
                      <br />
                      {thinkContent}
                    </div>
                  )}

                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    skipHtml={false}
                  >
                    {responseContent}
                  </ReactMarkdown>
                </motion.div>
              );
            })}

            {/* Indicador de digitando via streaming */}
            <AnimatePresence>
              {loadingResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-2 p-3 rounded-lg bg-gray-200 dark:bg-gray-700 mr-auto max-w-md"
                >
                  <TypingIndicator />
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={bottomRef} />
          </div>

          {/* Input fixo no chat */}
          <div className="relative w-full">
            <input
              type="text"
              className="w-full p-3 pr-10 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-black dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white transition-colors"
              onClick={handleSend}
              aria-label="Enviar mensagem"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
