import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isDemoLoginEnabled } from "@/lib/auth/config";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDemoLoginEnabled()) {
    return NextResponse.json({ users: [] });
  }

  try {
    const users = await prisma.user.findMany({
      where: { isDemo: true },
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
        message: "数据库不可用：请检查 DATABASE_URL、迁移与网络。",
      },
      { status: 503 },
    );
  }
}
