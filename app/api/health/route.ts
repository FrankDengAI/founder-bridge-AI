import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hasConfiguredSessionSecret } from "@/lib/auth/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const ts = new Date().toISOString();
  const sessionConfigured = hasConfiguredSessionSecret();

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    return NextResponse.json(
      {
        status: "error",
        db: "unreachable",
        auth: sessionConfigured ? "ready" : "session_secret_ephemeral",
        ts,
      },
      { status: 503 },
    );
  }

  try {
    await prisma.user.findFirst({ select: { username: true }, take: 1 });
    await prisma.session.findFirst({ select: { id: true }, take: 1 });
    return NextResponse.json(
      {
        status: sessionConfigured ? "ok" : "degraded",
        db: "ok",
        auth: sessionConfigured ? "ready" : "session_secret_ephemeral",
        hint: sessionConfigured
          ? undefined
          : "SESSION_SECRET 为启动时自动生成；可选在 Render Environment 配置固定值以免重启后掉线",
        ts,
      },
      { status: 200 },
    );
  } catch {
    // DB 可达但 schema 未齐：仍返回 200，避免 Render 健康检查无限重启
    return NextResponse.json(
      {
        status: "degraded",
        db: "ok",
        auth: sessionConfigured ? "schema_pending" : "session_secret_ephemeral",
        hint: "请确认 prisma migrate deploy 已执行（含 username / Session 表）",
        ts,
      },
      { status: 200 },
    );
  }
}
