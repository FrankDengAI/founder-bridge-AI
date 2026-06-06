import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";
import { checkProfanity } from "@/lib/moderation/profanity";
import { parseJsonArray } from "@/lib/bounty/matchUsers";

export async function GET() {
  const rows = await prisma.bountyRequest.findMany({
    where: { status: "open" },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: { select: { id: true, displayName: true, avatarUrl: true } },
    },
  });

  return NextResponse.json({
    items: rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      keywords: parseJsonArray(r.keywords),
      budgetLabel: r.budgetLabel,
      authorId: r.authorId,
      authorName: r.author.displayName,
      authorAvatar: r.author.avatarUrl,
      createdAt: r.createdAt.getTime(),
    })),
  });
}

export async function POST(req: Request) {
  const userId = await getUserIdFromCookies();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    title?: string;
    description?: string;
    keywords?: string[];
    budgetLabel?: string;
  };

  const title = body.title?.trim() ?? "";
  const description = body.description?.trim() ?? "";
  if (!title || title.length < 4) {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }

  const combined = `${title} ${description}`;
  const { blocked } = checkProfanity(combined);
  if (blocked) {
    return NextResponse.json(
      { error: "profanity", message: "Content contains prohibited words." },
      { status: 422 },
    );
  }

  const keywords = (body.keywords ?? []).filter((k) => typeof k === "string" && k.trim());

  const row = await prisma.bountyRequest.create({
    data: {
      authorId: userId,
      title,
      description,
      keywords: JSON.stringify(keywords),
      budgetLabel: body.budgetLabel?.trim() ?? "",
    },
  });

  return NextResponse.json({ id: row.id });
}
