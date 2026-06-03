import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbErrorMessage } from "@/lib/dbErrorMessage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const modelCount = await prisma.aiModel.count();
    const reviewCount = await prisma.aiModelReview.count();
    const hotPosts = await prisma.post.findMany({
      where: { status: "published" },
      orderBy: [{ likes: "desc" }, { saves: "desc" }],
      take: 5,
      select: { id: true, title: true, likes: true },
    });
    const hotTools = await prisma.tool.findMany({
      orderBy: { avgRating: "desc" },
      take: 5,
      select: { id: true, name: true, avgRating: true },
    });
    const hotModels = await prisma.aiModel.findMany({
      orderBy: { rankScore: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        provider: true,
        avgRating: true,
        rankScore: true,
        reviewCount: true,
      },
    });

    return NextResponse.json({
      modelCount,
      reviewCount,
      hotPosts,
      hotTools,
      hotModels,
    });
  } catch (err) {
    console.error("[api/home/rail]", err);
    return NextResponse.json({ error: dbErrorMessage(err) }, { status: 503 });
  }
}
