"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import apiClient from "@/api/client";
<<<<<<< HEAD
import { getAuthSessionFlag } from "@/api/cookie-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { hydrate, isHydrated } = useAuthStore();
=======
import { getAuthSessionFlag, getRefreshTokenCookie } from "@/api/cookie-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { hydrate, isHydrated, setRefreshToken } = useAuthStore();
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f

  useEffect(() => {
    async function initAuth() {
      const hasSessionFlag = getAuthSessionFlag();

      if (hasSessionFlag) {
        try {
<<<<<<< HEAD
          const response = await apiClient.get("/users/me");
          const user = response.data?.data;
          hydrate(user, null, null);
=======
          const refreshToken = getRefreshTokenCookie();

          // ✅ Put refresh token in store FIRST so the interceptor
          // has it ready before any API call goes out
          if (refreshToken) setRefreshToken(refreshToken);

          const response = await apiClient.get("/users/me");
          const user = response.data?.data;
          hydrate(user, null, refreshToken);
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
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
<<<<<<< HEAD
  }, [hydrate, isHydrated]);
=======
  }, [hydrate, isHydrated, setRefreshToken]);
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f

  return <>{children}</>;
}
