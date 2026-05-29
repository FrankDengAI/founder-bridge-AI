/**
 * Edge / middleware 专用：仅校验 Cookie 格式与过期，不使用 Node crypto 或 Web Crypto。
 * 完整 HMAC 验签由 Node 端 sessionCookie.ts + 数据库负责。
 */
export const COOKIE_SESSION = "vbc_session";

/** @deprecated 旧演示 cookie，读取时兼容 */
export const COOKIE_DONE = "vbc_done";
export const COOKIE_UID = "vbc_uid";

/** middleware 门控：格式 + 未过期（演示部署零配置，不依赖 SESSION_SECRET） */
export function parseSessionCookieShape(
  raw: string | undefined,
): { sessionId: string; expiresAtMs: number } | null {
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length !== 3) return null;
  const [sessionId, expStr, sig] = parts;
  const expiresAtMs = Number(expStr);
  if (!sessionId || !/^[a-f0-9]{16,64}$/i.test(sessionId) || !Number.isFinite(expiresAtMs)) {
    return null;
  }
  if (!sig || sig.length < 8) return null;
  if (Date.now() > expiresAtMs) return null;
  return { sessionId, expiresAtMs };
}

export function isSessionCookieValidEdge(raw: string | undefined): boolean {
  return parseSessionCookieShape(raw) !== null;
}
