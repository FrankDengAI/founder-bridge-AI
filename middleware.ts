import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_DONE, COOKIE_SESSION, isSessionCookieValid } from "@/lib/auth/sessionCookie";

function isPublicPath(pathname: string) {
  if (pathname === "/") return true;
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/welcome")) return true;
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico") return true;
  return false;
}

function hasValidSession(req: NextRequest): boolean {
  const session = req.cookies.get(COOKIE_SESSION)?.value;
  if (isSessionCookieValid(session)) return true;
  // 兼容旧演示 cookie
  if (req.cookies.get(COOKIE_DONE)?.value === "1") return true;
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (hasValidSession(req)) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/welcome";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
