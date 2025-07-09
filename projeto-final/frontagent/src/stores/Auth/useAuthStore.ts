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
  refreshToken: string | null;
  setUser: (user: User, accessToken: string, refreshToken: string) => void;
  updateAccessToken: (token: string) => void;
  logout: () => void;
};

const accessKey = "access_token";
const refreshKey = "refresh_token";
const userKey = "auth_user";

export const useAuthStore = create<AuthStore>((set) => {
  const user = localStorage.getItem(userKey);
  const accessToken = localStorage.getItem(accessKey);
  const refreshToken = localStorage.getItem(refreshKey);

  return {
    user: user ? JSON.parse(user) : null,
    accessToken,
    refreshToken,

    setUser: (user, accessToken, refreshToken) => {
      if (!user.loginAt) {
        user.loginAt = new Date().toISOString();
      }
      localStorage.setItem(userKey, JSON.stringify(user));
      localStorage.setItem(accessKey, accessToken);
      localStorage.setItem(refreshKey, refreshToken);
      set({ user, accessToken, refreshToken });
    },

    updateAccessToken: (token) => {
      localStorage.setItem(accessKey, token);
      set({ accessToken: token });
    },

    logout: () => {
      localStorage.clear();
      set({ user: null, accessToken: null, refreshToken: null });
    },
  };
});
