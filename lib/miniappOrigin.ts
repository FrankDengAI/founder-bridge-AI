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

/** 是否「品牌站与 App 分域」：仅当显式设置 NEXT_PUBLIC_MINIAPP_URL 时为 true */
export function isExternalMiniapp(): boolean {
  return resolveExplicitMiniapp() !== null;
}

/**
 * App 壳 origin（用于绝对 URL）。同源合并部署时来自 NEXT_PUBLIC_SITE_URL（Vercel 由 VERCEL_URL 注入）。
 */
export function miniappOrigin(): string {
  const explicit = resolveExplicitMiniapp();
  if (explicit) return explicit;

  const site = resolveSiteUrl();
  if (site) return site;

  if (process.env.NODE_ENV === "development") {
    return DEV_FALLBACK_ORIGIN;
  }
  return "";
}

/** 打开 App 区链接：分域用绝对地址，合并部署用站内路径 */
export function appShellHref(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const ext = resolveExplicitMiniapp();
  if (ext) return `${ext.replace(/\/$/, "")}${normalized}`;
  return normalized;
}

/** 是否可展示「打开 App」类外链（分域时必须已配置 NEXT_PUBLIC_MINIAPP_URL） */
export function appDemoReady(): boolean {
  if (!isExternalMiniapp()) return true;
  return Boolean(resolveExplicitMiniapp());
}

/** 登录嵌入是否具备目标地址（分域未配变量时为 false） */
export function isMiniappConfigured(): boolean {
  if (!isExternalMiniapp()) return true;
  return Boolean(resolveExplicitMiniapp());
}
