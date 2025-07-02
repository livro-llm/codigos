import { ArrowUp } from "lucide-react";

type Props = {
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
};

export default function ChatInput({ input, setInput, handleSend }: Props) {
  return (
    <div className="w-full max-w-[720px] mx-auto px-4">
      <div className="relative w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Digite sua mensagem..."
          className="w-full p-3 pr-10 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-black dark:text-white"
          onClick={handleSend}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
