import { create } from "zustand";
import api from "@/api/api";

interface Assistant {
  id: string | number;
  name: string;
}

interface AssistantsState {
  assistants: Assistant[];
  selectedAssistant: string | number | null;
  selectAssistant: (id: string | number | null) => void;
  fetchAssistants: () => Promise<void>;
  addAssistant: (assistant: Assistant) => void;
  resetAssistants: () => void;
  updateAssistantName: (id: string | number, newName: string) => void;
  deleteAssistant: (id: string | number) => Promise<void>;
}

export const useAssistantsStore = create<AssistantsState>((set, get) => ({
  assistants: [],
  selectedAssistant: null,

  selectAssistant: (id) => set({ selectedAssistant: id }),

  resetAssistants: () => set({ assistants: [], selectedAssistant: null }),

  fetchAssistants: async () => {
    try {
      const res = await api.get("/api/chats");
      const data = res.data;

      const formatted = data.map((item: any) => ({
        id: item.id,
        name: item.title,
      }));

      set({ assistants: formatted });
      if (formatted.length > 0) {
        set({ selectedAssistant: formatted[0].id });
      } else {
        set({ selectedAssistant: null });
      }
    } catch (err) {
      console.error("Erro ao buscar chats:", err);
    }
  },

  addAssistant: (assistant) =>
    set((state) => ({
      assistants: [...state.assistants, assistant],
    })),

  updateAssistantName: (id, newName) =>
    set((state) => ({
      assistants: state.assistants.map((a) =>
        a.id === id ? { ...a, name: newName } : a
      ),
    })),

  deleteAssistant: async (id) => {
    try {
      const chatId = typeof id === "string" ? atob(id) : id;

      await api.delete(`/api/chats/${chatId}`);
      await get().fetchAssistants();
    } catch (error) {
      console.error("Erro ao deletar chat:", error);
      throw error;
    }
  },
}));
