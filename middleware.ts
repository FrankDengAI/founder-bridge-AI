import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import {
  COOKIE_DONE,
  COOKIE_SESSION,
  COOKIE_UID,
  isSessionCookieValidEdge,
} from "@/lib/auth/sessionCookieEdge";
import { routing } from "@/i18n/routing";
import {
  detectLocaleFromPathname,
  isAppLocale,
  LOCALE_COOKIE,
  localizedPath,
  resolveLocaleFromRequest,
  stripLocalePrefix,
} from "@/lib/localePath";

const intlMiddleware = createIntlMiddleware(routing);

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

function copyCookies(from: NextResponse, to: NextResponse) {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie);
  }
}

function redirectWithIntlCookies(
  req: NextRequest,
  intlResponse: NextResponse,
  pathname: string,
  status = 307,
): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  url.search = req.nextUrl.search;
  const response = NextResponse.redirect(url, status);
  copyCookies(intlResponse, response);
  return response;
}

export default function middleware(req: NextRequest) {
  const intlResponse = intlMiddleware(req);
  const pathname = req.nextUrl.pathname;

  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const urlLocale = detectLocaleFromPathname(pathname);

  // 仅当用户已选择英文（cookie=en）但 URL 仍为默认中文路径时，补跳 /en 前缀。
  // 不可反向把 /en/* 剥回 /*：切换语言时 URL 往往先于 cookie 更新，否则会闪回中文。
  if (
    cookieLocale === "en" &&
    urlLocale === routing.defaultLocale
  ) {
    const basePath = stripLocalePrefix(pathname);
    const target = localizedPath(basePath, "en");
    return redirectWithIntlCookies(req, intlResponse, target);
  }

  if (isPublicPath(pathname)) {
    return intlResponse;
  }

  if (hasValidSession(req)) {
    return intlResponse;
  }

  const locale = resolveLocaleFromRequest(pathname, cookieLocale);
  const welcomePath =
    locale === routing.defaultLocale ? "/welcome" : `/${locale}/welcome`;
  return redirectWithIntlCookies(req, intlResponse, welcomePath);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
