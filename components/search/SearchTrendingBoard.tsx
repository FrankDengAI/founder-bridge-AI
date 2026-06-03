"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { AuthLoginLink } from "@/components/auth/AuthLoginLink";
import {
  ChevronRight,
  Crown,
  Flame,
  Sparkles,
  TrendingUp,
  Wrench,
} from "lucide-react";
import clsx from "clsx";

export type TrendingRailData = {
  hotPosts: { id: string; title: string; likes: number }[];
  hotTools: { id: string; name: string; avgRating: number }[];
  hotModels: {
    id: string;
    name: string;
    provider: string;
    avgRating: number;
    reviewCount: number;
  }[];
};

type TabId = "all" | "posts" | "tools" | "models";

type TrendItem = {
  id: string;
  title: string;
  href: string;
  heat: number;
  heatLabel: string;
  kind: TabId;
  provider?: string;
};

const RANK_STYLES = [
  "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/30",
  "bg-gradient-to-br from-zinc-300 to-zinc-400 text-white",
  "bg-gradient-to-br from-orange-300 to-amber-500 text-white",
] as const;

function RankMedal({ index }: { index: number }) {
  if (index < 3) {
    return (
      <span
        className={clsx(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black",
          RANK_STYLES[index],
        )}
      >
        {index + 1}
      </span>
    );
  }
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-bold text-zinc-500">
      {index + 1}
    </span>
  );
}

function heatScorePosts(likes: number) {
  return Math.round(likes * 1.2 + 40);
}

function heatScoreTools(rating: number) {
  return Math.round(rating * 28 + 35);
}

function heatScoreModels(rating: number, reviews: number) {
  return Math.round(rating * 22 + reviews * 3 + 50);
}

