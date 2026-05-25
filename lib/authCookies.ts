import type { NextResponse } from "next/server";

export const COOKIE_DONE = "vbc_done";
export const COOKIE_UID = "vbc_uid";

const MAX_AGE = 60 * 60 * 24 * 30;
const IS_PROD = process.env.NODE_ENV === "production";

export function sessionCookieBase() {
  return {
    path: "/",
    maxAge: MAX_AGE,
    sameSite: "lax" as const,
    httpOnly: true,
    secure: IS_PROD,
  };
}

export function setSessionOnResponse(res: NextResponse, userId: string) {
  const base = sessionCookieBase();
  res.cookies.set(COOKIE_DONE, "1", base);
  res.cookies.set(COOKIE_UID, userId, base);
}

export function clearSessionOnResponse(res: NextResponse) {
  res.cookies.set(COOKIE_DONE, "", { path: "/", maxAge: 0 });
  res.cookies.set(COOKIE_UID, "", { path: "/", maxAge: 0 });
}
