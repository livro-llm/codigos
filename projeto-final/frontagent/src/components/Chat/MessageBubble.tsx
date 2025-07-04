import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { Copy, Check, ThumbsUp, ThumbsDown, Volume2 } from "lucide-react";
import "highlight.js/styles/github-dark.css";

function splitThinkAndResponse(text: string) {
  const thinkRegex = /<think>([\s\S]*?)<\/think>/i;
  const match = text.match(thinkRegex);
  if (match) {
    const thinkContent = match[1].trim();
    const responseContent = text.replace(thinkRegex, "").trim();
    return { thinkContent, responseContent };
  }
  return { thinkContent: null, responseContent: text };
}

export default function MessageBubble({
  message,
}: {
  message: { text: string; from: string };
}) {
  const { thinkContent, responseContent } = splitThinkAndResponse(message.text);
  const isUser = message.from === "user";

  const [copied, setCopied] = useState(false);

  const handleLike = () => alert("Você curtiu!");
  const handleDislike = () => alert("Você não gostou!");

  const handleReadAloud = () => {
    if (!("speechSynthesis" in window)) {
      alert("Seu navegador não suporta leitura em voz alta.");
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(responseContent);
    utterance.lang = "pt-BR";
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`group w-fit max-w-[600px] flex flex-col mb-10 ${
        isUser ? "self-end items-end" : "self-start items-start"
      }`}
    >
      <div
        className={`px-6 py-4 rounded-2xl transition-colors duration-200 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
        }`}
      >
        {thinkContent && (
          <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-700 rounded-md font-mono text-sm border-l-4 border-yellow-400">
            <strong>Think:</strong>
            <br />
            {thinkContent}
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            skipHtml={false}
          >
            {responseContent}
          </ReactMarkdown>
        </div>
      </div>

      <div className="flex mt-2 space-x-3">
        <div className="relative">
          <button
            onClick={handleCopy}
            className={`peer flex cursor-pointer items-center text-xs px-2 py-1 rounded-md transition-colors
              ${
                isUser
                  ? "text-white bg-white/20 hover:bg-white/30 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                  : "text-black dark:text-white bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 opacity-100 pointer-events-auto"
              }
            `}
            aria-label="Copiar texto"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-max rounded bg-gray-800 text-white text-[10px] px-2 py-[2px] opacity-0 peer-hover:opacity-100 transition-opacity select-none">
            {copied ? "Copiado!" : "Copiar"}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={handleLike}
            className="peer flex cursor-pointer items-center text-xs px-2 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
            aria-label="Curtir"
          >
            <ThumbsUp size={16} />
          </button>
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-max rounded bg-gray-800 text-white text-[10px] px-2 py-[2px] opacity-0 peer-hover:opacity-100 transition-opacity select-none">
            Curtir
          </span>
        </div>

        <div className="relative">
          <button
            onClick={handleDislike}
            className="peer flex cursor-pointer items-center text-xs px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
            aria-label="Não Gostei"
          >
            <ThumbsDown size={16} />
          </button>
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-max rounded bg-gray-800 text-white text-[10px] px-2 py-[2px] opacity-0 peer-hover:opacity-100 transition-opacity select-none">
            Não Gostei
          </span>
        </div>

        <div className="relative">
          <button
            onClick={handleReadAloud}
            className="peer flex cursor-pointer items-center text-xs px-2 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            aria-label="Ler texto em voz alta"
          >
            <Volume2 size={16} />
          </button>
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-max rounded bg-gray-800 text-white text-[10px] px-2 py-[2px] opacity-0 peer-hover:opacity-100 transition-opacity select-none">
            Ler em voz alta
          </span>
        </div>
      </div>
    </div>
  );
}
