import { create } from "zustand";

interface Assistant {
  id: string;
  name: string;
}

interface AssistantsState {
  assistants: Assistant[];
  selectedAssistant: string | null;
  selectAssistant: (id: string) => void;
}

export const useAssistantsStore = create<AssistantsState>((set) => ({
  assistants: [
    { id: "1", name: "O que é React?" },
    { id: "2", name: "React é melhor que o Angular?" },
    // etc
  ],
  selectedAssistant: "1",
  selectAssistant: (id) => set({ selectedAssistant: id }),
}));
