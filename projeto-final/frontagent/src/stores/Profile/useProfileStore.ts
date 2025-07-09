import { create } from "zustand";
import api from "@/api/api";

interface ProfileStore {
  isDeletingAll: boolean;
  deleteAllChats: () => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  isDeletingAll: false,
  deleteAllChats: async () => {
    set({ isDeletingAll: true });
    try {
      await api.delete("/api/chats");
    } finally {
      set({ isDeletingAll: false });
    }
  },
}));
