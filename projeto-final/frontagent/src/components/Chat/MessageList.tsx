import { motion } from "framer-motion";
import TypingIndicator from "@/components/Reusable/TypingIndicator";
import MessageBubble from "@/components/Chat/MessageBubble";

type Props = {
  messages: { text: string; from: string }[];
  loadingResponse: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
};

export default function MessageList({
  messages,
  loadingResponse,
  bottomRef,
}: Props) {
  return (
    <div className="flex-grow overflow-y-auto mb-4 flex justify-center">
      <div className="flex flex-col w-full max-w-[720px] space-y-3 px-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {loadingResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          >
            <TypingIndicator />
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
