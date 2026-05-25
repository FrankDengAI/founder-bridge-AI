import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authTokenExpiresAt, generateRawToken, hashToken } from "@/lib/auth/tokens";
import { sendPasswordResetEmail } from "@/lib/email/resend";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: string };
  const email = normalizeEmail(body.email ?? "");
  if (!email) {
    return NextResponse.json({ error: "请输入邮箱" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user && user.passwordHash && !user.isDemo) {
    const rawToken = generateRawToken();
    await prisma.authToken.create({
      data: {
        userId: user.id,
        type: "password_reset",
        tokenHash: hashToken(rawToken),
        expiresAt: authTokenExpiresAt("password_reset"),
      },
    });
    await sendPasswordResetEmail(email, rawToken);
  }

  return NextResponse.json({
    ok: true,
    message: "若该邮箱已注册，你将收到重置邮件",
  });
}
