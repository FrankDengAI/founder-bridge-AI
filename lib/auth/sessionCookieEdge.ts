/**
 * Edge / middleware 专用：仅用 Web Crypto 校验会话 Cookie，不依赖 Node.js crypto。
 * 有 SESSION_SECRET 时完整验签；无密钥时仅校验格式与过期（零配置演示部署，Node 端仍做完整验签）。
 */
export const COOKIE_SESSION = "vbc_session";

/** @deprecated 旧演示 cookie，读取时兼容 */
export const COOKIE_DONE = "vbc_done";
export const COOKIE_UID = "vbc_uid";

function sessionSecretFromEnv(): string | null {
  const s = process.env.SESSION_SECRET?.trim();
  return s && s.length >= 16 ? s : null;
}

/** 无 SESSION_SECRET 时的弱校验：仅格式 + 未过期（middleware 门禁用） */
function parseSessionCookieShape(
  raw: string | undefined,
): { sessionId: string; expiresAtMs: number } | null {
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length !== 3) return null;
  const [sessionId, expStr] = parts;
  const expiresAtMs = Number(expStr);
  if (!sessionId || !/^[a-f0-9]{16,64}$/i.test(sessionId) || !Number.isFinite(expiresAtMs)) {
    return null;
  }
  if (Date.now() > expiresAtMs) return null;
  return { sessionId, expiresAtMs };
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sign(sessionId: string, expiresAtMs: number, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`${sessionId}.${expiresAtMs}`));
  return base64UrlEncode(new Uint8Array(sig));
}

export async function parseSessionCookieEdge(
  raw: string | undefined,
): Promise<{ sessionId: string; expiresAtMs: number } | null> {
  const secret = sessionSecretFromEnv();
  if (!secret || !raw) return null;

  const parts = raw.split(".");
  if (parts.length !== 3) return null;
  const [sessionId, expStr, sig] = parts;
  const expiresAtMs = Number(expStr);
  if (!sessionId || !Number.isFinite(expiresAtMs)) return null;
  if (Date.now() > expiresAtMs) return null;

  const expected = await sign(sessionId, expiresAtMs, secret);
  if (sig.length !== expected.length) return null;

  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (diff !== 0) return null;

  return { sessionId, expiresAtMs };
}

/** middleware：校验签名与过期，不查库 */
export async function isSessionCookieValidEdge(raw: string | undefined): Promise<boolean> {
  const secret = sessionSecretFromEnv();
  if (secret) {
    return (await parseSessionCookieEdge(raw)) !== null;
  }
  return parseSessionCookieShape(raw) !== null;
}
