import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";

export async function GET() {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ items: [] });
  }
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { market: true },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as { marketId?: string };
  const marketId = body.marketId?.trim();
  if (!marketId) {
    return NextResponse.json({ error: "missing marketId" }, { status: 400 });
  }
  const m = await prisma.marketItem.findUnique({ where: { id: marketId } });
  if (!m) return NextResponse.json({ error: "not found" }, { status: 404 });
  await prisma.wishlistItem.upsert({
    where: { userId_marketId: { userId, marketId } },
    create: { userId, marketId },
    update: {},
  });
  revalidatePath("/tools");
  revalidatePath("/orders");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as { marketId?: string };
  const marketId = body.marketId?.trim();
  if (!marketId) {
    return NextResponse.json({ error: "missing marketId" }, { status: 400 });
  }
  await prisma.wishlistItem.deleteMany({ where: { userId, marketId } });
  revalidatePath("/tools");
  revalidatePath("/orders");
  return NextResponse.json({ ok: true });
}
