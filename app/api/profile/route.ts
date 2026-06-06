import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isRole } from "@/lib/domain/role";
import { getUserIdFromCookies } from "@/lib/session";
import { checkProfanity } from "@/lib/moderation/profanity";

const MATCH_INTENTS = new Set(["PARTNER", "RECRUIT"]);

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "missing userId" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
  if (!user || !user.profile) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    },
    profile: {
      role: user.profile.role,
      budgetTier: user.profile.budgetTier,
      intro: user.profile.intro,
      direction: user.profile.direction,
      skillKeywords: parseJsonArray(user.profile.skillKeywords),
      desiredPartnerRoles: parseJsonArray(user.profile.desiredPartnerRoles),
      matchIntent: user.profile.matchIntent,
      interestTags: parseJsonArray(user.profile.interestTags),
      remoteOk: user.profile.remoteOk,
      githubUrl: user.profile.githubUrl,
      verifiedAt: user.profile.verifiedAt,
      updatedAt: user.profile.updatedAt,
    },
  });
}

export async function PUT(req: Request) {
  const sessionUserId = await getUserIdFromCookies();
  if (!sessionUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    role?: string;
    budgetTier?: number;
    intro?: string;
    direction?: string;
    skillKeywords?: string[];
    desiredPartnerRoles?: string[];
    matchIntent?: string;
    interestTags?: string[];
    remoteOk?: boolean;
    githubUrl?: string;
  };
  const userId = sessionUserId;
  if (body.role && !isRole(body.role)) {
    return NextResponse.json({ error: "invalid role" }, { status: 400 });
  }
  const desired = (body.desiredPartnerRoles ?? []).filter(isRole);

  const textFields = [body.intro, body.direction].filter(Boolean).join(" ");
  if (textFields) {
    const { blocked } = checkProfanity(textFields);
    if (blocked) {
      return NextResponse.json(
        { error: "profanity", message: "Content contains prohibited words." },
        { status: 422 },
      );
    }
  }

  if (body.matchIntent && !MATCH_INTENTS.has(body.matchIntent)) {
    return NextResponse.json({ error: "invalid matchIntent" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  const data = {
    role: body.role ?? undefined,
    budgetTier:
      typeof body.budgetTier === "number"
        ? Math.max(0, Math.min(4, Math.floor(body.budgetTier)))
        : undefined,
    intro: body.intro,
    direction: body.direction,
    skillKeywords:
      body.skillKeywords !== undefined
        ? JSON.stringify(body.skillKeywords)
        : undefined,
    desiredPartnerRoles:
      body.desiredPartnerRoles !== undefined
        ? JSON.stringify(desired)
        : undefined,
    matchIntent:
      body.matchIntent && MATCH_INTENTS.has(body.matchIntent)
        ? body.matchIntent
        : undefined,
    interestTags:
      body.interestTags !== undefined
        ? JSON.stringify(
            body.interestTags.filter((x) => typeof x === "string"),
          )
        : undefined,
    remoteOk:
      typeof body.remoteOk === "boolean" ? body.remoteOk : undefined,
    githubUrl: body.githubUrl,
    ...(body.githubUrl !== undefined
      ? {
          verifiedAt: body.githubUrl.trim() ? new Date() : null,
        }
      : {}),
  };

  await prisma.userProfile.upsert({
    where: { userId },
    create: {
      userId,
      role: (body.role && isRole(body.role) ? body.role : "ADC") as string,
      budgetTier:
        typeof body.budgetTier === "number"
          ? Math.max(0, Math.min(4, Math.floor(body.budgetTier)))
          : 0,
      intro: body.intro ?? "",
      direction: body.direction ?? "",
      skillKeywords: JSON.stringify(body.skillKeywords ?? []),
      desiredPartnerRoles: JSON.stringify(desired),
      matchIntent:
        body.matchIntent && MATCH_INTENTS.has(body.matchIntent)
          ? body.matchIntent
          : "PARTNER",
    },
    update: Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    ),
  });

  const fresh = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
  return NextResponse.json({ ok: true, user: fresh });
}
