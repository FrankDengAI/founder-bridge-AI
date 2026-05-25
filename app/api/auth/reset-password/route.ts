import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password";
import { hashToken } from "@/lib/auth/tokens";

export async function POST(req: Request) {
  const body = (await req.json()) as { token?: string; password?: string };
  const raw = body.token?.trim();
  const pwdErr = validatePasswordStrength(body.password ?? "");
  if (!raw) return NextResponse.json({ error: "缺少 token" }, { status: 400 });
  if (pwdErr) return NextResponse.json({ error: pwdErr }, { status: 400 });

  const row = await prisma.authToken.findUnique({
    where: { tokenHash: hashToken(raw) },
  });

  if (!row || row.type !== "password_reset") {
    return NextResponse.json({ error: "链接无效" }, { status: 400 });
  }
  if (row.usedAt) {
    return NextResponse.json({ error: "链接已使用" }, { status: 400 });
  }
  if (row.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "链接已过期" }, { status: 400 });
  }

  const passwordHash = await hashPassword(body.password!);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: row.userId },
      data: { passwordHash },
    }),
    prisma.authToken.update({
      where: { id: row.id },
      data: { usedAt: new Date() },
    }),
    prisma.session.deleteMany({ where: { userId: row.userId } }),
  ]);

  return NextResponse.json({ ok: true, message: "密码已更新，请重新登录" });
}
