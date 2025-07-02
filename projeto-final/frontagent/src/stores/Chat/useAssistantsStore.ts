import { create } from "zustand";

interface Assistant {
  id: string | number;
  name: string;
}

interface AssistantsState {
  assistants: Assistant[];
  selectedAssistant: string | number | null;
  selectAssistant: (id: string | number) => void;
  fetchAssistants: () => Promise<void>;
  addAssistant: (assistant: Assistant) => void; // << novo
  resetAssistants: () => void;
}

export const useAssistantsStore = create<AssistantsState>((set) => ({
  assistants: [],
  selectedAssistant: null,

  selectAssistant: (id) => set({ selectedAssistant: id }),

  resetAssistants: () => set({ assistants: [], selectedAssistant: null }),

  fetchAssistants: async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:5000/api/chats", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar assistentes");

      const data = await res.json();

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
