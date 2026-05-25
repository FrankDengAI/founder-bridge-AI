import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isRole } from "@/lib/domain/role";
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password";
import { setSessionOnResponse } from "@/lib/auth/sessionStore";
import { normalizeUsername, validateUsername } from "@/lib/auth/username";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    username?: string;
    password?: string;
    displayName?: string;
    role?: string;
    interestTags?: string[];
  };

  const username = normalizeUsername(body.username ?? "");
  const usernameErr = validateUsername(username);
  if (usernameErr) return NextResponse.json({ error: usernameErr }, { status: 400 });

  const pwdErr = validatePasswordStrength(body.password ?? "");
  if (pwdErr) return NextResponse.json({ error: pwdErr }, { status: 400 });

  const name = body.displayName?.trim();
  if (!name) return NextResponse.json({ error: "请输入昵称" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: "该账号已被占用" }, { status: 409 });
  }

  const role = body.role && isRole(body.role) ? body.role : "ADC";
  const tags = Array.isArray(body.interestTags)
    ? body.interestTags.filter((t) => typeof t === "string" && t.trim()).map((t) => t.trim())
    : [];
  if (tags.length === 0) {
    return NextResponse.json({ error: "请至少选择一个兴趣标签" }, { status: 400 });
  }

  const passwordHash = await hashPassword(body.password!);
  const interestJson = JSON.stringify(tags);
  const skillJson = JSON.stringify(tags.slice(0, 6));

  const user = await prisma.user.create({
    data: {
      username,
      passwordHash,
      isDemo: false,
      displayName: name,
      avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(username)}`,
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
    username: user.username,
    displayName: user.displayName,
  });
  await setSessionOnResponse(res, user.id);
  return res;
}
