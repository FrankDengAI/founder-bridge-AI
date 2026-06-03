"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Filter, Flame, Search as SearchIcon, Sparkles, X } from "lucide-react";
import { AuthLoginLink } from "@/components/auth/AuthLoginLink";
import { PageHeader } from "@/components/PageHeader";
import { SearchDiscoverySections } from "@/components/search/SearchDiscoverySections";
import { SearchHotQueries } from "@/components/search/SearchHotQueries";
import { getPostTypeLabel } from "@/lib/labels";
import { POST_TYPES } from "@/lib/domain/postType";
import { isPostType } from "@/lib/domain/postType";
import {
  clearSearchHistory,
  rememberSearchQuery,
  readSearchHistory,
} from "@/lib/searchHistory";
import { useIsWebMode } from "@/lib/hooks/useIsWebMode";
import { currentBrowserLocale, localizedPathWithSearch } from "@/lib/localePath";
import clsx from "clsx";

type Hit = {
  id: string;
  type: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  author: { id: string; displayName: string };
  likes?: number;
  saves?: number;
};

function highlight(text: string, q: string) {
  if (!q.trim()) return text;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === q.trim().toLowerCase() ? (
      <mark key={i} className="rounded bg-amber-100 px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function SearchPage() {
  const isWeb = useIsWebMode();
  const t = useTranslations("pages.search");
  const tPost = useTranslations("postType");
  const tCommon = useTranslations("common");
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState<"new" | "hot">("new");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);

  const query = useMemo(() => q.trim(), [q]);
  const showDiscovery = !query && !focused;

  useEffect(() => {
    setHistory(readSearchHistory());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setQ(params.get("q") ?? "");
    const tp = params.get("type") ?? "";
    setType(tp && isPostType(tp) ? tp : "");
    setSort(params.get("sort") === "hot" ? "hot" : "new");
  }, []);

  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (type && isPostType(type)) params.set("type", type);
    if (sort === "hot") params.set("sort", "hot");
    const qs = params.toString();
    const next = localizedPathWithSearch("/search", qs, currentBrowserLocale());
    window.history.replaceState(null, "", next);
  }, [query, type, sort]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void (async () => {
        setLoading(true);
        try {
          const url = new URL("/api/posts", window.location.origin);
          if (query) url.searchParams.set("q", query);
          if (type && isPostType(type)) url.searchParams.set("type", type);
          if (sort === "hot") url.searchParams.set("sort", "hot");
          url.searchParams.set("take", "40");
          const res = await fetch(url.toString());
          const data = (await res.json()) as { posts: Hit[] };
          setHits(data.posts ?? []);
          if (query) rememberSearchQuery(query);
        } finally {
          setLoading(false);
        }
      })();
    }, 220);
    return () => window.clearTimeout(id);
  }, [query, type, sort]);

  const handlePickQuery = (term: string) => {
    setQ(term);
    setFocused(false);
  };

  const handleClearHistory = () => {
    clearSearchHistory();
    setHistory([]);
  };

  return (
    <div className="space-y-4 pb-6">
      <PageHeader title={t("title")} subtitle={t("subtitle")} backHref="/home" />

      <div className="sticky top-0 z-20 -mx-1 rounded-2xl bg-[var(--page-bg,#fafafa)]/92 px-1 py-2 backdrop-blur-md">
        <div
          className={clsx(
            "flex items-center gap-2 rounded-2xl border bg-white px-3 py-2.5 shadow-sm transition",
            focused
              ? "border-violet-400 ring-2 ring-violet-500/15"
              : "border-zinc-200/90 ring-1 ring-zinc-100",
          )}
        >
          <SearchIcon className="h-5 w-5 shrink-0 text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 150)}
            placeholder={t("placeholder")}
            className="min-w-0 flex-1 bg-transparent text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ("")}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200"
              aria-label={t("clearQuery")}
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {showDiscovery ? (
          <SearchHotQueries
            history={history}
            onPick={handlePickQuery}
            onClearHistory={history.length > 0 ? handleClearHistory : undefined}
          />
        ) : null}

        <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="flex shrink-0 items-center gap-1 self-center pr-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <Filter className="h-3 w-3" />
            {t("type")}
          </span>
          <button
            type="button"
            onClick={() => setType("")}
            className={clsx(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              !type
                ? "border-violet-400 bg-violet-600 text-white shadow-sm"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300",
            )}
          >
            {t("all")}
          </button>
          {POST_TYPES.map((pt) => (
            <button
              key={pt}
              type="button"
              onClick={() => setType(pt)}
              className={clsx(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                type === pt
                  ? "border-violet-400 bg-violet-600 text-white shadow-sm"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300",
              )}
            >
              {getPostTypeLabel(tPost, pt)}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex rounded-full border border-zinc-200/90 bg-zinc-100/80 p-0.5">
            <button
              type="button"
              onClick={() => setSort("new")}
              className={clsx(
                "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                sort === "new"
                  ? "bg-white text-violet-900 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900",
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t("newest")}
            </button>
            <button
              type="button"
              onClick={() => setSort("hot")}
              className={clsx(
                "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                sort === "hot"
                  ? "bg-white text-orange-700 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900",
              )}
            >
              <Flame className="h-3.5 w-3.5" />
              {tCommon("hot")}
            </button>
          </div>
          <p className="text-[11px] font-medium text-zinc-500">
            {loading ? t("searching") : t("resultCount", { count: hits.length })}
          </p>
        </div>
      </div>

      {showDiscovery ? <SearchDiscoverySections /> : null}

      {query ? (
        <p className="px-0.5 text-xs font-medium text-zinc-500">
          {t("resultsFor", { query })}
        </p>
      ) : null}

      <ul
        className={clsx(
          isWeb ? "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3" : "space-y-2.5",
        )}
      >
        {hits.map((p, index) => {
          const label = isPostType(p.type) ? getPostTypeLabel(tPost, p.type) : p.type;
          const heat = (p.likes ?? 0) + (p.saves ?? 0) * 2;
          return (
            <li key={p.id}>
              <AuthLoginLink
                href={`/post/${p.id}`}
                reason="viewPost"
                className="group flex w-full gap-3 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-3 text-left shadow-sm transition hover:border-violet-200 hover:shadow-md active:scale-[0.99]"
              >
                <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl ring-1 ring-zinc-200/70">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition group-hover:scale-105"
                    style={{ backgroundImage: `url(${p.coverUrl})` }}
                  />
                  {sort === "hot" && index < 3 ? (
                    <span
                      className={clsx(
                        "absolute left-1 top-1 rounded-md px-1.5 py-0.5 text-[9px] font-black text-white",
                        index === 0 && "bg-red-500",
                        index === 1 && "bg-orange-500",
                        index === 2 && "bg-amber-500",
                      )}
                    >
                      {index + 1}
                    </span>
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-800">
                      {label}
                    </span>
                    {sort === "hot" && heat > 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-orange-600">
                        <Flame className="h-3 w-3" />
                        {heat}
                      </span>
                    ) : typeof p.likes === "number" ? (
                      <span className="text-[10px] text-zinc-400">♥ {p.likes}</span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-zinc-950 group-hover:text-violet-900">
                    {highlight(p.title, query)}
                  </p>
                  <p className="mt-1 line-clamp-1 text-[11px] text-zinc-500">{p.excerpt}</p>
                  <p className="mt-1.5 text-[11px] font-medium text-zinc-400">
                    {p.author.displayName}
                  </p>
                </div>
              </AuthLoginLink>
            </li>
          );
        })}
      </ul>

      {!loading && query && hits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center shadow-sm">
          <SearchIcon className="mx-auto h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm font-medium text-zinc-700">{t("empty")}</p>
          <p className="mt-1 text-xs text-zinc-500">{t("emptyHint")}</p>
        </div>
      ) : null}
    </div>
  );
}
