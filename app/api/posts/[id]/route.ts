import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isPostType } from "@/lib/domain/postType";
import { getUserIdFromCookies } from "@/lib/session";
import { sanitizeText } from "@/lib/sanitize";

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const viewerId = await getUserIdFromCookies();
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { author: { select: { id: true, displayName: true, avatarUrl: true } } },
  });
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });

  if (post.status === "draft" && post.authorId !== viewerId) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const existing = await prisma.post.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (existing.authorId !== userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
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
    linkedModelId?: string;
  };

  const type =
    body.type && isPostType(body.type) ? body.type : existing.type;
  const status =
    body.status === "draft"
      ? "draft"
      : body.status === "published"
        ? "published"
        : existing.status;

  const title =
    body.title !== undefined
      ? sanitizeText(body.title, { min: 1, max: 120 })
      : existing.title;
  if (!title) {
    return NextResponse.json({ error: "标题不能为空，长度 1–120 字" }, { status: 400 });
  }

  const linkedModelId =
    type === "MODEL_DISCUSSION"
      ? (body.linkedModelId?.trim() ?? existing.linkedModelId)
      : null;
  if (linkedModelId) {
    const linkedModel = await prisma.aiModel.findUnique({
      where: { id: linkedModelId },
      select: { id: true },
    });
    if (!linkedModel) {
      return NextResponse.json({ error: "linked model not found" }, { status: 400 });
    }
  }

  const tags = Array.isArray(body.tags)
    ? body.tags.filter((x) => typeof x === "string")
  : undefined;

  const meta =
    body.meta && typeof body.meta === "object"
      ? JSON.stringify(body.meta)
      : undefined;

  const post = await prisma.post.update({
    where: { id: params.id },
    data: {
      title,
      excerpt:
        body.excerpt !== undefined
          ? (sanitizeText(body.excerpt, { min: 0, max: 300 }) ?? "")
          : undefined,
      body:
        body.body !== undefined
          ? (sanitizeText(body.body, { min: 0, max: 20000 }) ?? "")
          : undefined,
      type,
      status,
      meta,
      linkedModelId,
      coverUrl: body.coverUrl?.trim() || undefined,
      tags: tags ? JSON.stringify(tags) : undefined,
    },
  });

  revalidatePath("/home");
  revalidatePath("/creator");
  revalidatePath(`/post/${params.id}`);
  revalidatePath(`/user/${userId}`);
  if (linkedModelId) revalidatePath(`/models/${linkedModelId}`);

  return NextResponse.json({ post });
}
