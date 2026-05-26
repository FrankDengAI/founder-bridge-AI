import { ModelsClient } from "./models-client";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/models/rank";

export const dynamic = "force-dynamic";

export default async function ModelsPage() {
  const [models, totalReviews] = await Promise.all([
    prisma.aiModel.findMany({
      orderBy: { rankScore: "desc" },
    }),
    prisma.aiModelReview.count(),
  ]);

  const payload = models.map((m) => ({
    id: m.id,
    name: m.name,
    provider: m.provider,
    description: m.description,
    logoUrl: m.logoUrl,
    avgRating: m.avgRating,
    reviewCount: m.reviewCount,
    rankScore: m.rankScore,
    scenarios: parseJsonArray(m.scenarios),
  }));

  return <ModelsClient initialModels={payload} totalReviews={totalReviews} />;
}
