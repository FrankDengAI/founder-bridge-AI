"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Search, ShoppingBag, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ToolCategoryNav } from "@/components/ToolCategoryNav";

type ToolRow = {
  id: string;
  name: string;
  category: string;
  description: string;
  avgRating: number;
  reviewCount: number;
};

type MarketRow = {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  itemType: string;
};

type Props = {
  initialTools: ToolRow[];
  initialMarket: MarketRow[];
};

function formatPrice(cents: number) {
  return `¥${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

type ToolSort = "rating" | "reviews" | "name";

export function ToolsClient({ initialTools, initialMarket }: Props) {
  const [cat, setCat] = useState("all");
  const [toast, setToast] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<ToolSort>("rating");
  const [marketQ, setMarketQ] = useState("");
  const [wishIds, setWishIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/wishlist", { credentials: "include" });
        if (!res.ok) return;
        const data = (await res.json()) as { items: { marketId: string }[] };
        setWishIds(new Set((data.items ?? []).map((x) => x.marketId)));
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const toggleWishlist = async (m: MarketRow) => {
    const on = wishIds.has(m.id);
    try {
      const res = await fetch("/api/wishlist", {
        method: on ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ marketId: m.id }),
      });
      if (!res.ok) {
        setToast("请先登录后再使用心愿单");
        window.setTimeout(() => setToast(null), 2200);
        return;
      }
      setWishIds((prev) => {
        const n = new Set(prev);
        if (on) n.delete(m.id);
        else n.add(m.id);
        return n;
      });
      setToast(on ? "已从心愿单移除" : `已加入心愿单：${m.title}`);
      window.setTimeout(() => setToast(null), 2200);
    } catch {
      setToast("网络异常");
      window.setTimeout(() => setToast(null), 2200);
    }
  };

  const filtered = useMemo(() => {
    let list = cat === "all" ? [...initialTools] : initialTools.filter((t) => t.category === cat);
    const n = q.trim().toLowerCase();
    if (n) {
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(n) ||
          t.description.toLowerCase().includes(n) ||
          t.category.toLowerCase().includes(n),
      );
    }
    list.sort((a, b) => {
      if (sort === "rating") return b.avgRating - a.avgRating;
      if (sort === "reviews") return b.reviewCount - a.reviewCount;
      return a.name.localeCompare(b.name, "zh-CN");
    });
    return list;
  }, [cat, initialTools, q, sort]);

  const marketFiltered = useMemo(() => {
    const n = marketQ.trim().toLowerCase();
    if (!n) return initialMarket;
    return initialMarket.filter(
      (m) =>
        m.title.toLowerCase().includes(n) ||
        m.description.toLowerCase().includes(n) ||
        m.itemType.toLowerCase().includes(n),
    );
  }, [initialMarket, marketQ]);

  return (
    <div className="space-y-4 pb-4">
      {toast ? (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-zinc-950 px-4 py-2 text-xs text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <PageHeader
        title="工具与商城"
        subtitle="场景筛选 · 本地搜索/排序 · 详情评价 · 商城筛选（演示级产品逻辑）。"
        right={
          <div className="flex gap-1">
            <button
              type="button"
              title="命令面板"
              aria-label="命令面板"
              onClick={() => window.dispatchEvent(new Event("vibe-open-command-palette"))}
              className="rounded-2xl bg-white/80 px-2.5 py-2 text-[11px] font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-white"
            >
              ⌘K
            </button>
            <Link
              href="/search"
              className="rounded-2xl bg-white/80 px-3 py-2 text-[11px] font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-white"
            >
              去搜索
            </Link>
            <Link
              href="/orders"
              className="rounded-2xl bg-white/80 px-3 py-2 text-[11px] font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-white"
            >
              订单
            </Link>
          </div>
        }
      />

      <section className="glass-panel rounded-3xl p-3 shadow-soft ring-1 ring-white/70">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 ring-1 ring-zinc-200/70">
            <Search className="h-4 w-4 shrink-0 text-zinc-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="筛选工具名称、描述、分类…"
              className="min-w-0 flex-1 bg-transparent text-xs outline-none"
            />
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-zinc-100/80 p-0.5 ring-1 ring-zinc-200/60">
            {(
              [
                { id: "rating" as const, label: "评分优先" },
                { id: "reviews" as const, label: "评价数" },
                { id: "name" as const, label: "名称" },
              ] satisfies { id: ToolSort; label: string }[]
            ).map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setSort(x.id)}
                className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${
                  sort === x.id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600"
                }`}
              >
                {x.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-2 flex items-center gap-1 text-[10px] font-semibold text-zinc-400">
          <SlidersHorizontal className="h-3 w-3" />
          场景分类
        </div>
        <ToolCategoryNav value={cat} onChange={setCat} />
        <ul className="mt-3 space-y-2">
          {filtered.map((t) => (
            <li key={t.id}>
              <Link
                href={`/tools/${t.id}`}
                className="block rounded-2xl border border-zinc-200/70 bg-white/70 px-3 py-3 transition hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-950">{t.name}</p>
                    <p className="text-[11px] text-zinc-600">{t.category}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-200/70">
                    {t.avgRating.toFixed(1)}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-700">{t.description}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{t.reviewCount} 条评价</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-brand-800">
                    进入详情
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-xs text-zinc-600">该分类暂无工具</p>
        ) : null}
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-zinc-950">工具商城</h2>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-600">
            <ShoppingBag className="h-4 w-4 text-brand-700" />
            可扩展订单系统
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 ring-1 ring-zinc-200/70">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            value={marketQ}
            onChange={(e) => setMarketQ(e.target.value)}
            placeholder="筛选商品标题、类型、描述…"
            className="min-w-0 flex-1 bg-transparent text-xs outline-none"
          />
        </div>
        <ul className="mt-3 space-y-2">
          {marketFiltered.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200/70 bg-white/70 px-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-950">{m.title}</p>
                <p className="text-[11px] text-zinc-600">{m.itemType}</p>
                <p className="mt-0.5 text-xs font-bold text-brand-900">{formatPrice(m.priceCents)}</p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-zinc-700">
                  {m.description}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-stretch gap-2">
                <Link
                  href={`/market/${m.id}`}
                  className="rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-2 text-center text-[11px] font-semibold text-white shadow-glow"
                >
                  购买
                </Link>
                <button
                  type="button"
                  aria-pressed={wishIds.has(m.id)}
                  aria-label={wishIds.has(m.id) ? "从心愿单移除" : "加入心愿单"}
                  onClick={() => void toggleWishlist(m)}
                  className="rounded-2xl bg-white px-3 py-2 text-[11px] font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
                >
                  {wishIds.has(m.id) ? "已加入心愿单" : "加入心愿单"}
                </button>
              </div>
            </li>
          ))}
        </ul>
        {marketFiltered.length === 0 ? (
          <p className="py-6 text-center text-xs text-zinc-600">没有匹配的商品，清空筛选试试</p>
        ) : null}
      </section>
    </div>
  );
}
