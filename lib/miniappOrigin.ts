import { modePickerHref } from "./viewMode";

const DEV_FALLBACK_ORIGIN = "http://localhost:3000";

function resolveExplicitMiniapp(): string | null {
  const raw = process.env.NEXT_PUBLIC_MINIAPP_URL?.trim();
  if (!raw) return null;
  const cleaned = raw.replace(/\/$/, "");
  try {
    const u = new URL(cleaned);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return null;
    }
    return cleaned;
  } catch {
    return null;
  }
}

function resolveSiteUrl(): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (!site) return "";
  try {
    const u = new URL(site);
    if (u.protocol === "http:" || u.protocol === "https:") {
      return site;
    }
  } catch {
    /* ignore */
  }
  return "";
}

function sameOrigin(a: string, b: string): boolean {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    return false;
  }
}

/**
 * 是否「品牌站与 App 分域」：仅当 NEXT_PUBLIC_MINIAPP_URL 为合法 URL，
 * 且与 NEXT_PUBLIC_SITE_URL（或构建时推断的站点）不同源时为 true。
 * 若变量仍指向本站（合并部署常见误留配置），视为同源合并，不按外站处理。
 */
export function isExternalMiniapp(): boolean {
  const explicit = resolveExplicitMiniapp();
  if (!explicit) return false;
  const site = resolveSiteUrl();
  if (site && sameOrigin(explicit, site)) return false;
  return true;
}

/**
 * App 壳 origin（用于绝对 URL）。同源合并部署时来自 NEXT_PUBLIC_SITE_URL（Vercel 由 VERCEL_URL 注入）。
 */
export function miniappOrigin(): string {
  if (isExternalMiniapp()) {
    return resolveExplicitMiniapp() || "";
  }
  const site = resolveSiteUrl();
  if (site) return site;
  const explicit = resolveExplicitMiniapp();
  if (explicit) return explicit;

  if (process.env.NODE_ENV === "development") {
    return DEV_FALLBACK_ORIGIN;
  }
  return "";
}

/** 打开 App 区链接：分域用绝对地址，合并部署用站内路径 */
export function appShellHref(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!isExternalMiniapp()) return normalized;
  const ext = resolveExplicitMiniapp();
  if (!ext) return normalized;
  return `${ext.replace(/\/$/, "")}${normalized}`;
}

/** 进入 App 体验（经模式选择页） */
export function appEntryHref(next = "/home"): string {
  return appShellHref(modePickerHref(next));
}

/** 是否可展示「打开 App」类外链（分域时必须已配置 NEXT_PUBLIC_MINIAPP_URL） */
export function appDemoReady(): boolean {
  if (!isExternalMiniapp()) return true;
  return Boolean(resolveExplicitMiniapp());
}

/** 登录嵌入是否具备目标地址（同源合并始终 true；仅分域且缺合法外站 URL 时为 false） */
export function isMiniappConfigured(): boolean {
  if (!isExternalMiniapp()) return true;
  return Boolean(resolveExplicitMiniapp());
}

/** `/login` 内嵌 iframe 的 src：合并部署固定为站内路径，分域时为外站绝对地址 */
export function loginIframeSrc(): string {
  if (!isExternalMiniapp()) return "/welcome/login?embed=1";
  const ext = resolveExplicitMiniapp();
  if (!ext) return "/welcome/login?embed=1";
  return `${ext.replace(/\/$/, "")}/welcome/login?embed=1`;
}
