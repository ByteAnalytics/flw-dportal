/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { setRefreshTokenCookie } from "@/api/cookie-auth";

const apiBaseUrl = EnvironmentHelper.getApiBaseUrl();
const API_BASE = apiBaseUrl;

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

let isRefreshing = false;
let refreshQueue: {
  resolve: (token?: string) => void;
  reject: (error?: any) => void;
}[] = [];

function processQueue(error: any, token: string | null = null) {
  refreshQueue.forEach((p) =>
    error ? p.reject(error) : p.resolve(token || undefined),
  );
  refreshQueue = [];
}

// --- REQUEST INTERCEPTOR ---
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// --- RESPONSE INTERCEPTOR ---
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestFailed = status === 401 || status === 403;

    if (requestFailed && originalRequest?.url?.includes("/auth/refresh")) {
      const { logout } = useAuthStore.getState();
      logout();
      window.location.replace("/auth/sign-in");
      return Promise.reject(error);
    }

    if (requestFailed && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const { refreshToken, hydrate } = useAuthStore.getState();

        const refreshRes = await axios.post(
          `${API_BASE}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const newAccessToken =
          refreshRes.data?.data?.access_token ||
          refreshRes.data?.data ||
          refreshRes.data?.access_token;

        if (!newAccessToken) {
          throw new Error("Failed to refresh token - no access token received");
        }

        // Use rotated refresh token if backend provides one, else keep existing
        const newRefreshToken =
          refreshRes.data?.data?.refresh_token ?? refreshToken;

        // Always persist the refresh token to cookie after a successful refresh
        if (newRefreshToken) setRefreshTokenCookie(newRefreshToken);

        const meRes = await axios.get(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${newAccessToken}` }
        });

        const user = meRes.data?.data;

        hydrate(user, newAccessToken, newRefreshToken);

        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (err) {
        const { logout } = useAuthStore.getState();
        processQueue(err, null);
        logout();
        window.location.replace("/auth/sign-in");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
