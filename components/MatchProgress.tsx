"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Sparkles, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MatchAnimMode } from "@/lib/matchUiCopy";
import { matchAnimDurationMs, writeMatchAnimMode } from "@/lib/matchUiCopy";

const PHASE_KEYS = ["parse", "scan", "rank", "reveal"] as const;
const TIP_KEYS = ["tip0", "tip1", "tip2", "tip3", "tip4"] as const;

type Props = {
  active: boolean;
  durationMs?: number;
  animMode?: MatchAnimMode;
  onComplete: () => void;
  onCancel: () => void;
  onSkip?: () => void;
};

export function MatchProgress({
  active,
  durationMs,
  animMode = "normal",
  onComplete,
  onCancel,
  onSkip,
}: Props) {
  const t = useTranslations("matchProgress");
  const [tick, setTick] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const effectiveMs = durationMs ?? matchAnimDurationMs(animMode);

  const phases = useMemo(
    () =>
      PHASE_KEYS.map((key) => ({
        key,
        label: t(`phases.${key}.label`),
        detail: t(`phases.${key}.detail`),
      })),
    [t],
  );

  const tips = useMemo(() => TIP_KEYS.map((key) => t(`tips.${key}`)), [t]);

  useEffect(() => {
    if (!active) {
      setTick(0);
      return;
    }
    const started = Date.now();
    const id = window.setInterval(() => {
      const tVal = Math.min(1, (Date.now() - started) / effectiveMs);
      setTick(tVal);
      if (tVal >= 1) {
        window.clearInterval(id);
        onCompleteRef.current();
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [active, effectiveMs]);

  const phaseIndex = Math.min(
    phases.length - 1,
    Math.floor(tick * phases.length),
  );
  const phase = phases[phaseIndex];

  const secondsLeft = useMemo(
    () => Math.max(0, Math.ceil((1 - tick) * (effectiveMs / 1000))),
    [tick, effectiveMs],
  );

  const tipIndex = Math.min(
    tips.length - 1,
    Math.floor(tick * tips.length * 1.2) % tips.length,
  );

  const modeLabel =
    animMode === "fast"
      ? t("modeFast")
      : animMode === "ritual"
        ? t("modeRitual")
        : t("modeNormal");

  const handleSkip = () => {
    writeMatchAnimMode("fast");
    onSkip?.();
    onCompleteRef.current();
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white/90 shadow-glow ring-1 ring-white/70 backdrop-blur-xl">
        <div className="relative px-5 pb-5 pt-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(167,139,250,0.35),transparent_55%)]" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-fuchsia-600 text-white shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-950">{t("title")}</p>
                  <p className="truncate text-[11px] text-zinc-600">
                    {t("statusLine", {
                      mode: modeLabel,
                      duration: Math.round(effectiveMs / 1000),
                      remaining: secondsLeft,
                    })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="shrink-0 rounded-xl bg-white/70 px-3 py-1.5 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200/80 hover:bg-white"
              >
                {t("cancel")}
              </button>
            </div>

            <div className="mb-2 h-2 overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 via-fuchsia-500 to-sky-400 transition-[width] duration-75"
                style={{ width: `${Math.round(tick * 100)}%` }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-medium text-zinc-600">
              <span className="text-zinc-900">{phase.label}</span>
              <span className="tabular-nums text-violet-700">{Math.round(tick * 100)}%</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">{phase.detail}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSkip}
                className="inline-flex items-center gap-1 rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
              >
                <Zap className="h-3.5 w-3.5" />
                {t("skipAnim")}
              </button>
              {animMode !== "ritual" ? (
                <button
                  type="button"
                  onClick={() => writeMatchAnimMode("ritual")}
                  className="rounded-xl bg-white/80 px-3 py-1.5 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200/80 hover:bg-white"
                >
                  {t("nextRitual")}
                </button>
              ) : null}
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-2xl bg-violet-50/80 px-3 py-2.5 ring-1 ring-violet-200/60">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600" />
              <p className="text-[11px] leading-relaxed text-violet-950">{tips[tipIndex]}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {phases.map((p, i) => (
                <div
                  key={p.key}
                  className={[
                    "rounded-2xl border px-2 py-2.5 text-center text-[10px] leading-tight sm:text-[11px]",
                    i === phaseIndex
                      ? "border-brand-300 bg-brand-50 font-semibold text-brand-950 shadow-sm"
                      : i < phaseIndex
                        ? "border-emerald-200/80 bg-emerald-50/70 font-medium text-emerald-900"
                        : "border-zinc-200/70 bg-white/60 text-zinc-500",
                  ].join(" ")}
                >
                  <span className="block font-semibold text-zinc-900">{p.label}</span>
                  <span className="mt-0.5 block font-normal text-zinc-500">{p.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
