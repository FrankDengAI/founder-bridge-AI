import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";

const MIN = 1;
const MAX = 8;

export async function GET() {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ steps: [] as number[], anonymous: true });
  }
  const rows = await prisma.userLessonProgress.findMany({
    where: { userId, done: true },
    select: { step: true },
  });
  return NextResponse.json({
    steps: rows.map((r) => r.step).filter((s) => s >= MIN && s <= MAX),
    anonymous: false,
  });
}

export async function POST(req: Request) {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as { step?: number; done?: boolean };
  const step = Number(body.step);
  if (!Number.isFinite(step) || step < MIN || step > MAX) {
    return NextResponse.json({ error: "invalid step" }, { status: 400 });
  }
  const done = body.done !== false;
  if (done) {
    await prisma.userLessonProgress.upsert({
      where: { userId_step: { userId, step } },
      create: { userId, step, done: true },
      update: { done: true },
    });
  } else {
    await prisma.userLessonProgress.deleteMany({ where: { userId, step } });
  }
  const rows = await prisma.userLessonProgress.findMany({
    where: { userId, done: true },
    select: { step: true },
  });
  return NextResponse.json({
    steps: rows.map((r) => r.step),
  });
}
