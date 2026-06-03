import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isPostType } from "@/lib/domain/postType";
import { getUserIdFromCookies } from "@/lib/session";
import { sanitizeText } from "@/lib/sanitize";

function encodeCursor(createdAt: Date, id: string) {
  return `${createdAt.toISOString()}_${id}`;
}

function decodeCursor(raw: string): { createdAt: Date; id: string } | null {
  const idx = raw.lastIndexOf("_");
  if (idx <= 0) return null;
  const iso = raw.slice(0, idx);
  const id = raw.slice(idx + 1);
  const createdAt = new Date(iso);
  if (Number.isNaN(createdAt.getTime()) || !id) return null;
  return { createdAt, id };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionUserId = await getUserIdFromCookies();
  const idsRaw = (searchParams.get("ids") ?? "").trim();
  const q = (searchParams.get("q") ?? "").trim();
  const type = searchParams.get("type");
  const authorId = searchParams.get("authorId");
  const includeDrafts =
    searchParams.get("includeDrafts") === "1" && Boolean(sessionUserId);
  const savedOnly =
    searchParams.get("saved") === "1" && Boolean(sessionUserId);
  const take = Math.min(60, Math.max(1, Number(searchParams.get("take") ?? "40")));
  const sort = (searchParams.get("sort") ?? "new").toLowerCase();
  const cursorRaw = (searchParams.get("cursor") ?? "").trim();
  const cursor = cursorRaw ? decodeCursor(cursorRaw) : null;
  const orderBy =
    sort === "hot"
      ? [{ likes: "desc" as const }, { createdAt: "desc" as const }]
      : [{ createdAt: "desc" as const }, { id: "desc" as const }];

  const idList = idsRaw
    ? idsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 60)
    : [];

  // hot cursor: fetch anchor likes once
  let hotCursorWhere: object = {};
  if (cursor && !idList.length && sort === "hot") {
    const anchor = await prisma.post.findUnique({
      where: { id: cursor.id },
      select: { likes: true, createdAt: true },
    });
    if (anchor) {
      hotCursorWhere = {
        OR: [
          { likes: { lt: anchor.likes } },
          {
            AND: [
              { likes: anchor.likes },
              { createdAt: { lt: anchor.createdAt } },
            ],
          },
          {
            AND: [
              { likes: anchor.likes },
              { createdAt: anchor.createdAt },
              { id: { lt: cursor.id } },
            ],
          },
        ],
      };
    }
  }

  const newCursorWhere =
    cursor && !idList.length && sort !== "hot"
      ? {
          OR: [
            { createdAt: { lt: cursor.createdAt } },
            { AND: [{ createdAt: cursor.createdAt }, { id: { lt: cursor.id } }] },
          ],
        }
      : {};

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
        savedOnly
          ? {
              status: "published",
              savedBy: { some: { userId: sessionUserId! } },
            }
          : includeDrafts
            ? {}
            : { status: "published" },
        includeDrafts && !savedOnly ? { authorId: sessionUserId ?? undefined } : {},
        idList.length || q || savedOnly ? {} : sort === "hot" ? hotCursorWhere : newCursorWhere,
      ],
    },
    /** 按 id 列表查询时禁用 orderBy，保持请求顺序 */
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

  const last = ordered.length > 0 ? ordered[ordered.length - 1] : null;
  const nextCursor =
    !idList.length && !q && !savedOnly && ordered.length === take && last
      ? encodeCursor(last.createdAt, last.id)
      : null;

  return NextResponse.json({ posts: ordered, nextCursor });
}

export async function POST(req: Request) {
  const sessionUserId = await getUserIdFromCookies();
  if (!sessionUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    title?: string;
    excerpt?: string;
    body?: string;
    type?: string;
    coverUrl?: string;
    tags?: string[];
    status?: string;
    meta?: Record<string, unknown>;
    linkedProjectId?: string;
    linkedToolId?: string;
    linkedModelId?: string;
  };

  const title = sanitizeText(body.title, { min: 1, max: 120 });
  if (!title) {
    return NextResponse.json({ error: "标题不能为空，长度 1–120 字" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: sessionUserId } });
  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  const type = body.type && isPostType(body.type) ? body.type : "NOTE";
  const tags = Array.isArray(body.tags) ? body.tags.filter((x) => typeof x === "string") : [];

  const status =
    body.status === "draft" ? "draft" : "published";
  const meta =
    body.meta && typeof body.meta === "object"
      ? JSON.stringify(body.meta)
      : "{}";
  const linkedModelId =
    type === "MODEL_DISCUSSION" ? body.linkedModelId?.trim() || null : null;

  if (linkedModelId) {
    const linkedModel = await prisma.aiModel.findUnique({
      where: { id: linkedModelId },
      select: { id: true },
    });
    if (!linkedModel) {
      return NextResponse.json({ error: "linked model not found" }, { status: 400 });
    }
  }

  const post = await prisma.post.create({
    data: {
      authorId: sessionUserId,
      type,
      title,
      excerpt: sanitizeText(body.excerpt, { min: 0, max: 300 }) ?? "",
      body: sanitizeText(body.body, { min: 0, max: 20000 }) ?? "",
      status,
      meta,
      linkedProjectId: body.linkedProjectId?.trim() || null,
      linkedToolId: body.linkedToolId?.trim() || null,
      linkedModelId,
      coverUrl:
        body.coverUrl?.trim() ||
        `https://picsum.photos/seed/publish-${Date.now()}/800/1000`,
      tags: JSON.stringify(tags.length ? tags : ["VibeCoding"]),
    },
  });

  revalidatePath("/home");
  revalidatePath("/models");
  if (linkedModelId) {
    revalidatePath(`/models/${linkedModelId}`);
  }
  revalidatePath(`/user/${sessionUserId}`);
  return NextResponse.json({ post });
}
