"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Map } from "lucide-react";
import {
  ACTIVATION_STEPS,
  readActivationProgress,
} from "@/lib/activation";

type Props = { compact?: boolean };

export function ActivationJourney({ compact = false }: Props) {
  const [progress, setProgress] = useState(readActivationProgress());

  useEffect(() => {
    const refresh = () => setProgress(readActivationProgress());
    refresh();
    window.addEventListener("vibe-activation-updated", refresh);
    return () => window.removeEventListener("vibe-activation-updated", refresh);
  }, []);

  if (progress.complete) return null;

  const pct = Math.round((progress.doneCount / progress.total) * 100);
  const next = progress.next;

  if (compact) {
    return next ? (
      <Link
        href={next.href}
        className="flex items-center justify-between gap-2 rounded-2xl bg-violet-50 px-3 py-2 ring-1 ring-violet-200/60"
      >
        <span className="text-[11px] font-semibold text-violet-950">
          新手路线 {pct}% · 下一步：{next.label}
        </span>
        <ChevronRight className="h-4 w-4 text-violet-600" />
      </Link>
    ) : null;
  }

  return (
    <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-violet-950 p-3 text-white ring-1 ring-violet-500/30">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold">
            <Map className="h-3.5 w-3.5 text-violet-300" />
            创业新手 · 7 日路线
          </p>
          <p className="mt-0.5 text-[10px] text-violet-200/90">
            完成激活漏斗，更快找到靠谱伙伴
          </p>
        </div>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold tabular-nums">
          {pct}%
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      {next ? (
        <Link
          href={next.href}
          className="mt-2 flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-[11px] font-semibold hover:bg-white/15"
        >
          <span>
            D{next.day} · {next.label}
          </span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
      <ul className="mt-2 flex flex-wrap gap-1">
        {ACTIVATION_STEPS.map((s) => {
          const ok = progress.done.includes(s.id);
          return (
            <li
              key={s.id}
              className={
                ok
                  ? "rounded-full bg-emerald-500/25 px-2 py-0.5 text-[9px] text-emerald-100"
                  : "rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-white/60"
              }
            >
              {ok ? "✓" : "○"} {s.label.slice(0, 6)}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
