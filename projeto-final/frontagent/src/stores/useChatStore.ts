import { create } from "zustand";
import { io, Socket } from "socket.io-client";

type Message = {
  from: "user" | "server";
  text: string;
};

type ChatStore = {
  socket: Socket | null;
  messages: Message[];
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  loadHistory: () => Promise<void>;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  socket: null,
  messages: [],

  connect: () => {
    const existingSocket = get().socket;
    if (existingSocket?.connected) {
      console.log("🟢 Já conectado");
      return;
    }

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    console.log("🟢 Conectando ao servidor...");

    socket.on("connect", () => {
      console.log("🟢 Conectado ao servidor");
    });

    socket.on("disconnect", () => {
      console.log("🔴 Desconectado do servidor");
    });

    // 🔥 Remove listeners anteriores antes de adicionar
    socket.off("server_message");
    socket.on("server_message", (data) => {
      set((state) => ({
        messages: [...state.messages, { from: "server", text: data.message }],
      }));
    });

    // 🔥 Novo listener para mensagens dos usuários
    socket.off("user_message");
    socket.on("user_message", (data) => {
      set((state) => ({
        messages: [...state.messages, { from: "user", text: data.message }],
      }));
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

  sendMessage: (message: string) => {
    const socket = get().socket;
    if (!socket) {
      console.warn("⚠️ Socket não conectado");
      return;
    }

    socket.emit("chat_message", { message });
  },

  // 🔥 Carrega histórico da API REST
  loadHistory: async () => {
    try {
      const res = await fetch("http://localhost:5000/messages");
      const data = await res.json();

      if (Array.isArray(data)) {
        set({ messages: data });
      }
    } catch (error) {
      console.error("Erro ao carregar histórico", error);
    }
  },
}));
