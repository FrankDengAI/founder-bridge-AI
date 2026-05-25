"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { DEMO_USER_ID } from "@/lib/constants";
import { performLogout } from "@/lib/authLogout";
import { syncLocalUserId } from "@/lib/clientSession";
import { countEventsToday } from "@/lib/retention";

const PERSONAS = [
  { id: DEMO_USER_ID, label: "演示用户 · ADC" },
  { id: "user_seed_01", label: "创业者 1 · 打野" },
  { id: "user_seed_02", label: "创业者 2 · 辅助" },
  { id: "user_seed_03", label: "创业者 3 · 射手" },
  { id: "user_seed_04", label: "创业者 4" },
  { id: "user_seed_05", label: "创业者 5" },
] as const;

export default function AdminDemoPage() {
  const [msg, setMsg] = useState<string | null>(null);
  const [stats, setStats] = useState({ opens: 0, matches: 0 });

  const switchUser = async (userId: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId, password: "demo" }),
    });
    if (!res.ok) {
      setMsg("切换失败");
      return;
    }
    syncLocalUserId(userId);
    setMsg(`已切换为 ${userId}`);
    setStats({
      opens: countEventsToday(),
      matches: countEventsToday("match_run"),
    });
  };

  return (
    <div className="space-y-4 pb-10">
      <PageHeader
        title="运营演示台"
        subtitle="人设快捷切换 · 本地事件统计（Demo）"
        backHref="/workspace"
      />

      <section className="glass-panel space-y-2 rounded-3xl p-4 ring-1 ring-white/70">
        <p className="text-xs font-semibold text-zinc-900">一键切换人设</p>
        <div className="flex flex-wrap gap-2">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => void switchUser(p.id)}
              className="rounded-xl bg-violet-50 px-3 py-2 text-[11px] font-semibold text-violet-900 ring-1 ring-violet-200/70 hover:bg-violet-100"
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 ring-1 ring-white/70">
        <p className="text-xs font-semibold text-zinc-900">今日本地事件（浏览器）</p>
        <p className="mt-2 text-sm text-zinc-700">
          打开次数 {stats.opens} · 匹配 {stats.matches}
        </p>
        <button
          type="button"
          className="mt-3 text-[11px] font-semibold text-violet-800 hover:underline"
          onClick={() =>
            setStats({
              opens: countEventsToday(),
              matches: countEventsToday("match_run"),
            })
          }
        >
          刷新统计
        </button>
      </section>

      <div className="flex flex-wrap gap-2 text-xs">
        <Link href="/home" className="font-semibold text-brand-800 hover:underline">
          发现
        </Link>
        <Link href="/templates" className="font-semibold text-brand-800 hover:underline">
          模板市场
        </Link>
        <button
          type="button"
          onClick={() => void performLogout()}
          className="font-semibold text-rose-700 hover:underline"
        >
          退出登录
        </button>
      </div>

      {msg ? <p className="text-xs text-emerald-700">{msg}</p> : null}
    </div>
  );
}
