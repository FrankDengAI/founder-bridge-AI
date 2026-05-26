import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [modelCount, reviewCount, hotPosts, hotTools, hotModels] =
    await Promise.all([
      prisma.aiModel.count(),
      prisma.aiModelReview.count(),
      prisma.post.findMany({
        where: { status: "published" },
        orderBy: [{ likes: "desc" }, { saves: "desc" }],
        take: 5,
        select: { id: true, title: true, likes: true },
      }),
      prisma.tool.findMany({
        orderBy: { avgRating: "desc" },
        take: 5,
        select: { id: true, name: true, avgRating: true },
      }),
      prisma.aiModel.findMany({
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
      }),
    ]);

  return NextResponse.json({
    modelCount,
    reviewCount,
    hotPosts,
    hotTools,
    hotModels,
  });
}
