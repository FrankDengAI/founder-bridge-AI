"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Brush, Database, Keyboard, LogOut, Moon, Sun } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  LS_LEARN_STEPS,
  LS_RECENT_ROUTES,
  LS_SAVED_POSTS,
} from "@/lib/appHub";
import { clearRetentionLocalData } from "@/lib/retention";
import { performLogout } from "@/lib/authLogout";
import clsx from "clsx";

const LS_NOTIFS = "vibe_notifs_v1";
const LS_GAMIFY = "vibe_gamify_events";

export default function SettingsPage() {
  const [dark, setDark] = useState(false);
  const [notify, setNotify] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const d = localStorage.getItem("vibe_theme") === "dark";
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
    setNotify(localStorage.getItem("vibe_notify") !== "0");
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("vibe_theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    setToast(next ? "已开启深色（演示：仅影响部分对比度）" : "已关闭深色");
    window.setTimeout(() => setToast(null), 1600);
  };

  const toggleNotify = () => {
    const next = !notify;
    setNotify(next);
    localStorage.setItem("vibe_notify", next ? "1" : "0");
    setToast(next ? "已开启通知（演示）" : "已关闭通知（演示）");
    window.setTimeout(() => setToast(null), 1600);
  };

  const clearDemo = () => {
    localStorage.removeItem("vibe_github_demo_connected");
    sessionStorage.removeItem("vibe_dismissed_reply_banners");
    localStorage.removeItem(LS_RECENT_ROUTES);
    localStorage.removeItem(LS_SAVED_POSTS);
    localStorage.removeItem(LS_LEARN_STEPS);
    localStorage.removeItem(LS_NOTIFS);
    localStorage.removeItem(LS_GAMIFY);
    localStorage.removeItem("vibe_visit_counts");
    localStorage.removeItem("vibe_activation");
    localStorage.removeItem("vibe_demo_retention_done");
    clearRetentionLocalData();
    setToast("已清理演示本地数据（含留存/签到/激活/会话横幅）");
    window.setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="space-y-3 pb-6">
      <PageHeader
        title="设置"
        subtitle="会话 Cookie、演示项与本地数据。右上角账户菜单也可退出登录。"
        backHref="/me"
      />

      {toast ? (
        <div className="rounded-2xl bg-zinc-950 px-4 py-2 text-center text-xs text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-zinc-950">退出登录</p>
            <p className="mt-1 text-xs text-zinc-600">清除会话 Cookie，并返回欢迎页重新登录。</p>
          </div>
          <button
            type="button"
            onClick={() => void performLogout()}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-zinc-950 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
          >
            <LogOut className="h-4 w-4" />
            退出
          </button>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950">
          <Keyboard className="h-4 w-4 text-brand-700" />
          快捷键
        </div>
        <ul className="mt-3 space-y-2 text-xs text-zinc-700">
          <li className="flex items-center justify-between gap-2 rounded-xl bg-white/60 px-3 py-2 ring-1 ring-zinc-200/60">
            <span>全局命令面板</span>
            <kbd className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[10px]">⌘/Ctrl + K</kbd>
          </li>
          <li className="flex items-center justify-between gap-2 rounded-xl bg-white/60 px-3 py-2 ring-1 ring-zinc-200/60">
            <span>发现页也可点工具栏命令图标</span>
            <span className="text-[10px] text-zinc-500">任意页可用</span>
          </li>
        </ul>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-zinc-950">外观</p>
            <p className="text-xs text-zinc-600">切换深色（轻量演示）。</p>
          </div>
          <button
            type="button"
            onClick={toggleDark}
            className={clsx(
              "inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold ring-1",
              dark
                ? "bg-zinc-950 text-white ring-zinc-800"
                : "bg-white text-zinc-900 ring-zinc-200/80",
            )}
          >
            {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {dark ? "深色" : "浅色"}
          </button>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-zinc-950">通知</p>
            <p className="text-xs text-zinc-600">演示开关：不影响服务端。</p>
          </div>
          <button
            type="button"
            onClick={toggleNotify}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-zinc-900 ring-1 ring-zinc-200/80"
          >
            <Bell className="h-4 w-4" />
            {notify ? "开启" : "关闭"}
          </button>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-zinc-950">数据</p>
            <p className="text-xs text-zinc-600">清理浏览器内的演示会话与聊天。</p>
          </div>
          <button
            type="button"
            onClick={clearDemo}
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
          >
            <Database className="h-4 w-4" />
            清理
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-rose-200/70 bg-rose-50/50 p-4 shadow-sm ring-1 ring-rose-100/80 dark:border-rose-900/40 dark:bg-rose-950/20 dark:ring-rose-900/30">
        <p className="text-sm font-bold text-rose-900 dark:text-rose-100">再次退出登录</p>
        <p className="mt-1 text-xs text-rose-800/90 dark:text-rose-200/80">
          若你已滑到页面底部，可在此再次触发退出，行为与顶部按钮一致。
        </p>
        <button
          type="button"
          onClick={() => void performLogout()}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3 text-sm font-bold text-white shadow-md transition hover:bg-rose-700"
        >
          <LogOut className="h-4 w-4" />
          退出登录并返回欢迎页
        </button>
      </section>

      <div className="glass-panel rounded-3xl p-4 text-xs leading-relaxed text-zinc-700 shadow-sm ring-1 ring-white/70">
        <div className="flex items-center gap-2 font-semibold text-zinc-950">
          <Brush className="h-4 w-4 text-brand-700" />
          下一步可扩展
        </div>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>账号体系：手机号 / 邮箱 / OAuth</li>
          <li>推送：WebPush / App 内通知中心</li>
          <li>隐私：导出数据、注销账号</li>
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/learn/github" className="text-brand-800 hover:underline">
            GitHub 接入清单
          </Link>
          <span className="text-zinc-300">·</span>
          <Link href="/messages" className="text-brand-800 hover:underline">
            返回消息
          </Link>
        </div>
      </div>
    </div>
  );
}
