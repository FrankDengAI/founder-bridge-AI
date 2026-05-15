import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      profile: true,
      posts: { orderBy: { createdAt: "desc" }, take: 30 },
      projects: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!user) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ user });
}
