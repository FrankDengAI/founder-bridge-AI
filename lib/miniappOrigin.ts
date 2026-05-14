const DEV_FALLBACK_ORIGIN = "http://localhost:3000";

function resolveFromEnv(): string | null {
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

/** 小程序/App 壳演示地址。生产环境未配置 NEXT_PUBLIC_MINIAPP_URL 时返回空字符串。 */
export function miniappOrigin(): string {
  const fromEnv = resolveFromEnv();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "development") {
    return DEV_FALLBACK_ORIGIN;
  }
  return "";
}

export function isMiniappConfigured(): boolean {
  return miniappOrigin() !== "";
}