function formatHeat(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function TrendingItemLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  if (href.startsWith("/post/")) {
    return (
      <AuthLoginLink href={href} reason="viewPost" className={className}>
        {children}
      </AuthLoginLink>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

type Props = {
  data: TrendingRailData;
  onPickQuery?: (q: string) => void;
};

export function SearchTrendingBoard({ data }: Props) {
  const t = useTranslations("pages.search");
  const tw = useTranslations("webShell");
  const [tab, setTab] = useState<TabId>("all");

  const tabs: { id: TabId; label: string; icon: typeof Flame }[] = [
    { id: "all", label: t("tabAll"), icon: TrendingUp },
    { id: "posts", label: t("tabPosts"), icon: Flame },
    { id: "tools", label: t("tabTools"), icon: Wrench },
    { id: "models", label: t("tabModels"), icon: Sparkles },
  ];

  const items = useMemo((): TrendItem[] => {
    const posts: TrendItem[] = data.hotPosts.map((p) => ({
      id: p.id,
      title: p.title,
      href: `/post/${p.id}`,
      heat: heatScorePosts(p.likes),
      heatLabel: `${p.likes}♥`,
      kind: "posts",
    }));
    const tools: TrendItem[] = data.hotTools.map((tool) => ({
      id: tool.id,
      title: tool.name,
      href: `/tools/${tool.id}`,
      heat: heatScoreTools(tool.avgRating),
      heatLabel: `${tool.avgRating.toFixed(1)}★`,
      kind: "tools",
    }));
    const models: TrendItem[] = data.hotModels.map((m) => ({
      id: m.id,
      title: m.name,
      href: `/models/${m.id}`,
      heat: heatScoreModels(m.avgRating, m.reviewCount),
      heatLabel: `${m.avgRating.toFixed(1)}★`,
      kind: "models",
      provider: m.provider,
    }));

    if (tab === "posts") return posts.slice(0, 10);
    if (tab === "tools") return tools.slice(0, 10);
    if (tab === "models") return models.slice(0, 10);
    return [...posts, ...tools, ...models].sort((a, b) => b.heat - a.heat).slice(0, 10);
  }, [data, tab]);

  const viewAllHref =
    tab === "tools" ? "/tools" : tab === "models" ? "/models" : tab === "posts" ? "/home" : "/models";

  const viewAllLabel =
    tab === "tools"
      ? t("viewAllTools")
      : tab === "models"
        ? t("viewAllModels")
        : tab === "posts"
          ? t("viewAllPosts")
          : t("viewAllTrending");

  if (items.length === 0) return null;

  const topThree = items.slice(0, 3);
  const rest = items.slice(3);

  return (
    <section className="overflow-hidden rounded-[1.35rem] border border-zinc-200/80 bg-white shadow-[0_20px_50px_-28px_rgba(249,115,22,0.35)] ring-1 ring-orange-100/60">
      <div className="relative bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 px-4 pb-3 pt-4 sm:px-5">
        <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/95 backdrop-blur-sm">
              <Flame className="h-3.5 w-3.5" />
              LIVE
            </p>
            <h2 className="mt-2 text-lg font-bold tracking-tight text-white sm:text-xl">
              {t("trendingTitle")}
            </h2>
            <p className="mt-0.5 text-xs text-white/85">{t("trendingSubtitle")}</p>
          </div>
          <span className="shrink-0 rounded-lg bg-black/15 px-2 py-1 text-[10px] font-medium text-white/90">
            {t("trendingUpdated")}
          </span>
        </div>

        <div
          className="relative mt-4 flex gap-1 rounded-xl bg-black/15 p-1 backdrop-blur-sm"
          role="tablist"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={clsx(
                "flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg px-1.5 py-2 text-[10px] font-bold transition sm:text-[11px]",
                tab === id
                  ? "bg-white text-orange-700 shadow-sm"
                  : "text-white/85 hover:bg-white/10",
              )}
            >
              <Icon className="hidden h-3.5 w-3.5 sm:block" aria-hidden />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {topThree.length > 0 ? (
        <div className="grid gap-2 border-b border-zinc-100 bg-gradient-to-b from-orange-50/50 to-white p-3 sm:grid-cols-3 sm:p-4">
          {topThree.map((item, i) => (
            <TrendingItemLink
              key={`${item.kind}-${item.id}`}
              href={item.href}
              className={clsx(
                "group relative flex flex-col rounded-2xl border p-3 text-left transition active:scale-[0.98]",
                i === 0
                  ? "border-amber-200/80 bg-gradient-to-br from-amber-50 to-white shadow-sm ring-1 ring-amber-100"
                  : "border-zinc-200/80 bg-white hover:border-violet-200 hover:shadow-md",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <RankMedal index={i} />
                {i === 0 ? (
                  <Crown className="h-4 w-4 text-amber-500" aria-hidden />
                ) : (
                  <span className="text-[10px] font-bold tabular-nums text-orange-600">
                    {formatHeat(item.heat)}
                  </span>
                )}
              </div>
              <p
                className={clsx(
                  "mt-2 line-clamp-2 font-semibold leading-snug text-zinc-900 group-hover:text-violet-900",
                  i === 0 ? "text-sm" : "text-[13px]",
                )}
              >
                {item.title}
              </p>
              {item.provider ? (
                <p className="mt-1 truncate text-[10px] text-zinc-500">{item.provider}</p>
              ) : null}
              <p className="mt-auto pt-2 text-[10px] font-medium text-zinc-500">{item.heatLabel}</p>
            </TrendingItemLink>
          ))}
        </div>
      ) : null}

      <ol className="divide-y divide-zinc-100/90 px-2 py-1 sm:px-3">
        {rest.map((item, idx) => {
          const rank = idx + 3;
          return (
            <li key={`${item.kind}-${item.id}`}>
              <TrendingItemLink
                href={item.href}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-violet-50/60 active:bg-violet-50"
              >
                <span
                  className={clsx(
                    "w-6 shrink-0 text-center text-sm font-bold tabular-nums",
                    rank < 6 ? "text-orange-600" : "text-zinc-400",
                  )}
                >
                  {rank + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-zinc-900">{item.title}</p>
                  <p className="text-[10px] text-zinc-500">
                    {item.kind === "posts"
                      ? tw("hotPosts")
                      : item.kind === "tools"
                        ? tw("hotTools")
                        : tw("hotModels")}
                    {item.provider ? ` · ${item.provider}` : null}
                  </p>
                </div>
                <span className="shrink-0 text-right">
                  <span className="block text-xs font-bold tabular-nums text-orange-600">
                    {formatHeat(item.heat)}
                  </span>
                  <span className="text-[10px] text-zinc-400">{item.heatLabel}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-zinc-300" aria-hidden />
              </TrendingItemLink>
            </li>
          );
        })}
      </ol>

      <div className="border-t border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <Link
          href={viewAllHref}
          className="flex items-center justify-center gap-1 text-xs font-semibold text-violet-700 transition hover:text-violet-900"
        >
          {viewAllLabel}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
