import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toParsedProfile } from "@/lib/matching/parseProfile";
import {
  parseJsonArray,
  rankBountiesByKeywords,
  rankUsersByKeywords,
} from "@/lib/bounty/matchUsers";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json({ users: [], bounties: [] });
  }

  const [profiles, users, bounties] = await Promise.all([
    prisma.userProfile.findMany({
      include: { user: { select: { id: true, displayName: true, avatarUrl: true } } },
    }),
    prisma.user.findMany({ select: { id: true, displayName: true, avatarUrl: true } }),
    prisma.bountyRequest.findMany({
      where: { status: "open" },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true } },
      },
    }),
  ]);

  const userMap = new Map(users.map((u) => [u.id, u]));
  const parsed = profiles.map((p) => toParsedProfile(p.userId, p));

  const matchedUsers = rankUsersByKeywords(q, parsed, userMap, 8);
  const matchedBounties = rankBountiesByKeywords(
    q,
    bounties.map((b) => ({
      id: b.id,
      title: b.title,
      description: b.description,
      keywords: parseJsonArray(b.keywords),
      budgetLabel: b.budgetLabel,
      authorId: b.authorId,
      createdAt: b.createdAt,
    })),
    10,
  ).map((b) => {
    const author = bounties.find((x) => x.id === b.id)?.author;
    return {
      id: b.id,
      title: b.title,
      description: b.description.slice(0, 200),
      keywords: b.keywords,
      budgetLabel: b.budgetLabel,
      score: b.score,
      authorId: b.authorId,
      authorName: author?.displayName ?? "",
      authorAvatar: author?.avatarUrl ?? null,
      createdAt: b.createdAt.getTime(),
    };
  });

  return NextResponse.json({ users: matchedUsers, bounties: matchedBounties });
}
