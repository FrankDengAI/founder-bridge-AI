/** 认证与环境开关 */
import { randomBytes } from "crypto";

let runtimeSessionSecret: string | null = null;

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
  if (runtimeSessionSecret) return runtimeSessionSecret;

  const s = process.env.SESSION_SECRET?.trim();
  if (s && s.length >= 16) {
    runtimeSessionSecret = s;
    return s;
  }

  if (process.env.NODE_ENV !== "production") {
    runtimeSessionSecret = "dev-session-secret-change-me";
    return runtimeSessionSecret;
  }

  runtimeSessionSecret = randomBytes(32).toString("hex");
  process.env.SESSION_SECRET = runtimeSessionSecret;
  console.warn(
    "[auth] SESSION_SECRET 未配置，已自动生成临时密钥（重启后全员需重新登录）。",
  );
  return runtimeSessionSecret;
}

export function hasConfiguredSessionSecret(): boolean {
  const s = process.env.SESSION_SECRET?.trim();
  return Boolean(s && s.length >= 16);
}

export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;

export const AUTH_TOKEN_TTL = {
  email_verify: 60 * 60 * 24,
  password_reset: 60 * 60,
} as const;

export type AuthTokenType = keyof typeof AUTH_TOKEN_TTL;
