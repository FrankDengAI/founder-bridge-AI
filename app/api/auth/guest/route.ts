import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isGuestEnabled } from "@/lib/auth/config";
import { setSessionOnResponse } from "@/lib/auth/sessionStore";
import { checkProfanity } from "@/lib/moderation/profanity";

export async function POST(req: Request) {
  if (!isGuestEnabled()) {
    return NextResponse.json({ error: "游客模式已关闭" }, { status: 403 });
  }
  const body = (await req.json()) as { interestTags?: string[]; displayName?: string };
  const tags = Array.isArray(body.interestTags)
    ? body.interestTags.filter((t) => typeof t === "string" && t.trim()).map((t) => t.trim())
    : [];
  if (tags.length === 0) {
    return NextResponse.json({ error: "请至少选择一个兴趣标签" }, { status: 400 });
  }

  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const id = `guest_${suffix}`;
  const customName = body.displayName?.trim();
  if (customName && checkProfanity(customName).blocked) {
    return NextResponse.json(
      { error: "profanity", message: "Content contains prohibited words." },
      { status: 422 },
    );
  }
  const interestJson = JSON.stringify(tags);
  const skillJson = JSON.stringify(tags.slice(0, 6));

  const user = await prisma.user.create({
    data: {
      id,
      username: id.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 32) || `guest_${suffix}`,
      displayName: customName || `游客_${suffix.slice(-6)}`,
      avatarUrl: `https://i.pravatar.cc/150?u=${id}`,
      profile: {
        create: {
          role: "ADC",
          budgetTier: 0,
          intro: "快速体验：仅选择了兴趣标签，可稍后在「匹配」完善资料。",
          direction: tags[0] ?? "",
          skillKeywords: skillJson,
          interestTags: interestJson,
          desiredPartnerRoles: JSON.stringify(["JUNGLE", "SUPPORT"]),
        },
      },
    },
  });

  const res = NextResponse.json({ ok: true, userId: user.id });
  await setSessionOnResponse(res, user.id);
  return res;
}
