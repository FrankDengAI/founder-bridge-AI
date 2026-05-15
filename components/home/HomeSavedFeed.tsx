"use client";

import { useEffect, useState } from "react";
import { FeedCard } from "@/components/FeedCard";
import { readSavedPostIds } from "@/lib/appHub";

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
  const [posts, setPosts] = useState<PostPayload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = readSavedPostIds();
    if (!ids.length) {
      setPosts([]);
      setLoading(false);
      return;
    }
    void (async () => {
      setLoading(true);
      try {
        const u = new URL("/api/posts", window.location.origin);
        u.searchParams.set("ids", ids.join(","));
        const res = await fetch(u.toString());
        const data = (await res.json()) as { posts: PostPayload[] };
        setPosts(data.posts ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center text-sm text-zinc-500 motion-safe:animate-pulse">
        正在加载本地收藏…
      </div>
    );
  }
  if (posts.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center text-sm text-zinc-600">
        暂无本地收藏。在发现卡片右上角点「书签」即可加入。
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
          />
        </div>
      ))}
    </div>
  );
}
