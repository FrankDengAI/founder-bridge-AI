"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Crown,
  Flame,
  Heart,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
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

      {/* 热门工具榜单条 — 顶部装饰带 */}
      {filtered.length > 0 ? (
        <section className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-r from-amber-50 via-rose-50 to-violet-50 p-4 shadow-soft">
          <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-amber-300/30 blur-2xl" />
          <div className="relative flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-white shadow-sm">
              <Crown className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-zinc-900">本周工具榜 Top 3</p>
              <p className="text-[11px] text-zinc-600">综合评分 + 评价数 + 收藏热度</p>
            </div>
          </div>
          <ol className="relative mt-3 grid gap-2 sm:grid-cols-3">
            {filtered.slice(0, 3).map((t, i) => (
              <li
                key={t.id}
                className="flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 ring-1 ring-white/80 backdrop-blur"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    i === 0
                      ? "bg-gradient-to-br from-amber-400 to-rose-500 text-white shadow"
                      : i === 1
                        ? "bg-gradient-to-br from-zinc-300 to-zinc-500 text-white"
                        : "bg-gradient-to-br from-orange-300 to-amber-500 text-white"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/tools/${t.id}`}
                    className="line-clamp-1 text-xs font-semibold text-zinc-900 hover:text-violet-800"
                  >
                    {t.name}
                  </Link>
                  <p className="line-clamp-1 text-[10px] text-zinc-500">{t.category}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">
                  <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                  {t.avgRating.toFixed(1)}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

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
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {filtered.map((t, idx) => {
            const stars = Math.round(t.avgRating * 2) / 2;
            const initial = t.name.replace(/[^A-Za-z一-龥]/g, "").slice(0, 1) || "T";
            return (
              <li key={t.id}>
                <Link
                  href={`/tools/${t.id}`}
                  className="group relative block overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/85 p-3 transition hover:-translate-y-0.5 hover:border-violet-300/70 hover:shadow-[0_18px_46px_-22px_rgba(139,92,246,0.45)]"
                >
                  {/* 角部装饰光 */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br from-violet-200/40 via-fuchsia-200/30 to-cyan-200/20 blur-2xl opacity-0 transition group-hover:opacity-100"
                  />
                  <div className="relative flex items-start gap-2.5">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white shadow-sm ${
                        idx % 4 === 0
                          ? "bg-gradient-to-br from-violet-500 to-fuchsia-500"
                          : idx % 4 === 1
                            ? "bg-gradient-to-br from-cyan-500 to-violet-500"
                            : idx % 4 === 2
                              ? "bg-gradient-to-br from-amber-500 to-rose-500"
                              : "bg-gradient-to-br from-emerald-500 to-cyan-500"
                      }`}
                    >
                      {initial}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="truncate text-sm font-bold text-zinc-950">{t.name}</p>
                        {t.avgRating >= 4.7 ? (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-700">
                            <Flame className="h-2.5 w-2.5" />
                            热门
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[10px] font-medium text-violet-700">
                        {t.category}
                      </p>
                      {/* 星条 */}
                      <div className="mt-1 flex items-center gap-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-3 w-3 ${
                                s <= stars
                                  ? "fill-amber-400 text-amber-400"
                                  : s - 0.5 === stars
                                    ? "fill-amber-200 text-amber-400"
                                    : "fill-zinc-200 text-zinc-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-700 num-tab">
                          {t.avgRating.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-zinc-400">·</span>
                        <span className="text-[10px] text-zinc-500">
                          {t.reviewCount} 评价
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-zinc-600">
                    {t.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-2 text-[11px]">
                    <span className="inline-flex items-center gap-1 text-zinc-500">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-zinc-700">
                        {Math.max(8, Math.round(t.reviewCount * 1.3))}
                      </span>
                      <span>本周热度</span>
                    </span>
                    <span className="inline-flex items-center gap-0.5 font-semibold text-violet-700 transition group-hover:gap-1">
                      详情
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
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
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {marketFiltered.map((m, idx) => {
            const onWish = wishIds.has(m.id);
            return (
              <li
                key={m.id}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/85 p-3 transition hover:-translate-y-0.5 hover:border-violet-300/70 hover:shadow-[0_18px_46px_-22px_rgba(139,92,246,0.45)]"
              >
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-50 ${
                    idx % 3 === 0
                      ? "bg-gradient-to-br from-violet-300/50 to-fuchsia-300/30"
                      : idx % 3 === 1
                        ? "bg-gradient-to-br from-cyan-300/50 to-violet-300/30"
                        : "bg-gradient-to-br from-amber-300/50 to-rose-300/30"
                  }`}
                />
                <div className="relative flex items-start gap-2">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base shadow-sm ${
                      idx % 3 === 0
                        ? "bg-violet-100 text-violet-700"
                        : idx % 3 === 1
                          ? "bg-cyan-100 text-cyan-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    <ShoppingBag className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-bold text-zinc-950">
                      {m.title}
                    </p>
                    <p className="text-[10px] font-medium text-violet-700">{m.itemType}</p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={onWish}
                    aria-label={onWish ? "从心愿单移除" : "加入心愿单"}
                    onClick={() => void toggleWishlist(m)}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ring-1 transition ${
                      onWish
                        ? "bg-rose-50 text-rose-600 ring-rose-200"
                        : "bg-white text-zinc-400 ring-zinc-200 hover:text-rose-500"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${onWish ? "fill-current" : ""}`} />
                  </button>
                </div>
                <p className="relative mt-2 line-clamp-2 text-[11px] leading-relaxed text-zinc-600">
                  {m.description}
                </p>
                <div className="relative mt-3 flex items-end justify-between border-t border-zinc-100 pt-2">
                  <div>
                    <p className="font-display text-xl font-bold text-zinc-950 num-tab">
                      <span className="text-xs text-zinc-400">¥</span>
                      {(m.priceCents / 100).toFixed(m.priceCents % 100 === 0 ? 0 : 2)}
                    </p>
                    <p className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] text-zinc-500">
                      <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                      已售 {Math.max(12, idx * 47 + 86)}
                    </p>
                  </div>
                  <Link
                    href={`/market/${m.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-glow transition hover:opacity-95"
                  >
                    立即购买
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        {marketFiltered.length === 0 ? (
          <p className="py-6 text-center text-xs text-zinc-600">没有匹配的商品，清空筛选试试</p>
        ) : null}
      </section>
    </div>
  );
}
