import { create } from "zustand";

type User = {
  name: string;
  email: string;
  picture: string;
  loginAt?: string;
};

type AuthStore = {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User, accessToken: string) => void;
  logout: () => void;
};

const localStorageUserKey = "auth_user";
const localStorageTokenKey = "access_token";

export const useAuthStore = create<AuthStore>((set) => {
  const storedUser = localStorage.getItem(localStorageUserKey);
  const storedToken = localStorage.getItem(localStorageTokenKey);

  const initialUser = storedUser ? JSON.parse(storedUser) : null;
  const initialToken = storedToken ? storedToken : null;

  return {
    user: initialUser,
    accessToken: initialToken,

    setUser: (user, accessToken) => {
      const userWithTimestamp = {
        ...user,
        loginAt: new Date().toISOString(),
      };
      localStorage.setItem(
        localStorageUserKey,
        JSON.stringify(userWithTimestamp)
      );
      localStorage.setItem(localStorageTokenKey, accessToken);
      set({ user: userWithTimestamp, accessToken });
    },

    logout: () => {
      localStorage.removeItem(localStorageUserKey);
      localStorage.removeItem(localStorageTokenKey);
      set({ user: null, accessToken: null });
    },
  };
});
