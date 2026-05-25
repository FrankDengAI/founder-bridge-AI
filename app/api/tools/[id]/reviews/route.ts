import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";

type Ctx = { params: { id: string } };

export async function POST(req: Request, { params }: Ctx) {
  const sessionUserId = getUserIdFromCookies();
  if (!sessionUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    userName?: string;
    rating?: number;
    comment?: string;
  };
  const userName = body.userName?.trim() || "匿名用户";
  const rating = Math.min(5, Math.max(1, Math.floor(Number(body.rating ?? 5))));
  const comment = (body.comment ?? "").trim();

  const tool = await prisma.tool.findUnique({ where: { id: params.id } });
  if (!tool) return NextResponse.json({ error: "not found" }, { status: 404 });

  await prisma.toolReview.create({
    data: { toolId: params.id, userName, rating, comment },
  });

  const reviews = await prisma.toolReview.findMany({
    where: { toolId: params.id },
    orderBy: { createdAt: "desc" },
  });
  const avg =
    reviews.reduce((s, r) => s + r.rating, 0) / Math.max(1, reviews.length);
  await prisma.tool.update({
    where: { id: params.id },
    data: { avgRating: Math.round(avg * 10) / 10 },
  });

  revalidatePath(`/tools/${params.id}`);
  revalidatePath("/tools");
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const sessionUserId = getUserIdFromCookies();
  if (!sessionUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    reviewId?: string;
    authorReply?: string;
  };
  if (!body.reviewId?.trim()) {
    return NextResponse.json({ error: "missing reviewId" }, { status: 400 });
  }
  const review = await prisma.toolReview.findFirst({
    where: { id: body.reviewId, toolId: params.id },
  });
  if (!review) return NextResponse.json({ error: "not found" }, { status: 404 });

  await prisma.toolReview.update({
    where: { id: body.reviewId },
    data: { authorReply: (body.authorReply ?? "").trim() },
  });
  revalidatePath(`/tools/${params.id}`);
  return NextResponse.json({ ok: true });
}
