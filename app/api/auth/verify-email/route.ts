import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth/tokens";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("token")?.trim();
  if (!raw) {
    return NextResponse.json({ error: "缺少 token" }, { status: 400 });
  }

  const row = await prisma.authToken.findUnique({
    where: { tokenHash: hashToken(raw) },
    include: { user: true },
  });

  if (!row || row.type !== "email_verify") {
    return NextResponse.json({ error: "链接无效或已使用" }, { status: 400 });
  }
  if (row.usedAt) {
    return NextResponse.json({ error: "链接已使用" }, { status: 400 });
  }
  if (row.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "链接已过期" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: row.userId },
      data: { emailVerifiedAt: new Date() },
    }),
    prisma.authToken.update({
      where: { id: row.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true, message: "邮箱已验证，可以登录了" });
}
