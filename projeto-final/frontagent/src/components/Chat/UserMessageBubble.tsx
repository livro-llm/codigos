import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function UserMessageBubble({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group w-fit max-w-[600px] self-end items-end flex flex-col mb-10">
      <div
        className="px-6 py-4 rounded-2xl bg-blue-600 text-white max-h-[300px] overflow-y-auto
    scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent
    dark:scrollbar-thumb-gray-600 dark:scrollbar-track-transparent
    break-words whitespace-pre-wrap overflow-wrap-anywhere"
      >
        {text}
      </div>
      <div className="flex mt-2 space-x-2">
        <div className="relative">
          <button
            onClick={handleCopy}
            className="peer cursor-pointer flex items-center text-xs px-2 py-1 rounded-md 
    bg-black/10 text-black hover:bg-black/20 
    dark:bg-white/20 dark:text-white dark:hover:bg-white/30
    opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
            aria-label="Copiar"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-max rounded bg-gray-800 text-white text-[10px] px-2 py-[2px] opacity-0 peer-hover:opacity-100 transition-opacity">
            {copied ? "Copiado!" : "Copiar"}
          </span>
        </div>
      </div>
    </div>
  );
}
