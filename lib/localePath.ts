import { routing } from "@/i18n/routing";
import { safeNextPath } from "@/lib/viewMode";
import type { AppLocale } from "@/i18n/routing";

/** next-intl 默认 locale cookie 名 */
export const LOCALE_COOKIE = "NEXT_LOCALE";

const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return Boolean(value && routing.locales.includes(value as AppLocale));
}

/** 去掉 /en 等 locale 前缀，供 Tab 解析与路径匹配 */
export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(LOCALE_PREFIX, "");
  if (!stripped || stripped === "/") return "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

export function detectLocaleFromPathname(pathname: string): AppLocale {
  for (const loc of routing.locales) {
    if (loc === routing.defaultLocale) continue;
    if (pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)) {
      return loc;
    }
  }
  return routing.defaultLocale;
}

/** 浏览器当前路径上的 locale（客户端跳转用） */
export function currentBrowserLocale(): AppLocale {
  if (typeof window === "undefined") return routing.defaultLocale;
  return detectLocaleFromPathname(window.location.pathname);
}
export function localizedPath(path: string, locale?: string): string {
  const loc = locale ?? routing.defaultLocale;
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (loc === routing.defaultLocale) return clean;
  if (clean === "/") return `/${loc}`;
  return `/${loc}${clean}`;
}

/** URL 前缀 > NEXT_LOCALE cookie > defaultLocale */
export function resolveLocaleFromRequest(
  pathname: string,
  cookieLocale?: string | null,
): AppLocale {
  const fromUrl = detectLocaleFromPathname(pathname);
  if (fromUrl !== routing.defaultLocale) return fromUrl;
  if (isAppLocale(cookieLocale)) return cookieLocale;
  return routing.defaultLocale;
}

export function localizedPathWithSearch(
  path: string,
  search: string,
  locale?: AppLocale,
): string {
  const base = localizedPath(path, locale);
  if (!search) return base;
  const qs = search.startsWith("?") ? search.slice(1) : search;
  return qs ? `${base}?${qs}` : base;
}

/** 模式选择页路径（不含 locale，供 next-intl router 使用） */
export function modePickerPath(next = "/home"): string {
  const path = safeNextPath(next);
  return `/welcome/mode?next=${encodeURIComponent(path)}`;
}

export function modePickerHref(next = "/home", locale?: string): string {
  return localizedPath(modePickerPath(next), locale);
}
