import { ArrowUp } from "lucide-react";
import TypingIndicator from "@/components/Reusable/TypingIndicator";
import { useState } from "react";

type Props = {
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
};

export default function Welcome({ input, setInput, handleSend }: Props) {
  const [showTyping, setShowTyping] = useState(false);

  const handleLocalSend = () => {
    if (!input.trim()) return;

    setShowTyping(true);

    handleSend();
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center text-center w-full">
      {!showTyping ? (
        <>
          <h2 className="text-3xl font-bold mb-4">Olá, seja bem-vindo! 👋</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Comece sua conversa digitando abaixo.
          </p>

          <div className="w-full max-w-md relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLocalSend()}
              placeholder="Digite sua mensagem..."
              className="w-full p-3 pr-10 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleLocalSend}
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </>
      ) : (
        <div className="mb-8">
          <TypingIndicator />
        </div>
      )}
    </div>
  );
}
