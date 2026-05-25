"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, Trophy } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  getAllBadges,
  getUnlockedBadges,
  type BadgeDef,
} from "@/lib/gamification";
import { readCheckIn } from "@/lib/retention";

export function AchievementsView() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [unlocked, setUnlocked] = useState<BadgeDef[]>([]);
  const [streak, setStreak] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => {
      setUnlocked(getUnlockedBadges());
      setStreak(readCheckIn().streak);
    };
    refresh();
    window.addEventListener("vibe-badges-updated", refresh);
    window.addEventListener("vibe-checkin-updated", refresh);
    return () => {
      window.removeEventListener("vibe-badges-updated", refresh);
      window.removeEventListener("vibe-checkin-updated", refresh);
    };
  }, []);

  const unlockedIds = new Set(unlocked.map((b) => b.id));
  const nextLocked = getAllBadges().find((b) => !unlockedIds.has(b.id));

  const share = async () => {
    const text = `我在 VibeHub 已解锁 ${unlocked.length} 枚成就，连续签到 ${streak} 天。一起来找创业伙伴吧！`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "VibeHub 成就", text });
        setToast("已唤起分享");
      } else {
        await navigator.clipboard.writeText(text);
        setToast("成就文案已复制到剪贴板");
      }
    } catch {
      setToast("分享已取消");
    }
    window.setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="space-y-4 pb-10">
      <PageHeader title="成就墙" backHref="/me" />

      <div
        ref={cardRef}
        className="glass-panel overflow-hidden rounded-3xl p-4 shadow-soft ring-1 ring-white/70"
      >
        <div className="rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500 p-4 text-white">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
            <Trophy className="h-4 w-4" />
            VibeHub 成长卡
          </p>
          <p className="mt-2 text-3xl font-black tabular-nums">{unlocked.length}</p>
          <p className="text-sm text-white/90">已解锁成就</p>
          <p className="mt-3 text-[11px] text-white/75">
            连续签到 {streak} 天 · {new Date().toLocaleDateString("zh-CN")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void share()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 py-3 text-sm font-semibold text-white"
        >
          <Share2 className="h-4 w-4" />
          分享成就（演示）
        </button>
        {toast ? <p className="mt-2 text-center text-xs text-emerald-700">{toast}</p> : null}
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-900">全部徽章</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {getAllBadges().map((b) => {
            const on = unlockedIds.has(b.id);
            return (
              <div
                key={b.id}
                className={
                  on
                    ? "rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 p-3 ring-1 ring-violet-200/60"
                    : "rounded-2xl bg-zinc-50 p-3 opacity-60 ring-1 ring-zinc-200/70 grayscale"
                }
              >
                <span className="text-2xl">{b.emoji}</span>
                <p className="mt-1 text-xs font-semibold text-zinc-900">{b.label}</p>
                <p className="mt-0.5 text-[10px] leading-snug text-zinc-600">{b.desc}</p>
                {!on ? (
                  <p className="mt-1 text-[9px] font-semibold uppercase text-zinc-500">
                    未解锁
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {nextLocked ? (
        <p className="rounded-2xl bg-zinc-50 px-3 py-2 text-[11px] text-zinc-600 ring-1 ring-zinc-200/70">
          下一枚待解锁：{nextLocked.emoji} {nextLocked.label} — {nextLocked.desc}
        </p>
      ) : (
        <p className="rounded-2xl bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-200/60">
          已解锁全部演示徽章
        </p>
      )}
    </div>
  );
}
