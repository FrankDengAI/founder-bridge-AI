"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AuthLoginLink } from "@/components/auth/AuthLoginLink";
import { FeedCard } from "@/components/FeedCard";
import { readSavedPostIds } from "@/lib/appHub";
import { useClientUserId, useClientUserReady } from "@/lib/hooks/useClientUserId";

type PostPayload = {
  id: string;
  authorId: string;
  type: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  author: { displayName: string };
  likes: number;
  saves: number;
};

export function HomeSavedFeed() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const userId = useClientUserId();
  const ready = useClientUserReady();
  const [posts, setPosts] = useState<PostPayload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    void (async () => {
      setLoading(true);
      try {
        if (userId) {
          const u = new URL("/api/posts", window.location.origin);
          u.searchParams.set("saved", "1");
          const res = await fetch(u.toString(), { credentials: "include" });
          if (res.ok) {
            const data = (await res.json()) as { posts: PostPayload[] };
            setPosts(data.posts ?? []);
            return;
          }
        }
        const ids = readSavedPostIds();
        if (!ids.length) {
          setPosts([]);
          return;
        }
        const u = new URL("/api/posts", window.location.origin);
        u.searchParams.set("ids", ids.join(","));
        const res = await fetch(u.toString());
        const data = (await res.json()) as { posts: PostPayload[] };
        setPosts(data.posts ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, ready]);

  if (!ready || loading) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center text-sm text-zinc-500 motion-safe:animate-pulse">
        {t("loadingSaved")}
      </div>
    );
  }
  if (posts.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center text-sm text-zinc-600">
        {userId ? t("noSavedLoggedIn") : t("noSavedGuest")}{" "}
        {!userId ? (
          <AuthLoginLink href="/home" reason="default" className="font-semibold text-violet-700 hover:underline">
            {tCommon("login")}
          </AuthLoginLink>
        ) : null}
      </div>
    );
  }

  return (
    <div className="columns-2 gap-2 space-y-2 [column-fill:_balance]">
      {posts.map((p) => (
        <div key={p.id} className="mb-2 break-inside-avoid">
          <FeedCard
            id={p.id}
            authorId={p.authorId}
            type={p.type}
            title={p.title}
            excerpt={p.excerpt}
            coverUrl={p.coverUrl}
            authorName={p.author.displayName}
            likes={p.likes}
            saves={p.saves}
            initiallySaved
          />
        </div>
      ))}
    </div>
  );
}
