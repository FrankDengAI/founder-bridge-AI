import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isRole } from "@/lib/domain/role";
import { getUserIdFromCookies } from "@/lib/session";

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
      skillKeywords: JSON.parse(user.profile.skillKeywords || "[]"),
      desiredPartnerRoles: JSON.parse(user.profile.desiredPartnerRoles || "[]"),
      interestTags: JSON.parse(user.profile.interestTags || "[]"),
      remoteOk: user.profile.remoteOk,
      githubUrl: user.profile.githubUrl,
      verifiedAt: user.profile.verifiedAt,
      updatedAt: user.profile.updatedAt,
    },
  });
}

export async function PUT(req: Request) {
  const sessionUserId = getUserIdFromCookies();
  if (!sessionUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    userId?: string;
    role?: string;
    budgetTier?: number;
    intro?: string;
    direction?: string;
    skillKeywords?: string[];
    desiredPartnerRoles?: string[];
    interestTags?: string[];
    remoteOk?: boolean;
    githubUrl?: string;
  };
  const claimed = body.userId?.trim();
  if (claimed && claimed !== sessionUserId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const userId = sessionUserId;
  if (body.role && !isRole(body.role)) {
    return NextResponse.json({ error: "invalid role" }, { status: 400 });
  }
  const desired = (body.desiredPartnerRoles ?? []).filter(isRole);

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
