import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/stores/Chat/useChatStore";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ChatHeader from "@/components/Chat/ChatHeader";
import Welcome from "@/components/Chat/Welcome";
import MessageList from "@/components/Chat/MessageList";
import ChatInput from "@/components/Chat/ChatInput";
import Loading from "@/components/Reusable/Loading";
import { useAssistantsStore } from "@/stores/Chat/useAssistantsStore";

export default function ChatArea() {
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages); // novo setter
  const sendMessage = useChatStore((state) => state.sendMessage);
  const sendMessageWithCreateChat = useChatStore(
    (state) => state.sendMessageWithCreateChat
  );
  const connect = useChatStore((state) => state.connect);
  const disconnect = useChatStore((state) => state.disconnect);
  const loadHistory = useChatStore((state) => state.loadHistory);
  const loadingResponse = useChatStore((state) => state.isLoadingResponse);
  const resetChat = useChatStore((state) => state.resetChat);
  const fetchAssistants = useAssistantsStore((state) => state.fetchAssistants);

  const { id: chatIdParam } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [chatId, setChatId] = useState<number | null>(
    chatIdParam ? Number(chatIdParam) : null
  );
  const [input, setInput] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const currentChatId =
      location.pathname === "/" ? null : Number(location.pathname.slice(1));

    if (currentChatId !== chatId) {
      setChatId(currentChatId);

      if (currentChatId === null) {
        resetChat();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (chatId === null) return;

    setLoadingHistory(true);
    loadHistory(chatId)
      .catch((e: any) => {
        if (e?.status === 403) {
          navigate("/", { replace: true });
        }
      })
      .finally(() => setLoadingHistory(false));
  }, [chatId, loadHistory, navigate]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages([...messages, { text: trimmed, from: "user" }]);

    setInput("");

    if (chatId === null) {
      try {
        const newChatId = await sendMessageWithCreateChat(trimmed);
        await fetchAssistants();
        setChatId(newChatId);
        navigate(`/${newChatId}`, { replace: true });
      } catch (error) {
        console.error("Erro ao enviar e criar chat:", error);
        return;
      }
    } else {
      sendMessage(trimmed, chatId);
    }
  };

  return (
    <div className="flex flex-col flex-grow h-full p-6 bg-white dark:bg-black text-black dark:text-white">
      <ChatHeader />

      {chatId === null ? (
        <Welcome input={input} setInput={setInput} handleSend={handleSend} />
      ) : loadingHistory ? (
        <div className="flex justify-center my-4">
          <Loading />
        </div>
      ) : (
        <>
          <MessageList
            messages={messages}
            loadingResponse={loadingResponse}
            bottomRef={bottomRef}
          />
          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
          />
        </>
      )}
    </div>
  );
}
