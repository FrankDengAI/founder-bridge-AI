import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";

export async function GET() {
  const userId = getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ orders: [] });
  }
  const orders = await prisma.demoOrder.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { market: true },
  });
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const userId = getUserIdFromCookies();
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
  const existing = await prisma.demoOrder.findFirst({
    where: { userId, marketId },
    include: { market: true },
  });
  const order =
    existing ??
    (await prisma.demoOrder.create({
      data: { userId, marketId, status: "DEMO_PAID" },
      include: { market: true },
    }));
  revalidatePath("/orders");
  return NextResponse.json({ order });
}
