"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Flame, Search as SearchIcon, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { POST_TYPE_LABEL } from "@/lib/labels";
import { POST_TYPES } from "@/lib/domain/postType";
import { isPostType } from "@/lib/domain/postType";
import { rememberSearchQuery, readSearchHistory } from "@/lib/searchHistory";
import { SEARCH_HOT_WORDS } from "@/lib/searchHot";
import clsx from "clsx";

type Hit = {
  id: string;
  type: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  author: { id: string; displayName: string };
  likes?: number;
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
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState<"new" | "hot">("new");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const query = useMemo(() => q.trim(), [q]);

  useEffect(() => {
    setHistory(readSearchHistory());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setQ(params.get("q") ?? "");
    const t = params.get("type") ?? "";
    setType(t && isPostType(t) ? t : "");
    setSort(params.get("sort") === "hot" ? "hot" : "new");
  }, []);

  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (type && isPostType(type)) params.set("type", type);
    if (sort === "hot") params.set("sort", "hot");
    const qs = params.toString();
    const next = qs ? `/search?${qs}` : "/search";
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

  return (
    <div className="space-y-3 pb-4">
      <PageHeader
        title="搜索"
        subtitle="标题检索 · 类型与排序与发现页对齐 · 高亮关键词。"
        backHref="/home"
      />

      <div className="glass-panel space-y-3 rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 ring-1 ring-zinc-200/70">
          <SearchIcon className="h-4 w-4 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="例如：Next.js / 部署 / Prompt / 匹配"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        {(history.length > 0 || SEARCH_HOT_WORDS.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100/80 pt-3">
            <span className="w-full text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              搜索历史
            </span>
            {history.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setQ(h)}
                className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-700 hover:border-brand-300 hover:text-brand-900"
              >
                {h}
              </button>
            ))}
            <span className="mt-1 w-full text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              热门词
            </span>
            {SEARCH_HOT_WORDS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setQ(h)}
                className="rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-950 hover:bg-amber-100"
              >
                {h}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            <Filter className="h-3 w-3" />
            类型
          </span>
          <button
            type="button"
            onClick={() => setType("")}
            className={clsx(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium",
              !type ? "border-brand-300 bg-brand-50 text-brand-900" : "border-zinc-200 bg-white text-zinc-600",
            )}
          >
            全部
          </button>
          {POST_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={clsx(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                type === t
                  ? "border-brand-300 bg-brand-50 text-brand-900"
                  : "border-zinc-200 bg-white text-zinc-600",
              )}
            >
              {POST_TYPE_LABEL[t]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            排序
          </span>
          <button
            type="button"
            onClick={() => setSort("new")}
            className={clsx(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium",
              sort === "new"
                ? "border-brand-300 bg-brand-50 text-brand-900"
                : "border-zinc-200 bg-white text-zinc-600",
            )}
          >
            <Sparkles className="h-3 w-3" />
            最新
          </button>
          <button
            type="button"
            onClick={() => setSort("hot")}
            className={clsx(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium",
              sort === "hot"
                ? "border-amber-300 bg-amber-50 text-amber-950"
                : "border-zinc-200 bg-white text-zinc-600",
            )}
          >
            <Flame className="h-3 w-3 text-amber-600" />
            热门
          </button>
        </div>

        <p className="text-[11px] text-zinc-500">
          {loading ? "检索中…" : `共 ${hits.length} 条结果`}
        </p>
      </div>

      <ul className="space-y-2">
        {hits.map((p) => {
          const label = isPostType(p.type) ? POST_TYPE_LABEL[p.type] : p.type;
          return (
            <li key={p.id}>
              <Link
                href={`/post/${p.id}`}
                className="glass-panel flex gap-3 rounded-2xl p-3 shadow-sm transition hover:shadow-glow"
              >
                <div
                  className="h-16 w-16 shrink-0 rounded-2xl bg-cover bg-center ring-1 ring-zinc-200/70"
                  style={{ backgroundImage: `url(${p.coverUrl})` }}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-900 ring-1 ring-brand-200/60">
                      {label}
                    </span>
                    {typeof p.likes === "number" ? (
                      <span className="text-[10px] text-zinc-400">♥ {p.likes}</span>
                    ) : null}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold text-zinc-950">
                    {highlight(p.title, query)}
                  </p>
                  <p className="mt-1 line-clamp-1 text-[11px] text-zinc-600">{p.excerpt}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{p.author.displayName}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {!loading && query && hits.length === 0 ? (
        <div className="glass-panel rounded-2xl p-6 text-center text-sm text-zinc-600 shadow-sm">
          没有匹配到内容，试试更短的关键词或切换类型筛选。
        </div>
      ) : null}
    </div>
  );
}
