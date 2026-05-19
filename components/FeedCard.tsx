"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  BookOpen,
  ChevronRight,
  Code2,
  FileText,
  Flame,
  Heart,
  Layers,
  Lightbulb,
  PlayCircle,
  Sparkles,
  Star,
} from "lucide-react";
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

/** 类型 → 视觉配方 */
const TYPE_THEME: Record<
  PostType,
  {
    icon: typeof FileText;
    chipBg: string;
    chipText: string;
    accent: string;
    overlay?: "video" | "code" | "longform";
  }
> = {
  NOTE: {
    icon: FileText,
    chipBg: "bg-white/95",
    chipText: "text-zinc-900",
    accent: "ring-violet-300/40",
  },
  VIDEO: {
    icon: PlayCircle,
    chipBg: "bg-rose-500/95",
    chipText: "text-white",
    accent: "ring-rose-300/50",
    overlay: "video",
  },
  ARTICLE: {
    icon: BookOpen,
    chipBg: "bg-cyan-500/95",
    chipText: "text-white",
    accent: "ring-cyan-300/50",
    overlay: "longform",
  },
  SHOWCASE: {
    icon: Layers,
    chipBg: "bg-fuchsia-500/95",
    chipText: "text-white",
    accent: "ring-fuchsia-300/50",
  },
  REVIEW: {
    icon: Star,
    chipBg: "bg-amber-500/95",
    chipText: "text-white",
    accent: "ring-amber-300/50",
  },
  IDEA: {
    icon: Lightbulb,
    chipBg: "bg-lime-500/95",
    chipText: "text-zinc-900",
    accent: "ring-lime-300/50",
  },
  TUTORIAL: {
    icon: Code2,
    chipBg: "bg-indigo-500/95",
    chipText: "text-white",
    accent: "ring-indigo-300/50",
    overlay: "code",
  },
};

/** 从标题中抽取技术 / 主题标签做为 mini chips（轻量正则） */
const TAG_DICTIONARY = [
  "AI",
  "LLM",
  "Cursor",
  "Claude",
  "GPT",
  "Next.js",
  "React",
  "Tailwind",
  "Prisma",
  "Supabase",
  "Stripe",
  "出海",
  "增长",
  "运营",
  "投放",
  "私域",
  "小红书",
  "抖音",
  "RAG",
  "Agent",
  "Prompt",
];
function extractTags(text: string): string[] {
  const hits: string[] = [];
  for (const t of TAG_DICTIONARY) {
    if (text.toLowerCase().includes(t.toLowerCase())) hits.push(t);
    if (hits.length >= 2) break;
  }
  return hits;
}

export function FeedCard(p: FeedCardProps) {
  const t: PostType = isPostType(p.type) ? p.type : "NOTE";
  const theme = TYPE_THEME[t];
  const [saved, setSaved] = useState(false);
  const tags = useMemo(() => extractTags(`${p.title} ${p.excerpt}`), [p.title, p.excerpt]);
  const isHot = p.likes + p.saves >= 60;
  // 保留 theme.accent 在源码中以便 Tailwind JIT 静态识别（防止 purge）
  void theme.accent;

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
        "hover:-translate-y-1 hover:shadow-[0_24px_60px_-22px_rgba(139,92,246,0.5)] hover:ring-violet-300/50",
      )}
    >
      <Link href={`/post/${p.id}`} className="block" data-author={p.authorId}>
        <div className="relative aspect-[4/5] w-full bg-zinc-100">
          <Image
            src={p.coverUrl}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.05]"
            sizes="(max-width: 768px) 50vw, 200px"
          />
          {/* 顶到底渐变 */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/0" />

          {/* 类型徽章（左上） */}
          <span
            className={clsx(
              "absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm backdrop-blur",
              theme.chipBg,
              theme.chipText,
            )}
          >
            <theme.icon className="h-3 w-3" />
            {POST_TYPE_LABEL[t]}
          </span>

          {/* 热门 fire 标 */}
          {isHot ? (
            <span className="absolute right-12 top-2 inline-flex items-center gap-0.5 rounded-full bg-rose-500/95 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
              <Flame className="h-3 w-3" />
              热
            </span>
          ) : null}

          {/* 不同类型的覆盖层 */}
          {theme.overlay === "video" ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/45 backdrop-blur transition group-hover:scale-110">
                <PlayCircle className="h-7 w-7 text-white drop-shadow" />
              </span>
              <span className="absolute right-2 top-9 rounded bg-black/55 px-1 py-0.5 text-[9px] font-mono text-white">
                02:48
              </span>
            </div>
          ) : null}
          {theme.overlay === "longform" ? (
            <span className="pointer-events-none absolute right-2 top-9 inline-flex items-center gap-0.5 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-mono text-white backdrop-blur">
              <BookOpen className="h-2.5 w-2.5" />8 min
            </span>
          ) : null}
          {theme.overlay === "code" ? (
            <span className="pointer-events-none absolute right-2 top-9 inline-flex items-center gap-0.5 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-mono text-white backdrop-blur">
              <Code2 className="h-2.5 w-2.5" /> .ts
            </span>
          ) : null}

          {/* 底部作者条 */}
          <span className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/95">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 text-[10px] font-bold text-white shadow ring-1 ring-white/20">
                {p.authorName.slice(0, 1)}
              </span>
              <span className="line-clamp-1 drop-shadow">{p.authorName}</span>
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-80 transition group-hover:translate-x-0.5" />
          </span>

          {/* tag chips（左下） */}
          {tags.length ? (
            <div className="pointer-events-none absolute bottom-9 left-2 flex flex-wrap gap-1">
              {tags.map((tg) => (
                <span
                  key={tg}
                  className="rounded-md bg-black/45 px-1.5 py-0.5 text-[9px] font-medium text-white/95 backdrop-blur"
                >
                  #{tg}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-1.5 p-3">
          <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-zinc-900 transition group-hover:text-violet-900">
            {p.title}
          </p>
          {p.excerpt ? (
            <p className="line-clamp-1 text-[11px] leading-snug text-zinc-500">
              {p.excerpt}
            </p>
          ) : null}
          <div className="flex items-center justify-between pt-0.5 text-[11px] text-zinc-500">
            <span className="inline-flex items-center gap-0.5 text-rose-500/85">
              <Heart className="h-3.5 w-3.5" />
              <span className="num-tab text-zinc-700">{p.likes}</span>
            </span>
            <span className="inline-flex items-center gap-0.5 text-amber-500/85">
              <Bookmark className="h-3.5 w-3.5" />
              <span className="num-tab text-zinc-700">{p.saves}</span>
            </span>
            <span className="inline-flex items-center gap-0.5 text-violet-500/85">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="num-tab text-zinc-700">
                {Math.max(1, Math.round((p.likes + p.saves) * 0.15))}
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
          className={clsx(
            "h-4 w-4 transition",
            saved && "fill-current text-amber-700 scale-110",
          )}
        />
      </button>
    </div>
  );
}
