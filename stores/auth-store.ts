import { create } from "zustand";
<<<<<<< HEAD
import { clearAuthCookies } from "@/api/cookie-auth";
=======
import {
  clearAuthCookies,
  setAuthCookies,
  setRefreshTokenCookie,
} from "@/api/cookie-auth";
import { setCookie, deleteCookie } from "cookies-next";
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
import { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isHydrated: boolean;

  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
<<<<<<< HEAD
=======
  setRefreshToken: (token: string | null) => void; // 👈 added
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
  hydrate: (
    user: User | null,
    accessToken: string | null,
    refreshToken: string | null,
  ) => void;
  logout: () => void;
}

<<<<<<< HEAD
=======
const COOKIE_OPTS = { path: "/", sameSite: "lax", secure: false } as const;

>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isHydrated: false,

<<<<<<< HEAD
  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),

  hydrate: (user, accessToken = null, refreshToken = null) =>
=======
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

>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
    set({
      user,
      accessToken,
      refreshToken,
      isLoading: false,
      isHydrated: true,
<<<<<<< HEAD
    }),
=======
    });
  },
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f

  logout: () => {
    clearAuthCookies();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
<<<<<<< HEAD
=======
      isHydrated: false,
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
    });
  },
}));
