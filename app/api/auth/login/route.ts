import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionOnResponse } from "@/lib/authCookies";

const DEMO_PASSWORD = "demo";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    userId?: string;
    password?: string;
  };
  const userId = body.userId?.trim();
  if (!userId) {
    return NextResponse.json({ error: "请选择或输入用户" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  const pwd = (body.password ?? "").trim();
  if (pwd !== DEMO_PASSWORD) {
    return NextResponse.json({ error: "口令错误（演示固定为 demo）" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, userId: user.id });
  setSessionOnResponse(res, user.id);
  return res;
}
