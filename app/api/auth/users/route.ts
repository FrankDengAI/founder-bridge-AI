import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    take: 40,
    select: { id: true, displayName: true },
  });
  return NextResponse.json({ users });
}
