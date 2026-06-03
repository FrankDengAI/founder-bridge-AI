"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Bookmark,
  BookOpen,
  ChevronRight,
  Code2,
  Cpu,
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
import { getPostTypeLabel } from "@/lib/labels";
import { isPostSaved, readSavedPostIds, toggleSavedPost } from "@/lib/appHub";
import { syncSaveCountBadge } from "@/lib/gamification";
import { completeActivationStep } from "@/lib/activation";
import { completeMission } from "@/lib/retention";
import { useClientUserId } from "@/lib/hooks/useClientUserId";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
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
  initiallySaved?: boolean;
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
    chipBg: "bg-sky-500/95",
    chipText: "text-white",
    accent: "ring-sky-300/50",
  },
  TUTORIAL: {
    icon: BookOpen,
    chipBg: "bg-emerald-600/95",
    chipText: "text-white",
    accent: "ring-emerald-300/50",
    overlay: "code",
  },
  RECRUIT: {
    icon: Lightbulb,
    chipBg: "bg-violet-600/95",
    chipText: "text-white",
    accent: "ring-violet-400/50",
  },
  MODEL_DISCUSSION: {
    icon: Cpu,
    chipBg: "bg-gradient-to-r from-violet-600/95 to-fuchsia-600/95",
    chipText: "text-white",
    accent: "ring-fuchsia-300/50",
  },
};

const TAG_BASE = [
  "AI",
  "LLM",
  "Cursor",
  "Claude",
  "GPT",
  "Next.js",
  "React",
  "Tailwind",
  "Supabase",
  "Stripe",
  "RAG",
  "Agent",
  "Prompt",
] as const;

const TAG_LOCALE_ZH = ["出海", "增长", "运营", "投放", "私域", "小红书", "抖音"] as const; // i18n-ok match tokens for zh titles
const TAG_LOCALE_EN = [
  "growth",
  "ops",
  "marketing",
  "ads",
  "community",
  "RedNote",
  "TikTok",
] as const;

function tagDictionary(locale: string) {
  return locale === "zh"
    ? [...TAG_BASE, ...TAG_LOCALE_ZH]
    : [...TAG_BASE, ...TAG_LOCALE_EN];
}

