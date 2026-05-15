import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionOnResponse } from "@/lib/authCookies";

export async function POST(req: Request) {
  const body = (await req.json()) as { interestTags?: string[] };
  const tags = Array.isArray(body.interestTags)
    ? body.interestTags.filter((t) => typeof t === "string" && t.trim()).map((t) => t.trim())
    : [];
  if (tags.length === 0) {
    return NextResponse.json({ error: "请至少选择一个兴趣标签" }, { status: 400 });
  }

  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const id = `guest_${suffix}`;
  const interestJson = JSON.stringify(tags);
  const skillJson = JSON.stringify(tags.slice(0, 6));

  const user = await prisma.user.create({
    data: {
      id,
      displayName: `游客_${suffix.slice(-6)}`,
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
  setSessionOnResponse(res, user.id);
  return res;
}
