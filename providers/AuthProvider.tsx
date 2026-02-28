"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import apiClient from "@/api/client";
import { getAuthSessionFlag } from "@/api/cookie-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { hydrate, isHydrated } = useAuthStore();

  useEffect(() => {
    async function initAuth() {
      const hasSessionFlag = getAuthSessionFlag();

      if (hasSessionFlag) {
        try {
          const response = await apiClient.get("/users/me");
          const user = response.data?.data;
          hydrate(user, null);
        } catch (error) {
          console.error("Auth hydration failed:", error);
          hydrate(null, null);
        }
      } else {
        hydrate(null, null);
      }
    }

    if (!isHydrated) {
      initAuth();
    }
  }, [hydrate, isHydrated]);

  return <>{children}</>;
}
