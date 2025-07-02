import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
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

  return (
    <div
      className={`px-6 py-4 rounded-2xl max-w-[600px] w-fit ${
        message.from === "user"
          ? "bg-blue-600 text-white self-end"
          : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white self-start"
      }`}
    >
      {thinkContent && (
        <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-700 rounded-md font-mono text-sm border-l-4 border-yellow-400">
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
    </div>
  );
}
