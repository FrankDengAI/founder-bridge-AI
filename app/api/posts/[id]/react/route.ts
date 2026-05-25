import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";

type Ctx = { params: { id: string } };

export async function POST(req: Request, { params }: Ctx) {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    action?: "like" | "save";
  };
  if (body.action !== "like" && body.action !== "save") {
    return NextResponse.json({ error: "invalid action" }, { status: 400 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const postRow = await tx.post.findUnique({
      where: { id: params.id },
      select: { id: true },
    });
    if (!postRow) return null;

    const existing =
      body.action === "like"
        ? await tx.postLike.findUnique({
            where: { userId_postId: { userId, postId: params.id } },
          })
        : await tx.postSave.findUnique({
            where: { userId_postId: { userId, postId: params.id } },
          });

    if (existing) {
      const post = await tx.post.findUnique({ where: { id: params.id } });
      return post ? { post, already: true as const } : null;
    }

    if (body.action === "like") {
      await tx.postLike.create({ data: { userId, postId: params.id } });
      const post = await tx.post.update({
        where: { id: params.id },
        data: { likes: { increment: 1 } },
      });
      return { post, already: false as const };
    }
    await tx.postSave.create({ data: { userId, postId: params.id } });
    const post = await tx.post.update({
      where: { id: params.id },
      data: { saves: { increment: 1 } },
    });
    return { post, already: false as const };
  });

  if (!result) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  revalidatePath("/home");
  revalidatePath(`/post/${params.id}`);
  return NextResponse.json({
    likes: result.post.likes,
    saves: result.post.saves,
    already: result.already,
  });
}
