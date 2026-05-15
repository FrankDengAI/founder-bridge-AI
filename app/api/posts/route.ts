import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isPostType } from "@/lib/domain/postType";
import { getUserIdFromCookies } from "@/lib/session";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idsRaw = (searchParams.get("ids") ?? "").trim();
  const q = (searchParams.get("q") ?? "").trim();
  const type = searchParams.get("type");
  const authorId = searchParams.get("authorId");
  const take = Math.min(60, Math.max(1, Number(searchParams.get("take") ?? "40")));
  const sort = (searchParams.get("sort") ?? "new").toLowerCase();
  const orderBy =
    sort === "hot"
      ? [{ likes: "desc" as const }, { createdAt: "desc" as const }]
      : { createdAt: "desc" as const };

  const idList = idsRaw
    ? idsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 60)
    : [];

  const posts = await prisma.post.findMany({
    where: {
      AND: [
        idList.length ? { id: { in: idList } } : {},
        q
          ? {
              OR: [
                { title: { contains: q } },
                { excerpt: { contains: q } },
              ],
            }
          : {},
        type && isPostType(type) ? { type } : {},
        authorId ? { authorId } : {},
      ],
    },
    /** 按 id 批量拉取时由应用层保序，避免多余排序开销 */
    orderBy: idList.length ? undefined : orderBy,
    take: idList.length ? idList.length : take,
    include: { author: { select: { id: true, displayName: true } } },
  });

  const ordered =
    idList.length > 0
      ? (() => {
          const byId = new Map(posts.map((p) => [p.id, p]));
          return idList
            .map((id) => byId.get(id))
            .filter((p): p is NonNullable<typeof p> => Boolean(p));
        })()
      : posts;

  return NextResponse.json({ posts: ordered });
}

export async function POST(req: Request) {
  const sessionUserId = getUserIdFromCookies();
  if (!sessionUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    userId?: string;
    title?: string;
    excerpt?: string;
    body?: string;
    type?: string;
    coverUrl?: string;
    tags?: string[];
  };

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "missing title" }, { status: 400 });
  }

  const claimed = body.userId?.trim();
  if (claimed && claimed !== sessionUserId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({ where: { id: sessionUserId } });
  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  const type = body.type && isPostType(body.type) ? body.type : "NOTE";
  const tags = Array.isArray(body.tags) ? body.tags.filter((x) => typeof x === "string") : [];

  const post = await prisma.post.create({
    data: {
      authorId: sessionUserId,
      type,
      title: body.title.trim(),
      excerpt: (body.excerpt ?? "").trim(),
      body: (body.body ?? "").trim(),
      coverUrl:
        body.coverUrl?.trim() ||
        `https://picsum.photos/seed/publish-${Date.now()}/800/1000`,
      tags: JSON.stringify(tags.length ? tags : ["VibeCoding"]),
    },
  });

  revalidatePath("/home");
  revalidatePath(`/user/${sessionUserId}`);
  return NextResponse.json({ post });
}
