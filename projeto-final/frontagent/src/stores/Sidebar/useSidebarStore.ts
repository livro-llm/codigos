import { create } from "zustand";

interface SidebarState {
  isCollapsed: boolean;
  isOpen: boolean;
  setCollapsed: (value: boolean) => void;
  setOpen: (value: boolean) => void;
  toggleCollapsed: () => void;
  toggleOpen: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  isOpen: false,
  setCollapsed: (value) => set({ isCollapsed: value }),
  setOpen: (value) => set({ isOpen: value }),
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));
