import "server-only";
import { randomBytes } from "crypto";
import { cache } from "react";
import type { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_MAX_AGE_SEC } from "@/lib/auth/config";
import { hashToken } from "@/lib/auth/tokens";
import {
  buildSessionCookieValue,
  COOKIE_DONE,
  COOKIE_SESSION,
  COOKIE_UID,
  parseSessionCookie,
} from "@/lib/auth/sessionCookie";

export {
  COOKIE_DONE,
  COOKIE_SESSION,
  COOKIE_UID,
  isSessionCookieValid,
  parseSessionCookie,
} from "@/lib/auth/sessionCookie";

const IS_PROD = process.env.NODE_ENV === "production";

function cookieBase() {
  return {
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
    sameSite: "lax" as const,
    httpOnly: true,
    secure: IS_PROD,
  };
}

export async function createUserSession(userId: string): Promise<string> {
  const sessionId = randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SEC * 1000);
  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      tokenHash: hashToken(sessionId),
      expiresAt,
    },
  });
  return buildSessionCookieValue(sessionId, expiresAt.getTime());
}

/** 同一 RSC/API 请求内只查库一次，减轻 connection_limit:1 池排队 */
async function resolveUserIdFromSession(): Promise<string | null> {
  const store = cookies();
  const parsed = parseSessionCookie(store.get(COOKIE_SESSION)?.value);
  if (parsed) {
    const row = await prisma.session.findUnique({ where: { id: parsed.sessionId } });
    if (row && row.expiresAt.getTime() > Date.now()) return row.userId;
  }

  return null;
}

export const getUserIdFromSession = cache(resolveUserIdFromSession);

export function setSessionCookieOnResponse(res: NextResponse, cookieValue: string) {
  res.cookies.set(COOKIE_SESSION, cookieValue, cookieBase());
  res.cookies.set(COOKIE_DONE, "", { path: "/", maxAge: 0 });
  res.cookies.set(COOKIE_UID, "", { path: "/", maxAge: 0 });
}

export async function setSessionOnResponse(res: NextResponse, userId: string) {
  const cookieValue = await createUserSession(userId);
  setSessionCookieOnResponse(res, cookieValue);
}

export async function clearSessionOnResponse(res: NextResponse) {
  const store = cookies();
  const parsed = parseSessionCookie(store.get(COOKIE_SESSION)?.value);
  if (parsed) {
    await prisma.session.deleteMany({ where: { id: parsed.sessionId } }).catch(() => {});
  }
  res.cookies.set(COOKIE_SESSION, "", { path: "/", maxAge: 0 });
  res.cookies.set(COOKIE_DONE, "", { path: "/", maxAge: 0 });
  res.cookies.set(COOKIE_UID, "", { path: "/", maxAge: 0 });
}

export function sessionCookieBase() {
  return cookieBase();
}
