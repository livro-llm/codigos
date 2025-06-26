import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "./ThemeToggle";

export default function ChatArea() {
  const messages = useChatStore((state) => state.messages);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const connect = useChatStore((state) => state.connect);
  const disconnect = useChatStore((state) => state.disconnect);
  const loadHistory = useChatStore((state) => state.loadHistory);

  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔗 Conecta ao WebSocket ao iniciar
  useEffect(() => {
    connect();
    loadHistory();

    return () => {
      disconnect(); // 🔌 Desconecta ao desmontar
    };
  }, [connect, disconnect]);

  // 🔥 Scroll automático sempre que as mensagens mudarem
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  // 🧠 Detecta automaticamente se o chat foi iniciado (se há mensagens)
  const started = messages.length > 0;

  return (
    <div className="flex flex-col flex-grow h-full p-6 bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="hidden md:flex mb-4 items-center justify-end">
        <ModeToggle />
      </header>

      {/* Tela de boas-vindas animada */}
      <AnimatePresence>
        {!started && (
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

            {/* Input na tela de boas-vindas */}
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full 
                  bg-gray-200 hover:bg-gray-300 text-black 
                  dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white 
                  transition-colors"
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

      {/* Área do chat ativa */}
      {started && (
        <>
          <div className="flex-grow overflow-y-auto mb-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`mb-2 p-3 rounded-lg ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white self-end ml-auto"
                    : "bg-gray-200 dark:bg-gray-700 mr-auto"
                } max-w-md`}
              >
                {msg.text}
              </motion.div>
            ))}
            {/* 🔥 Âncora para scroll automático */}
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
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full 
              bg-gray-200 hover:bg-gray-300 text-black 
              dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white 
              transition-colors"
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
