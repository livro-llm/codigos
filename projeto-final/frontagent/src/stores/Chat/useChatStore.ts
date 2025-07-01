import { create } from "zustand";
import { io, Socket } from "socket.io-client";

type Message = {
  from: "user" | "server";
  text: string;
};

type ChatStore = {
  socket: Socket | null;
  messages: Message[];
  isLoadingResponse: boolean;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: string, chatId: number) => void;
  loadHistory: (chatId: number) => Promise<void>;
  setLoadingResponse: (loading: boolean) => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  socket: null,
  messages: [],
  isLoadingResponse: false,

  setLoadingResponse: (loading: boolean) => set({ isLoadingResponse: loading }),

  connect: () => {
    const existingSocket = get().socket;
    if (existingSocket?.connected) {
      console.log("🟢 Já conectado");
      return;
    }

    const token = localStorage.getItem("access_token");
    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
      query: {
        access_token: token || "",
      },
    });

    console.log("🟢 Conectando ao servidor...");

    socket.on("connect", () => {
      console.log("🟢 Conectado ao servidor");
    });

    socket.on("disconnect", () => {
      console.log("🔴 Desconectado do servidor");
    });

    // Mensagem final do bot (texto completo)
    socket.off("server_message");
    socket.on("server_message", (data) => {
      set((state) => {
        const lastMsg = state.messages[state.messages.length - 1];
        if (lastMsg?.from === "server") {
          // Evita atualizar estado se texto não mudou
          if (lastMsg.text === data.message) {
            return {};
          }
          const updated = { ...lastMsg, text: data.message };
          return {
            messages: [...state.messages.slice(0, -1), updated],
            isLoadingResponse: false,
          };
        } else {
          return {
            messages: [
              ...state.messages,
              { from: "server", text: data.message },
            ],
            isLoadingResponse: false,
          };
        }
      });
    });

    // Mensagem do usuário
    socket.off("user_message");
    socket.on("user_message", (data) => {
      set((state) => ({
        messages: [...state.messages, { from: "user", text: data.message }],
      }));
    });

    // Token parcial da IA (streaming)
    socket.off("server_stream");
    socket.on("server_stream", (data) => {
      set((state) => {
        const lastMsg = state.messages[state.messages.length - 1];

        if (lastMsg?.from === "server") {
          const newText = lastMsg.text + data.token;

          if (newText === lastMsg.text) {
            return state; // sem mudanças
          }

          const updated = { ...lastMsg, text: newText };

          return {
            ...state,
            messages: [...state.messages.slice(0, -1), updated],
            isLoadingResponse: false,
          };
        } else {
          if (!data.token) return state;

          return {
            ...state,
            messages: [...state.messages, { from: "server", text: data.token }],
            isLoadingResponse: false,
          };
        }
      });
    });

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
      console.log("🔌 Desconectado manualmente");
    }
  },

  sendMessage: (message: string, chatId: number) => {
    const socket = get().socket;
    const token = localStorage.getItem("access_token");

    if (!socket || !token) {
      console.warn("⚠️ Socket não conectado ou token ausente");
      return;
    }

    get().setLoadingResponse(true); // liga loading ao enviar mensagem

    socket.emit("chat_message", {
      message,
      chat_id: chatId,
      access_token: token,
    });
  },

  loadHistory: async (chatId: number) => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `http://localhost:5000/api/messages?chat_id=${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Falha ao carregar mensagens");

      const data = await res.json();

      if (Array.isArray(data)) {
        set({ messages: data });
      }
    } catch (error) {
      console.error("Erro ao carregar histórico", error);
    }
  },
}));
