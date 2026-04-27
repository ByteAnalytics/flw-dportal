"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import apiClient from "@/api/client";
import { getAuthSessionFlag, getRefreshTokenCookie } from "@/api/cookie-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { hydrate, isHydrated, setRefreshToken } = useAuthStore();

  useEffect(() => {
    async function initAuth() {
      const hasSessionFlag = getAuthSessionFlag();

      if (hasSessionFlag) {
        try {
          const refreshToken = getRefreshTokenCookie();

          // ✅ Put refresh token in store FIRST so the interceptor
          // has it ready before any API call goes out
          if (refreshToken) setRefreshToken(refreshToken);

          const response = await apiClient.get("/users/me");
          const user = response.data?.data;
          hydrate(user, null, refreshToken);
        } catch (error) {
          console.error("Auth hydration failed:", error);
          hydrate(null, null, null);
        }
      } else {
        hydrate(null, null, null);
      }
    }

    if (!isHydrated) {
      initAuth();
    }
  }, [hydrate, isHydrated, setRefreshToken]);

  return <>{children}</>;
}
