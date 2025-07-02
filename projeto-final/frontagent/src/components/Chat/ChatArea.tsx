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
  const sendMessage = useChatStore((state) => state.sendMessage);
  const sendMessageWithCreateChat = useChatStore(
    (state) => state.sendMessageWithCreateChat
  );
  const connect = useChatStore((state) => state.connect);
  const disconnect = useChatStore((state) => state.disconnect);
  const loadHistory = useChatStore((state) => state.loadHistory);
  const loadingResponse = useChatStore((state) => state.isLoadingResponse);
  const resetChat = useChatStore((state) => state.resetChat);
  const assistants = useAssistantsStore((state) => state.assistants);
  const addAssistant = useAssistantsStore((state) => state.addAssistant);

  const { id: chatIdParam } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Estado local do chatId - começa como número vindo da rota, ou null
  const [chatId, setChatId] = useState<number | null>(
    chatIdParam ? Number(chatIdParam) : null
  );

  const [input, setInput] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Conecta socket ao montar
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // Rola para o fim das mensagens
  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Quando a rota muda, atualiza chatId e limpa mensagens se for /
  useEffect(() => {
    const currentChatId =
      location.pathname === "/" ? null : Number(location.pathname.slice(1));

    if (currentChatId !== chatId) {
      setChatId(currentChatId);

      if (currentChatId === null) {
        resetChat(); // limpa mensagens e loading para mostrar Welcome
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Carrega histórico quando chatId muda (e não é null)
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

  // Função de enviar mensagem
  const handleSend = async () => {
    if (!input.trim()) return;

    // Se não existe chatId (novo chat), cria chat e envia mensagem
    if (chatId === null) {
      try {
        const newChatId = await sendMessageWithCreateChat(input.trim());

        const exists = assistants.some(
          (a) => String(a.id) === String(newChatId)
        );
        if (!exists) {
          addAssistant({ id: newChatId, name: input.trim() });
        }

        setChatId(newChatId);

        // Redireciona para a nova rota do chat só se criou o chat agora
        navigate(`/${newChatId}`, { replace: true });
      } catch (error) {
        console.error("Erro ao enviar e criar chat:", error);
        return;
      }
    } else {
      // Chat já existe, só envia mensagem
      sendMessage(input.trim(), chatId);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col flex-grow h-full p-6 bg-white dark:bg-black text-black dark:text-white">
      <ChatHeader />

      {chatId === null ? (
        // Tela de boas vindas se não tem chatId ainda
        <Welcome input={input} setInput={setInput} handleSend={handleSend} />
      ) : loadingHistory ? (
        // Loading ao carregar histórico
        <div className="flex justify-center my-4">
          <Loading />
        </div>
      ) : (
        // Lista de mensagens + input
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
