import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toParsedProfile } from "@/lib/matching/parseProfile";
import { rankCandidates } from "@/lib/matching/rank";
import type { ParsedProfile } from "@/lib/matching/types";
import { isRole } from "@/lib/domain/role";
import { getUserIdFromCookies } from "@/lib/session";

type Draft = Partial<{
  role: string;
  budgetTier: number;
  intro: string;
  direction: string;
  skillKeywords: string[];
  desiredPartnerRoles: string[];
}>;

function mergeProfile(base: ParsedProfile, draft: Draft | undefined): ParsedProfile {
  if (!draft) return base;
  const desired = (draft.desiredPartnerRoles ?? base.desiredPartnerRoles).filter(
    isRole,
  );
  return {
    userId: base.userId,
    role: draft.role && isRole(draft.role) ? draft.role : base.role,
    budgetTier:
      typeof draft.budgetTier === "number"
        ? Math.max(0, Math.min(4, Math.floor(draft.budgetTier)))
        : base.budgetTier,
    intro: draft.intro ?? base.intro,
    direction: draft.direction ?? base.direction,
    skillKeywords: draft.skillKeywords ?? base.skillKeywords,
    desiredPartnerRoles: desired.length ? desired : base.desiredPartnerRoles,
  };
}

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const sessionUserId = getUserIdFromCookies();
  if (!sessionUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  if (searchParams.get("daily") !== "1") {
    return NextResponse.json({ error: "use POST for full match" }, { status: 400 });
  }

  const meRow = await prisma.user.findUnique({
    where: { id: sessionUserId },
    include: { profile: true },
  });
  if (!meRow?.profile) {
    return NextResponse.json({ candidate: null });
  }

  const me = toParsedProfile(sessionUserId, meRow.profile);
  const others = await prisma.user.findMany({
    where: { id: { not: sessionUserId } },
    include: { profile: true },
  });
  const pool = others
    .filter((u) => u.profile)
    .map((u) => ({
      ...toParsedProfile(u.id, u.profile!),
      updatedAt: u.profile!.updatedAt,
      displayName: u.displayName,
      avatarUrl: u.avatarUrl,
    }));

  const day = new Date().toISOString().slice(0, 10);
  const seed = `${sessionUserId}:${day}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const ranked = rankCandidates(me, pool, pool.length);
  const pick = ranked[hash % Math.max(1, ranked.length)] ?? null;

  return NextResponse.json({
    candidate: pick
      ? {
          userId: pick.userId,
          displayName: pick.displayName,
          avatarUrl: pick.avatarUrl,
          role: pick.role,
          score: Number(pick.score.toFixed(4)),
          direction: pick.direction,
        }
      : null,
  });
}

export async function POST(req: Request) {
  const sessionUserId = getUserIdFromCookies();
  if (!sessionUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    userId?: string;
    limit?: number;
    draft?: Draft;
  };
  const claimed = body.userId?.trim();
  if (claimed && claimed !== sessionUserId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const userId = sessionUserId;
  const limit = Math.min(20, Math.max(1, body.limit ?? 10));

  const meRow = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
  if (!meRow?.profile) {
    return NextResponse.json({ error: "profile not found" }, { status: 404 });
  }

  const base = toParsedProfile(userId, meRow.profile);
  const me = mergeProfile(base, body.draft);

  const others = await prisma.user.findMany({
    where: { id: { not: userId } },
    include: { profile: true },
  });

  const pool = others
    .filter((u) => u.profile)
    .map((u) => {
      const p = toParsedProfile(u.id, u.profile!);
      return {
        ...p,
        updatedAt: u.profile!.updatedAt,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
      };
    });

  const candidates = rankCandidates(me, pool, limit);

  return NextResponse.json({
    me,
    candidates: candidates.map((c) => ({
      userId: c.userId,
      displayName: c.displayName,
      avatarUrl: c.avatarUrl,
      role: c.role,
      score: Number(c.score.toFixed(4)),
      breakdown: c.breakdown,
      reasons: c.reasons,
      introPreview: c.introPreview,
      direction: c.direction,
    })),
  });
}
