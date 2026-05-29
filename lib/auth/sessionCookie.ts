import { createHmac, timingSafeEqual } from "crypto";
import { sessionSecret } from "@/lib/auth/config";

export const COOKIE_SESSION = "vbc_session";

/** @deprecated 旧演示 cookie，读取时兼容 */
export const COOKIE_DONE = "vbc_done";
export const COOKIE_UID = "vbc_uid";

function sign(sessionId: string, expiresAtMs: number): string {
  return createHmac("sha256", sessionSecret())
    .update(`${sessionId}.${expiresAtMs}`)
    .digest("base64url");
}

export function parseSessionCookie(
  raw: string | undefined,
): { sessionId: string; expiresAtMs: number } | null {
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length !== 3) return null;
  const [sessionId, expStr, sig] = parts;
  const expiresAtMs = Number(expStr);
  if (!sessionId || !Number.isFinite(expiresAtMs)) return null;
  const expected = sign(sessionId, expiresAtMs);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  if (Date.now() > expiresAtMs) return null;
  return { sessionId, expiresAtMs };
}

export function buildSessionCookieValue(sessionId: string, expiresAtMs: number): string {
  return `${sessionId}.${expiresAtMs}.${sign(sessionId, expiresAtMs)}`;
}

/** Node 端：完整 HMAC 验签（middleware 仅用 sessionCookieEdge 做格式门控） */
export function isSessionCookieValid(raw: string | undefined): boolean {
  return parseSessionCookie(raw) !== null;
}
