import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import {
  COOKIE_DONE,
  COOKIE_SESSION,
  COOKIE_UID,
  isSessionCookieValidEdge,
} from "@/lib/auth/sessionCookieEdge";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const LOCALE_PREFIXES = routing.locales
  .filter((l) => l !== routing.defaultLocale)
  .map((l) => `/${l}`);

function stripLocalePrefix(pathname: string): string {
  for (const prefix of LOCALE_PREFIXES) {
    if (pathname === prefix) return "/";
    if (pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length) || "/";
    }
  }
  return pathname;
}

function isPublicPath(pathname: string): boolean {
  const base = stripLocalePrefix(pathname);
  if (base === "/") return true;
  if (base.startsWith("/login")) return true;
  if (base.startsWith("/welcome")) return true;
  if (base.startsWith("/api")) return true;
  if (base.startsWith("/_next")) return true;
  if (base === "/favicon.ico") return true;
  return false;
}

function hasValidSession(req: NextRequest): boolean {
  const session = req.cookies.get(COOKIE_SESSION)?.value;
  if (isSessionCookieValidEdge(session)) return true;
  const done = req.cookies.get(COOKIE_DONE)?.value === "1";
  const uid = req.cookies.get(COOKIE_UID)?.value?.trim();
  return Boolean(done && uid);
}

export default function middleware(req: NextRequest) {
  const intlResponse = intlMiddleware(req);
  const pathname = req.nextUrl.pathname;

  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  if (isPublicPath(pathname)) {
    return intlResponse;
  }

  if (hasValidSession(req)) {
    return intlResponse;
  }

  const locale =
    routing.locales.find(
      (l) =>
        l !== routing.defaultLocale &&
        (pathname === `/${l}` || pathname.startsWith(`/${l}/`)),
    ) ?? routing.defaultLocale;

  const url = req.nextUrl.clone();
  url.pathname =
    locale === routing.defaultLocale ? "/welcome" : `/${locale}/welcome`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
