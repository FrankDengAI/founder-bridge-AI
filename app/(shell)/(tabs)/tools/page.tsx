import { ToolsClient } from "./tools-client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ToolsPage() {
  const [tools, market] = await Promise.all([
    prisma.tool.findMany({
      orderBy: { name: "asc" },
      include: { reviews: true },
    }),
    prisma.marketItem.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const toolsPayload = tools.map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
    description: t.description,
    avgRating: t.avgRating,
    reviewCount: t.reviews.length,
  }));

  const marketPayload = market.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    priceCents: m.priceCents,
    itemType: m.itemType,
  }));

  return (
    <ToolsClient initialTools={toolsPayload} initialMarket={marketPayload} />
  );
}
