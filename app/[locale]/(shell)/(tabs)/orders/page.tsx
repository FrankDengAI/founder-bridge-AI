import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";
import { getLocale, getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

function formatPrice(cents: number) {
  return `¥${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export default async function OrdersPage() {
  const t = await getTranslations("pages.orders");
  const locale = await getLocale();
  const uid = await getUserIdFromCookies();
  if (!uid) {
    return (
      <div className="space-y-4 pb-10">
        <PageHeader title={t("title")} backHref="/tools" />
        <p className="glass-panel rounded-shell p-4 text-sm text-zinc-600 shadow-panel">
          {t("loginRequired")}
        </p>
      </div>
    );
  }

  const formatOrderStatus = (status: string) => {
    const map: Record<string, string> = {
      paid: t("statusPaid"),
      pending: t("statusPending"),
      cancelled: t("statusCancelled"),
      completed: t("statusCompleted"),
      DEMO_PAID: t("statusPaid"),
    };
    return map[status] ?? t("statusProcessing");
  };

  const [wishlist, orders] = await Promise.all([
    prisma.wishlistItem.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "desc" },
      include: { market: true },
    }),
    prisma.demoOrder.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "desc" },
      include: { market: true },
    }),
  ]);

  const dateLocale = locale === "zh" ? "zh-CN" : "en-US";

  return (
    <div className="space-y-4 pb-10">
      <PageHeader title={t("title")} subtitle={t("subtitle")} backHref="/tools" />

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-900">{t("wishlist")}</h2>
        <ul className="space-y-2">
          {wishlist.map((w) => (
            <li
              key={w.id}
              className="glass-panel flex items-center justify-between gap-3 rounded-shell px-3 py-3 shadow-panel ring-1 ring-white/70"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-950">{w.market.title}</p>
                <p className="text-[11px] text-zinc-500">{w.market.itemType}</p>
              </div>
              <Link
                href={`/market/${w.marketId}`}
                className="shrink-0 rounded-xl bg-brand-50 px-3 py-1.5 text-[11px] font-semibold text-brand-900 ring-1 ring-brand-200/70"
              >
                {t("details")}
              </Link>
            </li>
          ))}
        </ul>
        {wishlist.length === 0 ? (
          <p className="text-xs text-zinc-500">{t("emptyWishlist")}</p>
        ) : null}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-900">{t("myOrders")}</h2>
        <ul className="space-y-2">
          {orders.map((o) => (
            <li
              key={o.id}
              className="glass-panel flex items-center justify-between gap-3 rounded-shell px-3 py-3 shadow-panel ring-1 ring-white/70"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-950">{o.market.title}</p>
                <p className="text-[11px] text-zinc-500">
                  {formatPrice(o.market.priceCents)} · {formatOrderStatus(o.status)} ·{" "}
                  {o.createdAt.toLocaleDateString(dateLocale)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        {orders.length === 0 ? (
          <p className="text-xs text-zinc-500">{t("emptyOrders")}</p>
        ) : null}
      </section>
    </div>
  );
}
