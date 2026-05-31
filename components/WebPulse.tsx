"use client";

import { motion } from "framer-motion";
import { Activity, ArrowDownRight, ArrowUpRight, Clock, Flame } from "lucide-react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

const bars = [40, 72, 55, 88, 48, 92, 64, 78, 52, 95, 58, 84] as const;

const linePoints = [
  [0, 60],
  [40, 48],
  [80, 56],
  [120, 38],
  [160, 44],
  [200, 28],
  [240, 32],
  [280, 18],
  [320, 22],
  [360, 10],
] as const;

const EVENT_DEFS = [
  { id: "e1", time: "12s", badge: "match", color: "violet" },
  { id: "e2", time: "47s", badge: "post", color: "fuchsia" },
  { id: "e3", time: "1m", badge: "tool", color: "lime" },
  { id: "e4", time: "2m", badge: "save", color: "cyan" },
  { id: "e5", time: "3m", badge: "match", color: "rose" },
] as const;

const RING_DEFS = [
  { value: 86, key: "matchRate", color: "#a78bfa" },
  { value: 72, key: "retention", color: "#f472b6" },
  { value: 94, key: "rating", color: "#22d3ee" },
  { value: 68, key: "gmv", color: "#bef264" },
] as const;

const badgeColor: Record<string, string> = {
  violet: "border-violet-200 bg-violet-50 text-violet-800",
  fuchsia: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800",
  lime: "border-lime-200 bg-lime-50 text-lime-800",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-800",
  rose: "border-rose-200 bg-rose-50 text-rose-800",
};

function MiniRing({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth="6" />
          <motion.circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: off }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-lg font-bold text-zinc-900 num-tab">
            {value}
          </span>
          <span className="text-[8px] uppercase tracking-wider text-zinc-500">%</span>
        </div>
      </div>
      <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
        {label}
      </p>
    </div>
  );
}

export function WebPulse() {
  const t = useTranslations("marketingSite.pulse");

  const events = useMemo(
    () =>
      EVENT_DEFS.map((e) => ({
        ...e,
        text: t(`events.${e.id}`),
        badgeLabel: t(`badges.${e.badge}`),
      })),
    [t],
  );

  return (
    <section
      id="pulse"
      className="marketing-section relative overflow-hidden py-24 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-600/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="chip mb-3">
              <Activity className="h-3 w-3 text-emerald-600" />
              {t("chip")}
            </p>
            <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-[2.6rem]">
              <span className="text-gradient-anim">{t("title")}</span>
            </h2>
            <p className="mt-3 max-w-lg text-zinc-600">{t("desc")}</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="pulse-dot text-emerald-400" />
              {t("streaming")}
            </span>
            <span>{t("mockDisclaimer")}</span>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-v2-strong rounded-3xl p-6 sm:p-7 lg:col-span-2"
          >
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-zinc-200/80 pb-6">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  {t("heatLabel")}
                </p>
                <p className="mt-1 font-display text-[2.8rem] font-bold leading-none text-gradient num-tab">
                  +128%
                </p>
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {t("heatDelta")}
                </p>
              </div>
              <div className="text-right text-sm text-zinc-600">
                <p className="flex items-center justify-end gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {t("windowLabel")}
                </p>
                <p className="mt-1 font-mono text-xs text-zinc-500">UTC+8</p>
              </div>
            </div>

            <div className="relative mt-8 h-48 sm:h-56">
              <div className="absolute inset-0 flex items-end justify-between gap-1 sm:gap-1.5">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="origin-bottom flex-1 animate-pulsebar rounded-t-md bg-gradient-to-t from-violet-600/70 via-fuchsia-500/55 to-cyan-400/35"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 0.07}s`,
                    }}
                  />
                ))}
              </div>
              <svg
                viewBox="0 0 360 100"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full"
              >
                <defs>
                  <linearGradient id="trend-line" x1="0" x2="1">
                    <stop offset="0" stopColor="#a78bfa" />
                    <stop offset="0.5" stopColor="#f472b6" />
                    <stop offset="1" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <motion.polyline
                  points={linePoints.map(([x, y]) => `${x},${y}`).join(" ")}
                  fill="none"
                  stroke="url(#trend-line)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />
                {linePoints.map(([x, y], i) => (
                  <motion.circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="2.2"
                    fill="#7c3aed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 + i * 0.05 }}
                  />
                ))}
              </svg>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-3 border-t border-zinc-200/80 pt-6">
              {RING_DEFS.map((ring) => (
                <MiniRing
                  key={ring.key}
                  value={ring.value}
                  label={t(`rings.${ring.key}`)}
                  color={ring.color}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-v2-strong overflow-hidden rounded-3xl p-6 sm:p-7"
          >
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-rose-600" />
                <p className="text-sm font-bold text-zinc-900">{t("eventStream")}</p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                {t("eventWindow")}
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {events.map((e, i) => (
                <motion.li
                  key={e.id}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-start gap-2.5 text-[12px] leading-relaxed text-zinc-700"
                >
                  <span className="mt-1 w-8 shrink-0 font-mono text-[10px] text-zinc-500">
                    {e.time}
                  </span>
                  <span
                    className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[9px] font-mono uppercase ${
                      badgeColor[e.color]
                    }`}
                  >
                    {e.badgeLabel}
                  </span>
                  <span className="min-w-0 flex-1">{e.text}</span>
                </motion.li>
              ))}
            </ul>
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-zinc-50 px-3 py-2.5">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                  {t("onlineLabel")}
                </p>
                <p className="font-display text-lg font-bold text-zinc-900 num-tab">
                  2,418
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-rose-600">
                <ArrowDownRight className="h-3 w-3 rotate-180" />
                +7.2%
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
