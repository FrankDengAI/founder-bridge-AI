import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      take: 40,
      select: { id: true, displayName: true },
    });
    return NextResponse.json({ users });
  } catch (e) {
    console.error("[api/auth/users]", e);
    return NextResponse.json(
      {
        users: [] as { id: string; displayName: string }[],
        message: "数据库不可用：请检查 DATABASE_URL、迁移与网络（如 Neon 是否允许当前 IP）。",
      },
      { status: 503 },
    );
  }
}
