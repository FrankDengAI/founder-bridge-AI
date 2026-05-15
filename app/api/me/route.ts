import { NextResponse } from "next/server";
import { getUserIdFromCookies } from "@/lib/session";

export async function GET() {
  const userId = getUserIdFromCookies();
  return NextResponse.json({ userId });
}
