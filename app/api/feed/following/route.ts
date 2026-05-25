import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const uid = getUserIdFromCookies();
  if (!uid) {
    return NextResponse.json({ items: [] });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(10, Math.max(1, Number(searchParams.get("limit")) || 5));

  const follows = await prisma.follow.findMany({
    where: { followerId: uid },
    select: { followingId: true },
    take: 50,
  });
  const followingIds = follows.map((f) => f.followingId);
  if (followingIds.length === 0) {
    return NextResponse.json({ items: [] });
  }

  const posts = await prisma.post.findMany({
    where: { authorId: { in: followingIds }, status: "published" },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      author: { select: { id: true, displayName: true, avatarUrl: true } },
    },
  });

  return NextResponse.json({
    items: posts.map((p) => ({
      postId: p.id,
      title: p.title,
      type: p.type,
      authorId: p.author.id,
      authorName: p.author.displayName,
      avatarUrl: p.author.avatarUrl,
      createdAt: p.createdAt.toISOString(),
    })),
  });
}
