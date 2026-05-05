
import axios, { AxiosRequestConfig } from "axios";
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
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null = null) {
  refreshQueue.forEach((p) =>
    error ? p.reject(error) : p.resolve(token as string),
  );
  refreshQueue = [];
}

// ─── REQUEST INTERCEPTOR ──────────────────────────────────────────────────────

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

// ─── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;
    const isUnauthorized = status === 401 || status === 403;

    // If the refresh call itself fails → logout immediately
    if (isUnauthorized && originalRequest?.url?.includes("/auth/refresh")) {
      useAuthStore.getState().logout();
      window.location.replace("/auth/sign-in");
      return Promise.reject(error);
    }

    if (!isUnauthorized || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Queue subsequent requests while refresh is in flight
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          // Inject the fresh token before retrying
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const { refreshToken, hydrate } = useAuthStore.getState();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // ── Refresh call ──────────────────────────────────────────────────────
      const refreshRes = await axios.post(`${API_BASE}/auth/refresh`, {
        refresh_token: refreshToken,
      });

      // Log the shape once in dev so you can confirm the key name
      if (process.env.NODE_ENV === "development") {
        console.log("[auth/refresh] response data:", refreshRes.data);
      }

      // Extract access token — adjust key if your API uses a different name
      const newAccessToken: string | undefined =
        refreshRes.data?.data?.access_token ??
        refreshRes.data?.access_token ??
        refreshRes.data?.data?.access ??
        refreshRes.data?.access;

      if (!newAccessToken) {
        throw new Error(
          `No access token in refresh response. Got: ${JSON.stringify(refreshRes.data)}`,
        );
      }

      // Use rotated refresh token if backend provides one, else keep existing
      const newRefreshToken: string =
        refreshRes.data?.data?.refresh_token ??
        refreshRes.data?.refresh_token ??
        refreshRes.data?.data?.refresh ??
        refreshRes.data?.refresh ??
        refreshToken;

      setRefreshTokenCookie(newRefreshToken);

      // ── Fetch current user with new token ─────────────────────────────────
      const meRes = await axios.get(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });

      const user = meRes.data?.data;
      hydrate(user, newAccessToken, newRefreshToken);

      // Flush queue — give every waiting request the new token
      processQueue(null, newAccessToken);

      // Retry the original request with injected token
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };
      return apiClient(originalRequest);
    } catch (err) {
      processQueue(err, null);
      useAuthStore.getState().logout();
      window.location.replace("/auth/sign-in");
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
