import UserMessageBubble from "@/components/Chat/UserMessageBubble";
import BotMessageBubble from "@/components/Chat/BotMessageBubble";
import { motion } from "framer-motion";
import TypingIndicator from "@/components/Reusable/TypingIndicator";

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
    <div
      className="flex-grow overflow-y-auto overflow-x-auto mb-4 flex justify-center
  scrollbar-thin scrollbar-thumb-rounded
  dark:scrollbar-thumb-gray-600
  scrollbar-track-transparent"
    >
      <div className="flex flex-col w-full max-w-[720px] space-y-3 px-4 min-w-0 break-words whitespace-pre-wrap">
        {messages.map((msg, i) =>
          msg.from === "user" ? (
            <UserMessageBubble key={i} text={msg.text} />
          ) : (
            <BotMessageBubble key={i} text={msg.text} />
          )
        )}

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
