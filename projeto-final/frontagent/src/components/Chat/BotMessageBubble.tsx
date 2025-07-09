import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  Square,
} from "lucide-react";
import "highlight.js/styles/github-dark.css";

function splitThinkAndResponse(text: string) {
  const thinkRegex = /<think>([\s\S]*?)<\/think>/i;
  const match = text.match(thinkRegex);
  if (match) {
    return {
      thinkContent: match[1].trim(),
      responseContent: text.replace(thinkRegex, "").trim(),
    };
  }
  return { thinkContent: null, responseContent: text };
}

function normalizeMarkdown(text: string) {
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

const markdownComponents = {
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <img
      src={src}
      alt={alt}
      className="my-4 max-w-full h-auto rounded-md"
      loading="lazy"
    />
  ),
};

export default function BotMessageBubble({ text }: { text: string }) {
  const { thinkContent, responseContent } = splitThinkAndResponse(text);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const handleLike = () => alert("Você curtiu!");
  const handleDislike = () => alert("Você não gostou!");

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const toggleReadAloud = () => {
    if (!("speechSynthesis" in window)) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(responseContent);
      utterance.lang = "pt-BR";
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      setSpeaking(true);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    };
  }, []);

  return (
    <div className="group w-fit max-w-[800px] min-w-0 self-start items-start flex flex-col mb-10">
      <div className="px-6 py-4 rounded-2xl bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
        {thinkContent && (
          <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-700 rounded-md font-mono text-sm border-l-4 border-yellow-400">
            <strong>Think:</strong>
            <br />
            {thinkContent}
          </div>
        )}

        <div
          className="
            prose dark:prose-invert max-w-none break-words whitespace-normal overflow-wrap-anywhere
            max-h-[500px] overflow-auto
            scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent
            dark:scrollbar-thumb-gray-600
          "
          style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            skipHtml={false}
            components={markdownComponents}
          >
            {normalizeMarkdown(responseContent)}
          </ReactMarkdown>
        </div>
      </div>

      <div className="flex mt-2 space-x-3">
        <TooltipButton
          onClick={handleCopy}
          icon={copied ? <Check size={16} /> : <Copy size={16} />}
          label={copied ? "Copiado!" : "Copiar"}
          className="bg-black/10 cursor-pointer text-black hover:bg-black/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
        />

        <TooltipButton
          onClick={handleLike}
          icon={<ThumbsUp size={16} />}
          label="Curtir"
          className="bg-green-500 cursor-pointer hover:bg-green-600 text-white"
        />

        <TooltipButton
          onClick={handleDislike}
          icon={<ThumbsDown size={16} />}
          label="Não Gostei"
          className="bg-red-500 cursor-pointer hover:bg-red-600 text-white"
        />

        <TooltipButton
          onClick={toggleReadAloud}
          icon={speaking ? <Square size={16} /> : <Volume2 size={16} />}
          label={speaking ? "Parar leitura" : "Ler em voz alta"}
          className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white"
        />
      </div>
    </div>
  );
}

function TooltipButton({
  onClick,
  icon,
  label,
  className = "",
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`peer flex items-center text-xs px-2 py-1 rounded-md transition-colors ${className}`}
        aria-label={label}
      >
        {icon}
      </button>
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-max rounded bg-gray-800 text-white text-[10px] px-2 py-[2px] opacity-0 peer-hover:opacity-100 transition-opacity select-none">
        {label}
      </span>
    </div>
  );
}
