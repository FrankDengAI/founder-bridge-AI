import { createHash, randomBytes } from "node:crypto";
import type { AuthTokenType } from "@/lib/auth/config";
import { AUTH_TOKEN_TTL } from "@/lib/auth/config";

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export function generateRawToken(): string {
  return randomBytes(32).toString("base64url");
}

export function authTokenExpiresAt(type: AuthTokenType): Date {
  return new Date(Date.now() + AUTH_TOKEN_TTL[type] * 1000);
}
