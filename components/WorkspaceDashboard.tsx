"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { performLogout } from "@/lib/authLogout";
import { readSavedPostIds } from "@/lib/appHub";
import { POST_TYPE_LABEL } from "@/lib/labels";
import { isPostType } from "@/lib/domain/postType";
import { syncLessonProgressGamification } from "@/lib/gamification";

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

const shortcuts = [
  { href: "/home", label: "发现", Icon: LayoutGrid },
  { href: "/publish", label: "发布", Icon: PenSquare },
  { href: "/match", label: "匹配", Icon: Sparkles },
  { href: "/search", label: "搜索", Icon: Search },
  { href: "/messages", label: "消息", Icon: MessageCircle },
  { href: "/tools", label: "工具", Icon: Wrench },
] as const;

export function WorkspaceDashboard({ stats }: { stats: Stats }) {
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

  return (
    <div className="space-y-4 pb-4">
      <PageHeader
        title="工作台"
        subtitle="数据总览 · 本地收藏 · 全局命令面板（⌘/Ctrl+K）"
        backHref="/home"
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          {
            label: "实时",
            title: "数据面",
            sub: "Prisma",
            from: "from-violet-600",
            to: "to-indigo-600",
          },
          {
            label: "本地",
            title: "收藏",
            sub: "Indexed",
            from: "from-fuchsia-600",
            to: "to-pink-600",
          },
          {
            label: "导航",
            title: "命令",
            sub: "⌘K",
            from: "from-sky-500",
            to: "to-cyan-600",
          },
          {
            label: "生态",
            title: "工具+商",
            sub: "SKU",
            from: "from-amber-500",
            to: "to-orange-600",
          },
        ].map((b) => (
          <div
            key={b.title}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${b.from} ${b.to} p-[1px] shadow-lg`}
          >
            <div className="h-full rounded-[15px] bg-zinc-950/90 px-3 py-3 text-white ring-1 ring-white/10 backdrop-blur-sm">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">{b.label}</p>
              <p className="mt-1 text-sm font-black">{b.title}</p>
              <p className="text-[10px] text-white/60">{b.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
          <LineChart className="h-4 w-4 text-brand-600" />
          演示库实时统计
        </div>
        <p className="mt-1 text-[11px] text-zinc-500">
          以下为 PostgreSQL 内真实计数，可用于路演/答辩展示「有后端、有数据」。
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            { label: "笔记", value: stats.posts },
            { label: "用户画像", value: stats.users },
            { label: "工具条目", value: stats.tools },
            { label: "商城 SKU", value: stats.market },
            { label: "项目卡片", value: stats.projects },
            { label: "活跃指数(估)", value: totalEngagement },
          ].map((c) => (
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
        <p className="text-xs font-semibold text-zinc-900">快捷入口</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {shortcuts.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-3 text-xs font-semibold text-zinc-900 ring-1 ring-zinc-200/70 transition hover:bg-white hover:shadow-sm"
            >
              <Icon className="h-4 w-4 text-brand-600" />
              {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("vibe-open-command-palette"))}
            className="flex items-center gap-2 rounded-2xl bg-zinc-950 px-3 py-3 text-xs font-semibold text-white transition hover:bg-zinc-800"
          >
            <Command className="h-4 w-4" />
            命令面板
          </button>
        </div>
      </section>

      <section
        id="bookmarks"
        className="glass-panel scroll-mt-4 rounded-3xl p-4 shadow-soft ring-1 ring-white/70"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
          <Bookmark className="h-4 w-4 text-amber-600" />
          我的收藏（本地）
        </div>
        <p className="mt-1 text-[11px] text-zinc-500">
          收藏保存在本机浏览器，清除站点数据会丢失；可从发现页卡片右上角星标添加。
        </p>
        {savedPosts.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-zinc-50 px-3 py-4 text-center text-xs text-zinc-600">
            暂无收藏。去{" "}
            <Link href="/home" className="font-semibold text-brand-800 underline">
              发现
            </Link>{" "}
            点亮书签。
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {savedPosts.map((p) => {
              const label = isPostType(p.type) ? POST_TYPE_LABEL[p.type] : p.type;
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

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70 dark:ring-zinc-800/80">
        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">会话</p>
        <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
          换设备或演示结束时请退出，避免他人继续使用你的本地会话。
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/settings"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-xs font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700 sm:flex-none"
          >
            <Settings className="h-4 w-4" />
            设置
          </Link>
          <button
            type="button"
            onClick={() => void performLogout()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-3 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-rose-700 sm:flex-none"
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </button>
        </div>
      </section>
    </div>
  );
}
