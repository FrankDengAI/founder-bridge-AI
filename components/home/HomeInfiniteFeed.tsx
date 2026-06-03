"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FeedCard } from "@/components/FeedCard";
import { HomeFeedGrid } from "@/components/home/HomeFeedGrid";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

export type FeedPostItem = {
  id: string;
  type: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  likes: number;
  saves: number;
  author: { id: string; displayName: string };
};

type Props = {
  initialPosts: FeedPostItem[];
  initialNextCursor: string | null;
  type?: string;
  sort: "new" | "hot";
  view?: string;
  emptyMessage: string;
};

const PAGE_SIZE = 20;

export function HomeInfiniteFeed({
  initialPosts,
  initialNextCursor,
  type,
  sort,
  view,
  emptyMessage,
}: Props) {
  const t = useTranslations("homeUi.infinite");
  const tGuest = useTranslations("authModal");
  const { isAuthenticated, openLogin } = useRequireAuth();
  const [posts, setPosts] = useState(initialPosts);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [ended, setEnded] = useState(!initialNextCursor);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const canLoadMore = !view || view === "default";

  useEffect(() => {
    setPosts(initialPosts);
    setNextCursor(initialNextCursor);
    setEnded(!initialNextCursor);
    setError(false);
    loadingRef.current = false;
  }, [initialPosts, initialNextCursor, type, sort, view]);

  const loadMore = useCallback(async () => {
    if (!canLoadMore || loadingRef.current || ended || !nextCursor) return;
    loadingRef.current = true;
    setLoading(true);
    setError(false);
    try {
      const url = new URL("/api/posts", window.location.origin);
      url.searchParams.set("take", String(PAGE_SIZE));
      url.searchParams.set("cursor", nextCursor);
      if (type) url.searchParams.set("type", type);
      if (sort === "hot") url.searchParams.set("sort", "hot");
      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) {
        setError(true);
        return;
      }
      const data = (await res.json()) as {
        posts: FeedPostItem[];
        nextCursor: string | null;
      };
      const incoming = data.posts ?? [];
      if (incoming.length === 0) {
        setEnded(true);
        setNextCursor(null);
        return;
      }
      setPosts((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        const merged = [...prev];
        for (const p of incoming) {
          if (!seen.has(p.id)) merged.push(p);
        }
        return merged;
      });
      setNextCursor(data.nextCursor ?? null);
      if (!data.nextCursor || incoming.length < PAGE_SIZE) setEnded(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [canLoadMore, ended, nextCursor, type, sort]);

  useEffect(() => {
    if (!canLoadMore || ended || error) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "320px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [canLoadMore, ended, error, loadMore]);

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-6 text-center text-sm text-zinc-600 shadow-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-2">
      <HomeFeedGrid>
        {posts.map((p) => (
          <div key={p.id} className="mb-2 break-inside-avoid">
            <FeedCard
              id={p.id}
              authorId={p.author.id}
              type={p.type}
              title={p.title}
              excerpt={p.excerpt}
              coverUrl={p.coverUrl}
              authorName={p.author.displayName}
              likes={p.likes}
              saves={p.saves}
            />
          </div>
        ))}
      </HomeFeedGrid>
      {!isAuthenticated ? (
        <div className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-30 -mx-0.5 mt-3">
          <div className="rounded-2xl border border-violet-200/90 bg-white/95 px-4 py-3 text-center shadow-lg shadow-violet-500/10 ring-1 ring-violet-100/80 backdrop-blur-md">
            <p className="text-xs leading-relaxed text-zinc-600">{tGuest("guestFeedHint")}</p>
            <button
              type="button"
              className="mt-2 inline-flex min-h-[36px] items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-xs font-semibold text-white shadow-md transition hover:brightness-105 active:scale-[0.98]"
              onClick={() => openLogin({ reason: "default" })}
            >
              {tGuest("guestFeedCta")}
            </button>
          </div>
        </div>
      ) : null}
      {canLoadMore ? (
        <div ref={sentinelRef} className="min-h-[48px] py-3 text-center text-xs text-zinc-500">
          {error ? (
            <button
              type="button"
              onClick={() => void loadMore()}
              className="font-semibold text-violet-700 underline-offset-2 hover:underline"
            >
              {t("retry")}
            </button>
          ) : loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
              {t("loading")}
            </span>
          ) : ended ? (
            t("end")
          ) : (
            t("scrollHint")
          )}
        </div>
      ) : (
        <p className="py-3 text-center text-xs text-zinc-500">{t("viewNoMore")}</p>
      )}
    </div>
  );
}
