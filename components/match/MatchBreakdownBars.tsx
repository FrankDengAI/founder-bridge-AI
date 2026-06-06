"use client";

import { useTranslations } from "next-intl";
import type { ScoreBreakdown } from "@/lib/matching/types";
import { MATCH_BREAKDOWN_LABEL_KEYS } from "@/lib/matchUiCopy";

const DIM_COLOR: Record<keyof ScoreBreakdown, { bar: string; chip: string }> = {
  role: { bar: "from-violet-500 to-fuchsia-500", chip: "text-violet-700 bg-violet-100" },
  keywords: { bar: "from-fuchsia-500 to-rose-500", chip: "text-fuchsia-700 bg-fuchsia-100" },
  direction: { bar: "from-cyan-500 to-violet-500", chip: "text-cyan-700 bg-cyan-100" },
  interest: { bar: "from-amber-500 to-rose-500", chip: "text-amber-700 bg-amber-100" },
  reciprocity: { bar: "from-rose-500 to-pink-500", chip: "text-rose-700 bg-rose-100" },
  budget: { bar: "from-emerald-500 to-cyan-500", chip: "text-emerald-700 bg-emerald-100" },
  activity: { bar: "from-lime-500 to-emerald-500", chip: "text-lime-700 bg-lime-100" },
};

function CandidateRadar({ b }: { b: ScoreBreakdown }) {
  const keys = Object.keys(MATCH_BREAKDOWN_LABEL_KEYS) as (keyof ScoreBreakdown)[];
  const cx = 70;
  const cy = 70;
  const max = 56;
  const step = (Math.PI * 2) / keys.length;
  const pts = keys
    .map((k, i) => {
      const a = -Math.PI / 2 + i * step;
      const r = Math.min(1, Math.max(0, b[k])) * max;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    })
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  return (
    <svg viewBox="0 0 140 140" className="h-32 w-32">
      <defs>
        <radialGradient id="cand-radar-fill" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(167,139,250,0.45)" />
          <stop offset="100%" stopColor="rgba(236,72,153,0.18)" />
        </radialGradient>
      </defs>
      {[0.33, 0.66, 1].map((r, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={max * r}
          fill="none"
          stroke="rgba(139,92,246,0.18)"
          strokeWidth="0.7"
        />
      ))}
      {keys.map((_, i) => {
        const a = -Math.PI / 2 + i * step;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * max}
            y2={cy + Math.sin(a) * max}
            stroke="rgba(139,92,246,0.15)"
            strokeWidth="0.7"
          />
        );
      })}
      <polygon
        points={pts}
        fill="url(#cand-radar-fill)"
        stroke="rgba(124,58,237,0.85)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MatchBreakdownBars({ b }: { b: ScoreBreakdown }) {
  const tb = useTranslations("matchBreakdown");
  const keys = Object.keys(MATCH_BREAKDOWN_LABEL_KEYS) as (keyof ScoreBreakdown)[];

  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-[auto_1fr] sm:gap-4">
      <div className="flex justify-center sm:block">
        <CandidateRadar b={b} />
      </div>
      <div className="space-y-2.5">
        {keys.map((key) => {
          const labels = MATCH_BREAKDOWN_LABEL_KEYS[key];
          const c = DIM_COLOR[key];
          const pct = Math.round(Math.min(1, b[key]) * 100);
          return (
            <div key={key}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-zinc-800">
                  {tb(labels.title)}
                </span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono font-semibold tabular-nums ${c.chip}`}
                >
                  {pct}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${c.bar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-0.5 text-[10px] leading-snug text-zinc-500">
                {tb(labels.hint)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function matchScoreIndex(score: number) {
  const n = Math.round(Math.min(1, Math.max(0, score)) * 100);
  if (n >= 76)
    return {
      n,
      tierKey: "tierHigh" as const,
      className: "bg-emerald-50 text-emerald-900 ring-emerald-200/80",
    };
  if (n >= 58)
    return {
      n,
      tierKey: "tierMid" as const,
      className: "bg-amber-50 text-amber-950 ring-amber-200/80",
    };
  return {
    n,
    tierKey: "tierExplore" as const,
    className: "bg-zinc-100 text-zinc-700 ring-zinc-200/80",
  };
}
