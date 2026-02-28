// auth-store.ts - Keep as-is, this is good!
import { create } from "zustand";
import { clearAuthCookies } from "@/api/cookie-auth";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isHydrated: boolean;

  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  hydrate: (user: User | null, accessToken: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,
  isHydrated: false,

  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),

  hydrate: (user, accessToken = null) =>
    set({
      user,
      accessToken,
      isLoading: false,
      isHydrated: true,
    }),

  logout: () => {
    clearAuthCookies();
    set({ user: null, accessToken: null, isLoading: false });
  },
}));
