"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Cpu, Flame, Sparkles, Zap } from "lucide-react";
import { getUnlockedBadges } from "@/lib/gamification";

type Stats = {
  posts: number;
  users: number;
  tools: number;
  projects: number;
  models?: number;
  reviews?: number;
};

function useAnimatedInt(target: number, active: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const dur = 900;
    const t0 = 0;
    let id = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - (1 - p) ** 3;
      setV(Math.round(t0 + (target - t0) * eased));
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [target, active]);
  return v;
}

export function HomeCinematicHero({ stats }: { stats: Stats }) {
  const [mounted, setMounted] = useState(false);
  const [badges, setBadges] = useState<ReturnType<typeof getUnlockedBadges>>([]);

  useEffect(() => {
    setMounted(true);
    setBadges(getUnlockedBadges());
    const on = () => setBadges(getUnlockedBadges());
    window.addEventListener("vibe-badges-updated", on);
    return () => window.removeEventListener("vibe-badges-updated", on);
  }, []);

  const p = useAnimatedInt(stats.posts, mounted);
  const u = useAnimatedInt(stats.users, mounted);
  const m = useAnimatedInt(stats.models ?? 0, mounted);
  const rv = useAnimatedInt(stats.reviews ?? 0, mounted);

  const chips = useMemo(
    () => [
      { label: "笔记", value: p, accent: "from-violet-500 to-fuchsia-500" },
      { label: "用户", value: u, accent: "from-fuchsia-500 to-rose-500" },
      { label: "模型", value: m, accent: "from-indigo-500 to-violet-500" },
      { label: "短评", value: rv, accent: "from-amber-500 to-orange-500" },
    ],
    [p, u, m, rv],
  );

  return (
    <section className="relative overflow-hidden rounded-3xl p-[1px] shadow-[0_20px_60px_-28px_rgba(109,40,217,0.55)]">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/35 via-fuchsia-500/30 to-cyan-500/35 bg-[length:200%_200%] motion-safe:animate-gradient-x" />
      <div className="relative overflow-hidden rounded-[22px] bg-zinc-950/90 px-4 py-5 ring-1 ring-white/10">
        <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full bg-fuchsia-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200/90 ring-1 ring-white/15">
              <Sparkles className="h-3 w-3 text-amber-300" />
              Live Feed
            </p>
            <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
              <span className="text-holo">VibeCoding</span>
              <span className="text-white/90"> 灵感宇宙</span>
            </h2>
            <p className="mt-2 max-w-[20rem] text-xs leading-relaxed text-zinc-400">
              没匹配到伙伴也没关系：先看笔记、给大模型打分、参与讨论，把社区热度做起来。
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href="/models"
              className="inline-flex items-center gap-1 rounded-2xl bg-white/10 px-3 py-2 text-[11px] font-bold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
            >
              <Cpu className="h-3.5 w-3.5 text-cyan-300" />
              模型榜
            </Link>
            <Link
              href="/workspace"
              className="inline-flex items-center gap-1 rounded-2xl bg-white/10 px-3 py-2 text-[11px] font-bold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
            >
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              工作台
            </Link>
            <Link
              href="/match"
              className="inline-flex items-center gap-1 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 px-3 py-2 text-[11px] font-bold text-white shadow-lg shadow-fuchsia-500/30 transition hover:brightness-110"
            >
              <Flame className="h-3.5 w-3.5" />
              匹配
            </Link>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {chips.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur-md transition hover:ring-violet-400/40"
            >
              <p
                className={`bg-gradient-to-r ${c.accent} bg-clip-text text-2xl font-black tabular-nums text-transparent`}
              >
                {c.value}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {c.label}
              </p>
            </div>
          ))}
        </div>

        {badges.length ? (
          <div className="relative mt-4 flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
            <span className="w-full text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              已解锁成就
            </span>
            {badges.map((b) => (
              <span
                key={b.id}
                title={b.desc}
                className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/15"
              >
                <span>{b.emoji}</span>
                {b.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
