import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/stores/Chat/useChatStore";
import { useNavigate, useParams } from "react-router-dom";
import ChatHeader from "@/components/Chat/ChatHeader";
import Welcome from "@/components/Chat/Welcome";
import MessageList from "@/components/Chat/MessageList";
import ChatInput from "@/components/Chat/ChatInput";
import Loading from "@/components/Reusable/Loading";
import { useAssistantsStore } from "@/stores/Chat/useAssistantsStore";

export default function ChatArea() {
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);
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

  const { id: encodedId } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [chatId, setChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Decodifica o id base64 com segurança e valida
  useEffect(() => {
    if (!encodedId) {
      setChatId(null);
      resetChat();
      return;
    }

    let decodedId: string | null = null;
    try {
      decodedId = atob(encodedId);
    } catch {
      decodedId = null;
    }

    // Validação simples: id deve existir e ser não vazio
    if (!decodedId || decodedId.trim() === "") {
      navigate("/", { replace: true });
      return;
    }

    // Atualiza somente se for diferente
    if (decodedId !== chatId) {
      setChatId(decodedId);
    }
  }, [encodedId, chatId, navigate, resetChat]);

  // Conectar/desconectar socket
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // Limpa chat quando chatId for null (rota home)
  useEffect(() => {
    if (chatId === null) resetChat();
  }, [chatId, resetChat]);

  // Carrega histórico se chatId válido
  useEffect(() => {
    if (chatId === null) return;

    setLoadingHistory(true);
    loadHistory(chatId)
      .catch((error: any) => {
        const status = error?.response?.status;
        if (status === 403 || status === 400) {
          navigate("/", { replace: true });
        } else {
          console.error("Erro ao carregar histórico:", error);
        }
      })
      .finally(() => setLoadingHistory(false));
  }, [chatId, loadHistory, navigate]);

  // Scroll automático para o fim das mensagens
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (loadingHistory) return;
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingHistory]);

  // Enviar mensagem
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages([...messages, { text: trimmed, from: "user" }]);
    setInput("");

    // Se não existe chatId, cria chat novo
    if (chatId === null) {
      try {
        const newChatId = await sendMessageWithCreateChat(trimmed);
        await fetchAssistants();
        setChatId(newChatId.toString()); // converte para string para manter coerência
        navigate(`/${btoa(String(newChatId))}`, { replace: true });
      } catch (error) {
        console.error("Erro ao enviar e criar chat:", error);
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

      <div ref={bottomRef} />
    </div>
  );
}
