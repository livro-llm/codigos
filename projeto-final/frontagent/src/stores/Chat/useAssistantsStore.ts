import { create } from "zustand";
import api from "@/api/api";

interface Assistant {
  id: string | number;
  name: string;
}

interface AssistantsState {
  assistants: Assistant[];
  selectedAssistant: string | number | null;
  selectAssistant: (id: string | number) => void;
  fetchAssistants: () => Promise<void>;
  addAssistant: (assistant: Assistant) => void;
  resetAssistants: () => void;
}

export const useAssistantsStore = create<AssistantsState>((set) => ({
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
      }
    } catch (err) {
      console.error("Erro ao buscar chats:", err);
    }
  },

  addAssistant: (assistant) =>
    set((state) => ({
      assistants: [...state.assistants, assistant],
    })),
}));
