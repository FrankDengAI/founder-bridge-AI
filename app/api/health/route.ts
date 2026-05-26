import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const ts = new Date().toISOString();
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    return NextResponse.json(
      { status: "error", db: "unreachable", auth: "unknown", ts },
      { status: 503 },
    );
  }

  try {
    await prisma.user.findFirst({ select: { username: true }, take: 1 });
    await prisma.session.findFirst({ select: { id: true }, take: 1 });
    return NextResponse.json({ status: "ok", db: "ok", auth: "ready", ts }, { status: 200 });
  } catch {
    // DB 可达但 schema 未齐：仍返回 200，避免 Render 健康检查无限重启
    return NextResponse.json(
      {
        status: "degraded",
        db: "ok",
        auth: "schema_pending",
        hint: "请确认 prisma migrate deploy 已执行（含 username / Session 表）",
        ts,
      },
      { status: 200 },
    );
  }
}
