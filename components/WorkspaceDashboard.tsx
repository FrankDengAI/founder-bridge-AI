"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  Bookmark,
  Command,
  LayoutGrid,
  LineChart,
  LogOut,
  MessageCircle,
  PenSquare,
  Search,
  Settings,
  Sparkles,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { LearnProgressCard } from "@/components/learn/LearnProgressCard";
import { performLogout } from "@/lib/authLogout";
import { readSavedPostIds } from "@/lib/appHub";
import { getPostTypeLabel } from "@/lib/labels";
import { isPostType } from "@/lib/domain/postType";
import { syncLessonProgressGamification } from "@/lib/gamification";
import { useIsWebMode } from "@/lib/hooks/useIsWebMode";
import clsx from "clsx";

type Stats = {
  posts: number;
  users: number;
  tools: number;
  market: number;
  projects: number;
};

type PostHit = {
  id: string;
  type: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  author: { id: string; displayName: string };
};

const shortcutKeys = [
  { href: "/home", navKey: "home", Icon: LayoutGrid },
  { href: "/publish", navKey: "publish", Icon: PenSquare },
  { href: "/match", navKey: "match", Icon: Sparkles },
  { href: "/search", navKey: "search", Icon: Search },
  { href: "/messages", navKey: "messages", Icon: MessageCircle },
  { href: "/tools", navKey: "tools", Icon: Wrench },
] as const;

export function WorkspaceDashboard({ stats }: { stats: Stats }) {
  const isWeb = useIsWebMode();
  const t = useTranslations("pages.workspace");
  const tNav = useTranslations("nav");
  const tPost = useTranslations("postType");
  const tCommon = useTranslations("common");
  const tRail = useTranslations("rail");
  const [savedPosts, setSavedPosts] = useState<PostHit[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.location.hash === "#bookmarks" ? "bookmarks" : "";
    if (id) {
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      const ids = readSavedPostIds();
      if (!ids.length) {
        setSavedPosts([]);
        return;
      }
      try {
        const u = new URL("/api/posts", window.location.origin);
        u.searchParams.set("ids", ids.join(","));
        const res = await fetch(u.toString());
        const data = (await res.json()) as { posts: PostHit[] };
        setSavedPosts(data.posts ?? []);
      } catch {
        setSavedPosts([]);
      }
    })();
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/learn/progress");
        const data = (await res.json()) as { steps: number[]; anonymous?: boolean };
        if (!data.anonymous && Array.isArray(data.steps)) {
          syncLessonProgressGamification(data.steps.length);
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const totalEngagement = useMemo(
    () => stats.posts + stats.projects + stats.market,
    [stats],
  );

  const statCards = useMemo(
    () => [
      { label: t("community"), title: t("liveStats"), sub: t("liveUpdate"), from: "from-violet-600", to: "to-indigo-600" },
      { label: t("mine"), title: t("bookmarks"), sub: t("reviewAnytime"), from: "from-fuchsia-600", to: "to-pink-600" },
      { label: t("productivity"), title: t("commandPalette"), sub: t("oneClick"), from: "from-sky-500", to: "to-cyan-600" },
      { label: t("resources"), title: t("toolMarket"), sub: t("curated"), from: "from-amber-500", to: "to-orange-600" },
    ],
    [t],
  );

  const statItems = useMemo(
    () => [
      { label: t("statPosts"), value: stats.posts },
      { label: t("statUsers"), value: stats.users },
      { label: t("statTools"), value: stats.tools },
      { label: t("statMarket"), value: stats.market },
      { label: t("statProjects"), value: stats.projects },
      { label: t("statActivity"), value: totalEngagement },
    ],
    [t, stats, totalEngagement],
  );

  return (
    <div className="space-y-4 pb-4">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <LearnProgressCard variant="full" />

      <div
        className={clsx(
          "grid gap-3",
          isWeb ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 gap-2 sm:grid-cols-4",
        )}
      >
        {statCards.map((b) => (
          <div
            key={b.title}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${b.from} ${b.to} p-[1px] shadow-lg`}
          >
            <div className="h-full rounded-[15px] bg-white/95 px-3 py-3 text-zinc-900 ring-1 ring-violet-100 backdrop-blur-sm">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-violet-600/80">{b.label}</p>
              <p className="mt-1 text-sm font-black">{b.title}</p>
              <p className="text-[10px] text-zinc-500">{b.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
          <LineChart className="h-4 w-4 text-brand-600" />
          {t("snapshotTitle")}
        </div>
        <p className="mt-1 text-[11px] text-zinc-500">
          {t("snapshotDesc")}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {statItems.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl bg-gradient-to-br from-white to-zinc-50/80 px-3 py-3 ring-1 ring-zinc-200/70"
            >
              <p className="text-2xl font-bold tabular-nums text-zinc-900">{c.value}</p>
              <p className="text-[11px] font-medium text-zinc-500">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <p className="text-xs font-semibold text-zinc-900">{tRail("quickActions.title")}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {shortcutKeys.map(({ href, navKey, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-3 text-xs font-semibold text-zinc-900 ring-1 ring-zinc-200/70 transition hover:bg-white hover:shadow-sm"
            >
              <Icon className="h-4 w-4 text-brand-600" />
              {tNav(navKey)}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("vibe-open-command-palette"))}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-3 text-xs font-semibold text-white transition hover:opacity-95"
          >
            <Command className="h-4 w-4" />
            {tCommon("commandPalette")}
          </button>
        </div>
      </section>

      <section
        id="bookmarks"
        className="glass-panel scroll-mt-4 rounded-3xl p-4 shadow-soft ring-1 ring-white/70"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
          <Bookmark className="h-4 w-4 text-amber-600" />
          {t("savedLocal")}
        </div>
        <p className="mt-1 text-[11px] text-zinc-500">
          {t("savedDesc")}
        </p>
        {savedPosts.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-zinc-50 px-3 py-4 text-center text-xs text-zinc-600">
            {t("noSaved")}
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {savedPosts.map((p) => {
              const label = isPostType(p.type) ? getPostTypeLabel(tPost, p.type) : p.type;
              return (
                <li key={p.id}>
                  <Link
                    href={`/post/${p.id}`}
                    className="flex gap-3 rounded-2xl border border-zinc-200/70 bg-white/80 p-2.5 transition hover:bg-white hover:shadow-sm"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                      <Image
                        src={p.coverUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-900 ring-1 ring-amber-200/70">
                        {label}
                      </span>
                      <p className="mt-1 line-clamp-2 text-sm font-semibold text-zinc-900">{p.title}</p>
                      <p className="text-[11px] text-zinc-500">{p.author.displayName}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <p className="text-xs font-semibold text-zinc-900">{t("session")}</p>
        <p className="mt-1 text-[11px] text-zinc-600">
          {t("sessionDesc")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/settings"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-xs font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50 sm:flex-none"
          >
            <Settings className="h-4 w-4" />
            {tNav("settings")}
          </Link>
          <button
            type="button"
            onClick={() => void performLogout()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-3 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-rose-700 sm:flex-none"
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </div>
      </section>
    </div>
  );
}
