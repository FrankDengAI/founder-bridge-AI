import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";

export const dynamic = "force-dynamic";

function formatPrice(cents: number) {
  return `¥${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

function formatOrderStatus(status: string) {
  const map: Record<string, string> = {
    paid: "已支付",
    pending: "待支付",
    cancelled: "已取消",
    completed: "已完成",
    DEMO_PAID: "已支付",
  };
  return map[status] ?? "处理中";
}

export default async function OrdersPage() {
  const uid = await getUserIdFromCookies();
  if (!uid) {
    return (
      <div className="space-y-4 pb-10">
        <PageHeader title="订单与心愿单" backHref="/tools" />
        <p className="glass-panel rounded-shell p-4 text-sm text-zinc-600 shadow-panel">
          请先登录后查看订单与心愿单。
        </p>
      </div>
    );
  }

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

  return (
    <div className="space-y-4 pb-10">
      <PageHeader
        title="订单与心愿单"
        subtitle="心愿单收藏与购买记录，当前为模拟支付流程。"
        backHref="/tools"
      />

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-900">心愿单</h2>
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
                详情
              </Link>
            </li>
          ))}
        </ul>
        {wishlist.length === 0 ? (
          <p className="text-xs text-zinc-500">暂无心愿单条目。在工具商城点击「加入心愿单」。</p>
        ) : null}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-900">我的订单</h2>
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
                  {o.createdAt.toLocaleDateString("zh-CN")}
                </p>
              </div>
            </li>
          ))}
        </ul>
        {orders.length === 0 ? (
          <p className="text-xs text-zinc-500">暂无订单。在商品详情页完成购买即可在此查看。</p>
        ) : null}
      </section>
    </div>
  );
}
