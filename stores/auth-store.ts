import { create } from "zustand";
import {
  clearAuthCookies,
  setAuthCookies,
  setRefreshTokenCookie,
} from "@/api/cookie-auth";
import { setCookie, deleteCookie } from "cookies-next";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isHydrated: boolean;

  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void; // 👈 added
  hydrate: (
    user: User | null,
    accessToken: string | null,
    refreshToken: string | null,
  ) => void;
  logout: () => void;
}

const COOKIE_OPTS = { path: "/", sameSite: "lax", secure: false } as const;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isHydrated: false,

  setUser: (user) => {
    if (user) setCookie("auth_user", JSON.stringify(user), COOKIE_OPTS);
    else deleteCookie("auth_user");
    set({ user });
  },

  setAccessToken: (token) => set({ accessToken: token }),

  setRefreshToken: (token) => set({ refreshToken: token }), // 👈 added

  hydrate: (user, accessToken = null, refreshToken = null) => {
    if (user) {
      setAuthCookies(true);
      setCookie("auth_user", JSON.stringify(user), COOKIE_OPTS);
      if (refreshToken) setRefreshTokenCookie(refreshToken);
    } else {
      clearAuthCookies();
    }

    set({
      user,
      accessToken,
      refreshToken,
      isLoading: false,
      isHydrated: true,
    });
  },

  logout: () => {
    clearAuthCookies();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isHydrated: false,
    });
  },
}));
