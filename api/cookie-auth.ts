import { setCookie, getCookie, deleteCookie } from "cookies-next";

const COOKIE_OPTS = { path: "/", sameSite: "lax", secure: false } as const;

export function setAuthCookies(isLoggedIn: boolean) {
  setCookie("auth_session_flag", isLoggedIn, COOKIE_OPTS);
}

export function clearAuthCookies() {
  deleteCookie("auth_session_flag");
  deleteCookie("auth_user");
  deleteCookie("auth_refresh_token");
}

export function getAuthSessionFlag() {
  return getCookie("auth_session_flag");
}

export function getAuthUser() {
  const rawUser = getCookie("auth_user");
  try {
    return rawUser ? JSON.parse(rawUser as string) : null;
  } catch (error) {
    console.error("Failed to parse auth_user cookie:", error);
    return null;
  }
}

export function setRefreshTokenCookie(token: string) {
  setCookie("auth_refresh_token", token, COOKIE_OPTS);
}

export function getRefreshTokenCookie(): string | null {
  return (getCookie("auth_refresh_token") as string) ?? null;
}
