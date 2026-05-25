"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { readRecentViews, type RecentView } from "@/lib/retention";

export function ContinueReading() {
  const [items, setItems] = useState<RecentView[]>([]);

  useEffect(() => {
    const load = () => setItems(readRecentViews().slice(0, 3));
    load();
    window.addEventListener("vibe-recent-updated", load);
    return () => window.removeEventListener("vibe-recent-updated", load);
  }, []);

  if (items.length === 0) {
    return (
      <section className="space-y-2">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
          <BookOpen className="h-3.5 w-3.5 text-violet-600" />
          新手推荐
        </p>
        <p className="text-[11px] text-zinc-600">
          浏览几篇热门内容后，这里会出现「接着看」快速入口。
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/home?sort=hot"
            className="rounded-2xl bg-white/90 px-3 py-2 text-[11px] font-semibold text-zinc-800 ring-1 ring-zinc-200/80"
          >
            看热门笔记
          </Link>
          <Link
            href="/match"
            className="rounded-2xl bg-violet-100 px-3 py-2 text-[11px] font-semibold text-violet-900 ring-1 ring-violet-200/70"
          >
            去匹配
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
        <BookOpen className="h-3.5 w-3.5 text-violet-600" />
        接着看
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((it) => (
          <Link
            key={it.postId}
            href={`/post/${it.postId}`}
            className="shrink-0 rounded-2xl bg-white/90 px-3 py-2 text-[11px] font-semibold text-zinc-800 ring-1 ring-zinc-200/80 hover:ring-violet-300/80"
          >
            {it.title.slice(0, 24)}
            {it.title.length > 24 ? "…" : ""}
          </Link>
        ))}
      </div>
    </section>
  );
}
