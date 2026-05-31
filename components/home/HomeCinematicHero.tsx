"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Cpu, Flame, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { getUnlockedBadges } from "@/lib/gamification";
import { useViewModeOptional } from "@/components/view-mode/ViewModeProvider";

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
  const t = useTranslations("homeUi.hero");
  const tNav = useTranslations("nav");
  const isWeb = useViewModeOptional()?.isWeb ?? false;
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
      { key: "posts" as const, value: p, accent: "from-violet-500 to-fuchsia-500" },
      { key: "users" as const, value: u, accent: "from-fuchsia-500 to-rose-500" },
      { key: "models" as const, value: m, accent: "from-indigo-500 to-violet-500" },
      { key: "reviews" as const, value: rv, accent: "from-amber-500 to-orange-500" },
    ],
    [p, u, m, rv],
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        "relative overflow-hidden rounded-3xl p-[1px] shadow-[0_20px_60px_-28px_rgba(109,40,217,0.55)]",
        isWeb && "web-section shadow-[0_28px_80px_-32px_rgba(109,40,217,0.45)]",
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/35 via-fuchsia-500/30 to-cyan-500/35 bg-[length:200%_200%] motion-safe:animate-gradient-x" />
      <div
        className={clsx(
          "relative overflow-hidden rounded-[22px] bg-white/95 ring-1 ring-violet-200/50",
          isWeb ? "px-6 py-8 sm:px-8 sm:py-10" : "px-4 py-5",
        )}
      >
        <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-700 ring-1 ring-violet-200/70">
              <Sparkles className="h-3 w-3 text-amber-500" />
              {isWeb ? t("badgeWeb") : t("badgeApp")}
            </p>
            <h2
              className={clsx(
                "mt-2 font-black leading-tight tracking-tight text-zinc-900",
                isWeb ? "text-3xl sm:text-4xl xl:text-5xl" : "text-2xl sm:text-3xl",
              )}
            >
              <span className="text-holo">VibeCoding</span>
              <span className="text-zinc-800"> {t("titleSuffix")}</span>
            </h2>
            <p
              className={clsx(
                "mt-2 leading-relaxed text-zinc-600",
                isWeb ? "max-w-2xl text-sm sm:text-base" : "max-w-[20rem] text-xs",
              )}
            >
              {isWeb ? t("descWeb") : t("descApp")}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href="/models"
              className="inline-flex items-center gap-1 rounded-2xl bg-violet-50 px-3 py-2 text-[11px] font-bold text-violet-900 ring-1 ring-violet-200/70 transition hover:bg-violet-100"
            >
              <Cpu className="h-3.5 w-3.5 text-cyan-300" />
              {t("modelRank")}
            </Link>
            <Link
              href="/workspace"
              className="inline-flex items-center gap-1 rounded-2xl bg-violet-50 px-3 py-2 text-[11px] font-bold text-violet-900 ring-1 ring-violet-200/70 transition hover:bg-violet-100"
            >
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              {tNav("workspace")}
            </Link>
            <Link
              href="/match"
              className="inline-flex items-center gap-1 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 px-3 py-2 text-[11px] font-bold text-white shadow-lg shadow-fuchsia-500/30 transition hover:brightness-110"
            >
              <Flame className="h-3.5 w-3.5" />
              {tNav("match")}
            </Link>
          </div>
        </div>

        <div
          className={clsx(
            "relative mt-5 grid gap-2",
            isWeb ? "grid-cols-2 sm:grid-cols-4 lg:grid-cols-4" : "grid-cols-2 sm:grid-cols-4",
          )}
        >
          {chips.map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={clsx(
                "rounded-2xl bg-violet-50/80 ring-1 ring-violet-200/50 transition duration-300 hover:-translate-y-0.5 hover:ring-violet-400/50 hover:shadow-md",
                isWeb ? "p-4" : "p-3",
              )}
            >
              <p
                className={clsx(
                  `bg-gradient-to-r ${c.accent} bg-clip-text font-black tabular-nums text-transparent`,
                  isWeb ? "text-3xl xl:text-4xl" : "text-2xl",
                )}
              >
                {c.value}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {t(`chips.${c.key}`)}
              </p>
            </motion.div>
          ))}
        </div>

        {badges.length ? (
          <div className="relative mt-4 flex flex-wrap gap-1.5 border-t border-violet-200/50 pt-4">
            <span className="w-full text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {t("unlockedBadges")}
            </span>
            {badges.map((b) => (
              <span
                key={b.id}
                title={b.desc}
                className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-900 ring-1 ring-violet-200/60"
              >
                <span>{b.emoji}</span>
                {b.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </motion.section>
  );
}
