import { create } from "zustand";

type User = {
  name: string;
  email: string;
  picture: string;
  loginAt?: string;
};

type AuthStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

const localStorageKey = "auth_user";

export const useAuthStore = create<AuthStore>((set) => {
  const storedUser = localStorage.getItem(localStorageKey);
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  return {
    user: initialUser,
    setUser: (user) => {
      const userWithTimestamp = {
        ...user,
        loginAt: new Date().toISOString(),
      };
      localStorage.setItem(localStorageKey, JSON.stringify(userWithTimestamp));
      set({ user: userWithTimestamp });
    },
    logout: () => {
      localStorage.removeItem(localStorageKey);
      set({ user: null });
    },
  };
});
