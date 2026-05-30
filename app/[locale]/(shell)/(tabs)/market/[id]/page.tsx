import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { MarketCheckout } from "@/components/MarketCheckout";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

type Props = { params: { id: string } };

export const dynamic = "force-dynamic";

function formatPrice(cents: number) {
  return `¥${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export default async function MarketItemPage({ params }: Props) {
  const t = await getTranslations("pages.market");
  const item = await prisma.marketItem.findUnique({ where: { id: params.id } });
  if (!item) notFound();

  return (
    <div className="space-y-3 pb-10">
      <PageHeader title={t("title")} subtitle={item.itemType} backHref="/tools" />
      <MarketCheckout
        marketId={item.id}
        title={item.title}
        priceLabel={formatPrice(item.priceCents)}
        itemType={item.itemType}
      />
      <div className="glass-panel rounded-3xl p-4 text-sm leading-relaxed text-zinc-700 shadow-sm">
        {item.description}
      </div>
    </div>
  );
}
