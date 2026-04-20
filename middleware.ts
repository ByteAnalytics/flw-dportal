import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { EnvironmentHelper } from "./lib/environment-utils";

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const isLoggedIn = cookies.get("auth_session_flag")?.value;

  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const isRootRoute = nextUrl.pathname === "/";

  // Intercept favicon requests
  if (nextUrl.pathname === "/favicon.ico") {
    const env = EnvironmentHelper.getCurrent();

    // Determine which favicon to serve based on environment
    let faviconFile: string;
    switch (env) {
      case "demo":
        faviconFile = "/byteicon.ico";
        break;
      case "production":
      default:
        faviconFile = "/favicon.ico";
        break;
    }

    // Rewrite the request to the environment-specific favicon
    // Try /public directory first, then /app as fallback
    const publicFaviconUrl = new URL(faviconFile, req.url);

    // check if the file exists, but for simplicity we'll rewrite
    return NextResponse.rewrite(publicFaviconUrl);
  }

  // Redirect base "/" → /dashboard if authenticated
  if (isRootRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }
  }

  // If visiting dashboard without auth → redirect to login
  if (isDashboardRoute && !isLoggedIn) {
    const loginUrl = new URL("/auth/sign-in", req.url);
    loginUrl.searchParams.set("from", nextUrl.pathname); // optional redirect path
    return NextResponse.redirect(loginUrl);
  }

  // If visiting auth page while already logged in → redirect to dashboard
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Otherwise, allow access
  return NextResponse.next();
}

// Match middleware to all relevant routes including favicon
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/auth/:path*",
    "/favicon.ico", // Add favicon to middleware matcher
  ],
};
