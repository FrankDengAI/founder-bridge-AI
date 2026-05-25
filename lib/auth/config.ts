/** 认证与环境开关 */
export function isDemoLoginEnabled(): boolean {
  return process.env.ENABLE_DEMO_LOGIN === "true";
}

export function isGuestEnabled(): boolean {
  return process.env.ENABLE_GUEST === "true";
}

export function appBaseUrl(): string {
  const raw =
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export function sessionSecret(): string {
  const s = process.env.SESSION_SECRET?.trim();
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV !== "production") {
    return "dev-session-secret-change-me";
  }
  throw new Error("SESSION_SECRET is required in production");
}

export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;

export const AUTH_TOKEN_TTL = {
  email_verify: 60 * 60 * 24,
  password_reset: 60 * 60,
} as const;

export type AuthTokenType = keyof typeof AUTH_TOKEN_TTL;
