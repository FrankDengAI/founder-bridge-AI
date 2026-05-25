import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isModelScenarioId, parseJsonArray } from "@/lib/models/rank";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scenarioRaw = searchParams.get("scenario")?.trim() ?? "all";
  const scenario = isModelScenarioId(scenarioRaw) ? scenarioRaw : "all";
  const sort = searchParams.get("sort")?.trim() ?? "rank";

  const models = await prisma.aiModel.findMany({
    include: {
      reviews: { select: { id: true, scenario: true, rating: true } },
    },
  });

  let list = models.map((m) => ({
    id: m.id,
    name: m.name,
    provider: m.provider,
    description: m.description,
    logoUrl: m.logoUrl,
    websiteUrl: m.websiteUrl,
    strengths: parseJsonArray(m.strengths),
    scenarios: parseJsonArray(m.scenarios),
    avgRating: m.avgRating,
    reviewCount: m.reviewCount,
    rankScore: m.rankScore,
    createdAt: m.createdAt.toISOString(),
    reviewScenarios: m.reviews.map((r) => r.scenario),
  }));

  if (scenario !== "all") {
    list = list.filter(
      (m) =>
        m.scenarios.includes(scenario) ||
        m.reviewScenarios.some((s) => s === scenario),
    );
  }

  list.sort((a, b) => {
    if (sort === "rating") return b.avgRating - a.avgRating;
    if (sort === "reviews") return b.reviewCount - a.reviewCount;
    if (sort === "new") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.rankScore - a.rankScore;
  });

  const payload = list.map((m) => ({
    id: m.id,
    name: m.name,
    provider: m.provider,
    description: m.description,
    logoUrl: m.logoUrl,
    websiteUrl: m.websiteUrl,
    strengths: m.strengths,
    scenarios: m.scenarios,
    avgRating: m.avgRating,
    reviewCount: m.reviewCount,
    rankScore: m.rankScore,
    createdAt: m.createdAt,
  }));

  return NextResponse.json({ models: payload });
}
