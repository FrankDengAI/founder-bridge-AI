"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Briefcase,
  Compass,
  Heart,
  MapPin,
  Radar,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

const DIMENSION_DEFS = [
  { key: "role", icon: Briefcase, value: 0.92 },
  { key: "keywords", icon: Brain, value: 0.84 },
  { key: "direction", icon: Compass, value: 0.88 },
  { key: "interest", icon: Sparkles, value: 0.79 },
  { key: "budget", icon: Wallet, value: 0.82 },
  { key: "location", icon: MapPin, value: 0.7 },
  { key: "activity", icon: Heart, value: 0.95 },
] as const;

type Dimension = {
  key: string;
  icon: typeof Briefcase;
  label: string;
  value: number;
  hint: string;
};

/** SVG 雷达图 */
function RadarChart({ dimensions }: { dimensions: Dimension[] }) {
  const cx = 200;
  const cy = 200;
  const max = 180;
  const angleStep = (Math.PI * 2) / dimensions.length;

  const points = dimensions
    .map((d, i) => {
      const a = -Math.PI / 2 + i * angleStep;
      const r = d.value * max;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    })
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  return (
    <svg viewBox="0 0 400 400" className="h-full w-full">
      <defs>
        <radialGradient id="radar-fill" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(167,139,250,0.5)" />
          <stop offset="100%" stopColor="rgba(236,72,153,0.18)" />
        </radialGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((r, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={max * r}
          fill="none"
          stroke="rgba(15,23,42,0.08)"
          strokeWidth="1"
        />
      ))}
      {dimensions.map((_, i) => {
        const a = -Math.PI / 2 + i * angleStep;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * max}
            y2={cy + Math.sin(a) * max}
            stroke="rgba(15,23,42,0.08)"
          />
        );
      })}
      <motion.polygon
        points={points}
        fill="url(#radar-fill)"
        stroke="rgba(167,139,250,0.85)"
        strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {dimensions.map((d, i) => {
        const a = -Math.PI / 2 + i * angleStep;
        const r = d.value * max;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="#7c3aed"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.05 }}
          />
        );
      })}
      {dimensions.map((d, i) => {
        const a = -Math.PI / 2 + i * angleStep;
        const x = cx + Math.cos(a) * (max + 22);
        const y = cy + Math.sin(a) * (max + 22);
        return (
          <text
            key={i}
            x={x}
            y={y}
            fill="rgba(51,65,85,0.75)"
            fontSize="12"
            fontWeight="600"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

export function WebMatchPreview() {
  const t = useTranslations("marketingSite.matchPreview");
  const dimensions = useMemo(
    () =>
      DIMENSION_DEFS.map((d) => ({
        ...d,
        label: t(`dimensions.${d.key}.label`),
        hint: t(`dimensions.${d.key}.hint`),
      })),
    [t],
  );
  const total =
    dimensions.reduce((s, d) => s + d.value, 0) / dimensions.length;

  return (
    <section
      id="match"
      className="marketing-section relative py-24 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[20%] h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute right-[8%] bottom-[20%] h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="chip mb-3 inline-flex">
            <Radar className="h-3 w-3 text-violet-600" />
            {t("chip")}
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
            <span className="text-gradient-anim">{t("title")}</span>
          </h2>
          <p className="mt-4 text-zinc-600">{t("desc")}</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto aspect-square w-full max-w-md"
          >
            <div className="glass-v2-strong absolute inset-0 rounded-[2rem] p-6">
              <RadarChart dimensions={dimensions} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    {t("totalScore")}
                  </p>
                  <p className="font-display text-5xl font-bold text-gradient num-tab leading-none">
                    {Math.round(total * 100)}
                  </p>
                  <p className="mt-1 text-[10px] text-emerald-600">{t("highMatch")}</p>
                </div>
              </div>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 -z-10 rounded-full border border-violet-400/10 spin-slow"
            />
          </motion.div>

          <div className="space-y-3">
            {dimensions.map((d, i) => (
              <motion.div
                key={d.key}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="group marketing-card p-4 transition hover:border-violet-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-50">
                      <d.icon className="h-4 w-4 text-violet-700" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{d.label}</p>
                      <p className="text-[11px] text-zinc-600">{d.hint}</p>
                    </div>
                  </div>
                  <p className="font-mono text-lg font-bold text-zinc-900 num-tab">
                    {Math.round(d.value * 100)}
                  </p>
                </div>
                <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-zinc-100">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${d.value * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.9 }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
