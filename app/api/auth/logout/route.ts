import { NextResponse } from "next/server";
import { clearSessionOnResponse } from "@/lib/auth/sessionStore";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  await clearSessionOnResponse(res);
  return res;
}
