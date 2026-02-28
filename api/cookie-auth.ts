import { setCookie, getCookie, deleteCookie } from "cookies-next";

export function setAuthCookies(isLoggedIn: boolean) {
  setCookie("auth_session_flag", isLoggedIn, {
    // maxAge: sevenDays,
    path: "/",
    sameSite: "lax",
    secure: false,
  });
}

export function clearAuthCookies() {
  deleteCookie("auth_session_flag");
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
