import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";
import { sanitizeText } from "@/lib/sanitize";
import { checkProfanity } from "@/lib/moderation/profanity";

type Ctx = { params: { id: string } };

const PAGE = 20;

export async function GET(req: Request, { params }: Ctx) {
  const { searchParams } = new URL(req.url);
  const skip = Math.max(0, Number(searchParams.get("skip") ?? "0"));
  const take = Math.min(50, Math.max(1, Number(searchParams.get("take") ?? PAGE)));

  const batch = await prisma.comment.findMany({
    where: { postId: params.id },
    orderBy: { createdAt: "desc" },
    skip,
    take: take + 1,
    include: { author: { select: { id: true, displayName: true, avatarUrl: true } } },
  });

  const hasMore = batch.length > take;
  const page = hasMore ? batch.slice(0, take) : batch;
  const nextSkip = hasMore ? skip + take : null;

  return NextResponse.json({ comments: page, nextSkip });
}

export async function POST(req: Request, { params }: Ctx) {
  const authorId = await getUserIdFromCookies();
  if (!authorId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as { body?: string };
  const text = sanitizeText(body.body, { min: 1, max: 500 });
  if (!text) {
    return NextResponse.json({ error: "评论内容无效（1–500 字）" }, { status: 400 });
  }
  if (checkProfanity(text).blocked) {
    return NextResponse.json(
      { error: "profanity", message: "Content contains prohibited words." },
      { status: 422 },
    );
  }
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const c = await prisma.comment.create({
    data: { postId: params.id, authorId, body: text! },
    include: { author: { select: { id: true, displayName: true, avatarUrl: true } } },
  });
  revalidatePath(`/post/${params.id}`);
  return NextResponse.json({ comment: c });
}
