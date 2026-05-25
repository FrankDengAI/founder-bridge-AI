import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { setSessionOnResponse } from "@/lib/auth/sessionStore";
import { isDemoLoginEnabled } from "@/lib/auth/config";
import { normalizeUsername } from "@/lib/auth/username";
import { dbErrorMessage, authConfigErrorMessage } from "@/lib/dbErrorMessage";

const DEMO_PASSWORD = "demo";

export async function POST(req: Request) {
  let body: {
    username?: string;
    password?: string;
    userId?: string;
    demoMode?: boolean;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "请求格式无效" }, { status: 400 });
  }

  try {
    // 演示模式：仅 ENABLE_DEMO_LOGIN=true 时可用
    if (body.demoMode || body.userId) {
      if (!isDemoLoginEnabled()) {
        return NextResponse.json({ error: "演示登录已关闭" }, { status: 403 });
      }
      const userId = body.userId?.trim();
      const pwd = (body.password ?? "").trim();
      if (!userId || (pwd !== DEMO_PASSWORD && pwd !== "")) {
        return NextResponse.json({ error: "口令错误（演示固定为 demo，或留空）" }, { status: 401 });
      }
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.isDemo) {
        return NextResponse.json({ error: "演示用户不存在" }, { status: 404 });
      }
      const res = NextResponse.json({ ok: true, userId: user.id, isDemo: true });
      await setSessionOnResponse(res, user.id);
      return res;
    }

    const username = normalizeUsername(body.username ?? "");
    const password = body.password ?? "";
    if (!username || !password) {
      return NextResponse.json({ error: "请输入账号和密码" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "账号或密码错误" }, { status: 401 });
    }

    if (user.accountStatus !== "active") {
      return NextResponse.json({ error: "账号已停用" }, { status: 403 });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "账号或密码错误" }, { status: 401 });
    }

    const res = NextResponse.json({
      ok: true,
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      isDemo: user.isDemo,
    });
    await setSessionOnResponse(res, user.id);
    return res;
  } catch (err) {
    console.error("[auth/login]", err);
    return NextResponse.json(
      { error: authConfigErrorMessage(err) ?? dbErrorMessage(err) },
      { status: 503 },
    );
  }
}
