import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/Auth/useAuthStore";
import api from "@/api/api";

const baseURL = import.meta.env.VITE_API_URL;

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
  sendMessageWithCreateChat: (message: string) => Promise<number>;
  loadHistory: (chatId: number) => Promise<void>;
  setLoadingResponse: (loading: boolean) => void;
  resetChat: () => void;
  setMessages: (messages: Message[]) => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  socket: null,
  messages: [],
  isLoadingResponse: false,

  setLoadingResponse: (loading: boolean) => set({ isLoadingResponse: loading }),

  resetChat: () => set({ messages: [], isLoadingResponse: false }),

  setMessages: (messages: Message[]) => set({ messages }),

  connect: () => {
    const existingSocket = get().socket;
    if (existingSocket?.connected) {
      existingSocket.disconnect();
    }

    const token = useAuthStore.getState().accessToken;
    const socket = io(baseURL, {
      transports: ["websocket"],
      query: { access_token: token || "" },
    });

    socket.on("connect", () => {
      console.log("🟢 Conectado ao servidor");
    });

    socket.on("disconnect", () => {
      console.log("🔴 Desconectado do servidor");
    });

    socket.off("server_message");
    socket.on("server_message", (data) => {
      set((state) => {
        const lastMsg = state.messages[state.messages.length - 1];
        if (lastMsg?.from === "server") {
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
    const token = useAuthStore.getState().accessToken;

    if (!socket || !token) {
      console.warn("⚠️ Socket não conectado ou token ausente");
      return;
    }

    get().setLoadingResponse(true);

    socket.emit("chat_message", {
      message,
      chat_id: chatId,
      access_token: token,
    });
  },

  sendMessageWithCreateChat: async (message: string) => {
    const socket = get().socket;
    const token = useAuthStore.getState().accessToken;

    if (!socket || !token) {
      console.warn("⚠️ Socket não conectado ou token ausente");
      throw new Error("Socket não conectado ou token ausente");
    }

    get().setLoadingResponse(true);

    return new Promise<number>((resolve, reject) => {
      socket.off("chat_created");
      socket.once("chat_created", (data: { chat_id: number }) => {
        get().setLoadingResponse(false);
        resolve(data.chat_id);
      });

      socket.emit("chat_message", {
        message,
        chat_id: null,
        access_token: token,
      });

      setTimeout(() => {
        get().setLoadingResponse(false);
        reject(new Error("Tempo esgotado ao criar chat"));
      }, 10000);
    });
  },

  loadHistory: async (chatId: number) => {
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await api.get(`/api/messages?chat_id=${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      if (Array.isArray(data)) {
        set({ messages: data });
      }
    } catch (error) {
      throw error;
    }
  },
}));
