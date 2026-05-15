"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Bookmark, ChevronRight, Heart } from "lucide-react";
import type { PostType } from "@/lib/domain/postType";
import { isPostType } from "@/lib/domain/postType";
import { POST_TYPE_LABEL } from "@/lib/labels";
import { isPostSaved, readSavedPostIds, toggleSavedPost } from "@/lib/appHub";
import { syncSaveCountBadge } from "@/lib/gamification";
import clsx from "clsx";

export type FeedCardProps = {
  id: string;
  authorId: string;
  type: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  authorName: string;
  likes: number;
  saves: number;
};

export function FeedCard(p: FeedCardProps) {
  const t: PostType = isPostType(p.type) ? p.type : "NOTE";
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isPostSaved(p.id));
  }, [p.id]);

  const onToggleSave = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const next = toggleSavedPost(p.id);
      setSaved(next);
      syncSaveCountBadge(readSavedPostIds().length);
    },
    [p.id],
  );

  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200/70 transition",
        "hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(139,92,246,0.45)] hover:ring-violet-300/60",
      )}
    >
      <Link href={`/post/${p.id}`} className="block" data-author={p.authorId}>
        <div className="relative aspect-[4/5] w-full bg-zinc-100">
          <Image
            src={p.coverUrl}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, 200px"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-zinc-900 shadow-sm ring-1 ring-black/5 backdrop-blur">
            {POST_TYPE_LABEL[t]}
          </span>
          <span className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/95">
            <span className="line-clamp-1 drop-shadow">{p.authorName}</span>
            <ChevronRight className="h-4 w-4 opacity-80" />
          </span>
        </div>
        <div className="space-y-1.5 p-3">
          <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-zinc-900">
            {p.title}
          </p>
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span className="line-clamp-1 rounded-full bg-zinc-50 px-2 py-0.5 font-medium text-zinc-700 ring-1 ring-zinc-200/70">
              @{p.authorName}
            </span>
            <span className="inline-flex items-center gap-2 text-zinc-400">
              <span className="inline-flex items-center gap-0.5">
                <Heart className="h-3.5 w-3.5" />
                {p.likes}
              </span>
              <span className="inline-flex items-center gap-0.5">
                <Bookmark className="h-3.5 w-3.5" />
                {p.saves}
              </span>
            </span>
          </div>
        </div>
      </Link>
      <button
        type="button"
        title={saved ? "取消收藏" : "收藏到本地"}
        aria-label={saved ? "取消收藏此笔记" : "收藏此笔记到本地"}
        aria-pressed={saved}
        onClick={onToggleSave}
        className={clsx(
          "absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-xl shadow-md ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
          saved
            ? "bg-amber-100 text-amber-800 ring-amber-300/80"
            : "bg-white/90 text-zinc-600 ring-zinc-200/80 hover:bg-white",
        )}
      >
        <Bookmark
          className={clsx("h-4 w-4", saved && "fill-current text-amber-700")}
        />
      </button>
    </div>
  );
}