export function FeedCard(p: FeedCardProps) {
  const router = useRouter();
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const tFeed = useTranslations("feed");
  const tPost = useTranslations("postType");

  const extractTags = useCallback(
    (text: string): string[] => {
      const hits: string[] = [];
      for (const tag of tagDictionary(locale)) {
        if (text.toLowerCase().includes(tag.toLowerCase())) hits.push(tag);
        if (hits.length >= 2) break;
      }
      return hits;
    },
    [locale],
  );
  const userId = useClientUserId();
  const { isAuthenticated, isReady, requireAuth } = useRequireAuth();
  const postHref = `/post/${p.id}`;

  const openPost = useCallback(() => {
    if (isReady && isAuthenticated) {
      router.push(postHref);
      return;
    }
    requireAuth({ next: postHref, reason: "viewPost" });
  }, [isReady, isAuthenticated, router, postHref, requireAuth]);
  const t: PostType = isPostType(p.type) ? p.type : "NOTE";
  const theme = TYPE_THEME[t];
  const [saved, setSaved] = useState(Boolean(p.initiallySaved));
  const [saveBusy, setSaveBusy] = useState(false);
  const [ripple, setRipple] = useState(false);
  const tags = useMemo(() => extractTags(`${p.title} ${p.excerpt}`), [p.title, p.excerpt, extractTags]);
  const isHot = p.likes + p.saves >= 60;
  void theme.accent;

  useEffect(() => {
    if (p.initiallySaved !== undefined) {
      setSaved(p.initiallySaved);
      return;
    }
    if (!userId) setSaved(isPostSaved(p.id));
  }, [p.id, p.initiallySaved, userId]);

  const onToggleSave = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (saveBusy) return;
      setRipple(true);
      window.setTimeout(() => setRipple(false), 450);

      if (!isReady) return;
      if (!isAuthenticated) {
        requireAuth({ next: postHref, reason: "engage" });
        return;
      }

      setSaveBusy(true);
      const wasSaved = saved;
      setSaved(!wasSaved);
      void fetch(`/api/posts/${p.id}/react`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ action: "save" }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("save failed");
            return res.json() as Promise<{ active: boolean }>;
          })
          .then((data) => {
            setSaved(data.active);
            if (data.active) {
              completeMission("save_post");
              completeActivationStep("first_save");
            }
          })
          .catch(() => {
            setSaved(wasSaved);
          })
          .finally(() => setSaveBusy(false));
    },
    [p.id, saved, saveBusy, isReady, isAuthenticated, postHref, requireAuth],
  );

  const cardBody = (
    <>
        <div className="relative aspect-[4/5] w-full bg-zinc-100">
          <Image
            src={p.coverUrl}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.05] motion-reduce:group-hover:scale-100"
            sizes="(max-width: 768px) 50vw, 200px"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/0" />

          <span
            className={clsx(
              "absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm backdrop-blur",
              theme.chipBg,
              theme.chipText,
            )}
          >
            <theme.icon className="h-3 w-3" />
            {getPostTypeLabel(tPost, t)}
          </span>

          {isHot ? (
            <span className="absolute right-12 top-2 inline-flex items-center gap-0.5 rounded-full bg-rose-500/95 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
              <Flame className="h-3 w-3" />
              {tCommon("hot")}
            </span>
          ) : null}

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
              <BookOpen className="h-2.5 w-2.5" />
              {tFeed("readMin", { minutes: 8 })}
            </span>
          ) : null}
          {theme.overlay === "code" ? (
            <span className="pointer-events-none absolute right-2 top-9 inline-flex items-center gap-0.5 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-mono text-white backdrop-blur">
              <Code2 className="h-2.5 w-2.5" /> .ts
            </span>
          ) : null}

          <span className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/95">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 text-[10px] font-bold text-white shadow ring-1 ring-white/20">
                {p.authorName.slice(0, 1)}
              </span>
              <span className="line-clamp-1 drop-shadow">{p.authorName}</span>
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-80 transition group-hover:translate-x-0.5" />
          </span>

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
    </>
  );

  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200/70 transition motion-reduce:transition-none",
        "hover:-translate-y-1 hover:shadow-[0_24px_60px_-22px_rgba(139,92,246,0.5)] hover:ring-violet-300/50 motion-reduce:hover:translate-y-0",
      )}
    >
      <button
        type="button"
        className={clsx(
          "block w-full cursor-pointer text-left",
          !isReady && "opacity-70",
        )}
        data-author={p.authorId}
        onClick={openPost}
      >
        {cardBody}
      </button>

      <button
        type="button"
        title={saved ? tCommon("unsaved") : userId ? tCommon("saved") : tCommon("loginToSave")}
        aria-label={saved ? tCommon("unsaved") : tCommon("saved")}
        aria-pressed={saved}
        disabled={saveBusy}
        onClick={onToggleSave}
        className={clsx(
          "absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-xl shadow-md ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-90 motion-reduce:active:scale-100",
          saved
            ? "bg-amber-100 text-amber-800 ring-amber-300/80"
            : "bg-white/90 text-zinc-600 ring-zinc-200/80 hover:bg-white",
          saveBusy && "opacity-60",
        )}
      >
        {ripple ? (
          <span className="pointer-events-none absolute inset-0 animate-ping rounded-xl bg-amber-400/40 motion-reduce:animate-none" />
        ) : null}
        <Bookmark
          className={clsx(
            "relative h-4 w-4 transition",
            saved && "fill-current text-amber-700 scale-110",
            ripple && "motion-safe:scale-125",
          )}
        />
      </button>
    </div>
  );
}
