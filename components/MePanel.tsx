"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  LayoutGrid,
  LogOut,
  MessageCircle,
  PenSquare,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import { MeRetentionHub } from "@/components/me/MeRetentionHub";
import { ActivationJourney } from "@/components/retention/ActivationJourney";
import { ProfileStrengthCard } from "@/components/retention/ProfileStrengthCard";
import { PublishDraftBanner } from "@/components/retention/PublishDraftBanner";
import { PageHeader } from "@/components/PageHeader";
import { performLogout } from "@/lib/authLogout";
import { LS_USER_ID, syncLocalUserId } from "@/lib/clientSession";
import { DEMO_USER_ID } from "@/lib/constants";
import type { Role } from "@/lib/domain/role";
import { ROLES, isRole } from "@/lib/domain/role";
import { ROLE_LABEL } from "@/lib/labels";

const quickLinks = [
  { href: "/workspace", label: "工作台", desc: "统计与收藏", icon: LayoutGrid },
  { href: "/creator", label: "创作者中心", desc: "我的笔记与指标", icon: BadgeCheck },
  { href: "/orders", label: "订单/心愿单", desc: "演示交易数据", icon: ShoppingBag },
  { href: "/publish", label: "发布", desc: "PostgreSQL 入库", icon: PenSquare },
  { href: "/settings/profile", label: "编辑主页", desc: "资料与技能", icon: UserRound },
  { href: "/search", label: "搜索", desc: "标题检索", icon: Search },
  { href: "/messages", label: "消息", desc: "本地会话", icon: MessageCircle },
  { href: "/match", label: "匹配", desc: "算法推荐", icon: Sparkles },
  { href: "/tools", label: "工具", desc: "导航/商城", icon: Wrench },
  { href: "/settings", label: "设置", desc: "主题/数据", icon: Settings },
  { href: "/me/achievements", label: "成就墙", desc: "徽章与分享", icon: BadgeCheck },
] as const;

export function MePanel() {
  const [userId, setUserId] = useState(DEMO_USER_ID);
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/profile?userId=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error("加载失败");
      const data = (await res.json()) as {
        user: { displayName: string };
        profile: { role: string };
      };
      setDisplayName(data.user.displayName);
      setRole(isRole(data.profile.role) ? data.profile.role : null);
    } catch {
      setMsg("无法加载用户资料，请先执行 npm run db:seed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const r = await fetch("/api/me", { credentials: "include" });
        const j = (await r.json()) as { userId: string | null };
        if (j.userId) {
          setUserId(j.userId);
          syncLocalUserId(j.userId);
          await load(j.userId);
          return;
        }
      } catch {
        // ignore
      }
      const stored =
        typeof window !== "undefined" ? localStorage.getItem(LS_USER_ID) : null;
      const id = stored || DEMO_USER_ID;
      setUserId(id);
      await load(id);
    })();
  }, [load]);

  const saveUserId = async () => {
    const id = userId.trim();
    if (!id) return;
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: id, password: "demo" }),
      });
      if (!res.ok) throw new Error("切换失败");
      syncLocalUserId(id);
      setMsg("已切换账号并同步登录会话。");
      void load(id);
    } catch {
      setMsg("切换失败：请确认该用户存在于数据库中。");
    }
  };

  return (
    <div className="space-y-4 pb-4">
      <PageHeader
        title="我的"
        subtitle="个人中心 · 快捷入口 · 任意页右上角「账户」也可退出登录。"
      />

      <ProfileStrengthCard />
      <PublishDraftBanner />
      <ActivationJourney compact />
      <MeRetentionHub />

      <section className="rounded-3xl border border-rose-200/80 bg-gradient-to-br from-rose-50/90 to-white/80 p-4 shadow-sm ring-1 ring-rose-100/80 dark:border-rose-900/50 dark:from-rose-950/40 dark:to-zinc-950/80 dark:ring-rose-900/40">
        <p className="text-xs font-semibold text-rose-900 dark:text-rose-200">账户与安全</p>
        <p className="mt-1 text-[11px] leading-relaxed text-rose-800/80 dark:text-rose-300/90">
          退出后将清除会话 Cookie 与本地当前用户 id，并回到欢迎页。与「设置」页中的退出为同一套逻辑。
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void performLogout()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-rose-700 sm:flex-none"
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </button>
          <Link
            href="/settings"
            className="inline-flex items-center justify-center rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200/80 transition hover:bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700"
          >
            打开设置（主题 / 清理数据）
          </Link>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <p className="text-xs font-semibold text-zinc-900">快捷入口</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {quickLinks.map((it) => {
            const Icon = it.icon;
            return (
              <Link
                key={it.href}
                href={it.href}
                className="rounded-2xl bg-white/70 p-3 ring-1 ring-zinc-200/70 transition hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-fuchsia-600 text-white shadow-sm">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-950">{it.label}</p>
                    <p className="truncate text-[11px] text-zinc-600">{it.desc}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <p className="text-xs font-semibold text-zinc-900">当前用户 ID（Cookie + localStorage）</p>
        <div className="mt-2 flex gap-2">
          <input
            className="flex-1 rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 font-mono text-xs outline-none"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button
            type="button"
            onClick={() => void saveUserId()}
            className="rounded-2xl bg-zinc-950 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
          >
            保存
          </button>
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-zinc-500">
          默认 <span className="font-mono">{DEMO_USER_ID}</span>
          。也可切换到 <span className="font-mono">user_seed_01</span> 等种子用户体验不同画像。
        </p>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        {loading ? (
          <p className="text-sm text-zinc-600">加载中…</p>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-950">{displayName}</p>
                <p className="mt-1 text-xs text-zinc-600">角色定位（来自资料库）</p>
              </div>
              <Link
                href="/settings/profile"
                className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold text-brand-900 ring-1 ring-brand-200/70 hover:bg-white"
              >
                编辑主页
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <span
                  key={r}
                  className={`rounded-full border px-2.5 py-1 text-[11px] ${
                    role === r
                      ? "border-brand-300 bg-brand-50 text-brand-950"
                      : "border-zinc-200/80 bg-white/70 text-zinc-600"
                  }`}
                >
                  {ROLE_LABEL[r]}
                </span>
              ))}
            </div>
          </>
        )}
        {msg ? <p className="mt-3 text-xs font-medium text-brand-900">{msg}</p> : null}
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">我的主页</h2>
            <p className="mt-1 text-xs text-zinc-600">查看笔记/项目聚合展示。</p>
          </div>
          <Link
            href={`/user/${encodeURIComponent(userId)}`}
            className="rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-2 text-xs font-semibold text-white shadow-glow"
          >
            打开
          </Link>
        </div>
      </section>
    </div>
  );
}
