import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";

export async function POST(req: Request) {
  const followerId = await getUserIdFromCookies();
  if (!followerId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as { followingId?: string };
  const followingId = body.followingId?.trim();
  if (!followingId || followingId === followerId) {
    return NextResponse.json({ error: "invalid followingId" }, { status: 400 });
  }
  const target = await prisma.user.findUnique({ where: { id: followingId } });
  if (!target) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }
  await prisma.follow.upsert({
    where: {
      followerId_followingId: { followerId, followingId },
    },
    create: { followerId, followingId },
    update: {},
  });
  revalidatePath(`/user/${followingId}`);
  revalidatePath("/home");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const followerId = await getUserIdFromCookies();
  if (!followerId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as { followingId?: string };
  const followingId = body.followingId?.trim();
  if (!followingId) {
    return NextResponse.json({ error: "missing followingId" }, { status: 400 });
  }
  await prisma.follow.deleteMany({
    where: { followerId, followingId },
  });
  revalidatePath(`/user/${followingId}`);
  revalidatePath("/home");
  return NextResponse.json({ ok: true });
}
