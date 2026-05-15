import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isRole } from "@/lib/domain/role";
import { setSessionOnResponse } from "@/lib/authCookies";

const DEMO_PASSWORD_HINT = "demo";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    displayName?: string;
    role?: string;
    interestTags?: string[];
  };

  const name = body.displayName?.trim();
  if (!name) {
    return NextResponse.json({ error: "请输入昵称" }, { status: 400 });
  }
  const role = body.role && isRole(body.role) ? body.role : "ADC";
  const tags = Array.isArray(body.interestTags)
    ? body.interestTags.filter((t) => typeof t === "string" && t.trim()).map((t) => t.trim())
    : [];
  if (tags.length === 0) {
    return NextResponse.json({ error: "请至少选择一个兴趣标签" }, { status: 400 });
  }

  const interestJson = JSON.stringify(tags);
  const skillJson = JSON.stringify(tags.slice(0, 6));

  const user = await prisma.user.create({
    data: {
      displayName: name,
      avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`,
      profile: {
        create: {
          role,
          budgetTier: 1,
          intro: `新用户，兴趣：${tags.join("、")}`,
          direction: tags[0] ?? "",
          skillKeywords: skillJson,
          interestTags: interestJson,
          desiredPartnerRoles: JSON.stringify(
            role === "ADC"
              ? ["JUNGLE", "SUPPORT"]
              : role === "JUNGLE"
                ? ["ADC", "SUPPORT"]
                : ["ADC", "JUNGLE"],
          ),
        },
      },
    },
  });

  const res = NextResponse.json({
    ok: true,
    userId: user.id,
    hint: `演示口令为 ${DEMO_PASSWORD_HINT}，登录时可选用`,
  });
  setSessionOnResponse(res, user.id);
  return res;
}
