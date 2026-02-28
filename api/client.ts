/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { useModelTypeStore } from "@/stores/model-type-store";
import { ModelTypeEnum } from "@/types/model-type-store";

const isProduction =
  EnvironmentHelper.isProduction() || EnvironmentHelper.isDemo();

const apiBaseUrl = EnvironmentHelper.getApiBaseUrl();

// const API_BASE = !isProduction ? "/api/proxy" : apiBaseUrl;

const API_BASE = apiBaseUrl;

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  // withCredentials: true,
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
      // config.headers["ngrok-skip-browser-warning"] = "true";
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

    // Prevent infinite loop if refresh endpoint itself fails
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
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const refreshRes = await axios.post(
          `${API_BASE}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );

        const newAccessToken =
          refreshRes.data?.data?.access_token ||
          refreshRes.data?.data ||
          refreshRes.data?.access_token;

        if (!newAccessToken) {
          throw new Error("Failed to refresh token - no access token received");
        }

        const meRes = await axios.get(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${newAccessToken}` },
          withCredentials: true,
        });

        const user = meRes.data?.data;

        const { hydrate } = useAuthStore.getState();

        hydrate(user, newAccessToken);

        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (err) {
        // Refresh failed - reject all queued requests
        const { logout } = useAuthStore.getState();
        const { setSelectedModel } = useModelTypeStore.getState();

        processQueue(err, null);
        logout();
        setSelectedModel(ModelTypeEnum.ECLGuarantee);
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
