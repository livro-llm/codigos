import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface ChatMessageProps {
  text: string;
  from: "user" | "bot";
}

export default function ChatMessage({ text, from }: ChatMessageProps) {
  const isFromUser = from === "user";
  console.log("ChatMessage", text, from);
  return (
    <div
      className={`mb-2 p-3 rounded-lg whitespace-pre-wrap ${
        isFromUser
          ? "bg-blue-600 text-white self-end ml-auto"
          : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white mr-auto"
      } max-w-md`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ className, children, ...props }: any) {
            const content = String(children).trim();
            const isInline = !/\n/.test(content);

            return isInline ? (
              <code
                className="bg-gray-300 dark:bg-gray-800 px-1 rounded"
                {...props}
              >
                {content}
              </code>
            ) : (
              <pre className="bg-black/80 text-white p-2 rounded-lg overflow-x-auto">
                <code className={className} {...props}>
                  {content}
                </code>
              </pre>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
