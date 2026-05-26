"use client";

import { GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLearnProgress } from "@/lib/hooks/useLearnProgress";
import { LEARN_STEPS } from "@/lib/learnSteps";

type Variant = "compact" | "full";

export function LearnProgressCard({ variant = "compact" }: { variant?: Variant }) {
  const t = useTranslations("learn");
  const { loading, nextStep, pct, complete, done, stepCount } = useLearnProgress();

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-3 text-[11px] text-zinc-500 motion-safe:animate-pulse">
        {t("loading")}
      </div>
    );
  }

  if (complete) {
    return (
      <section className="glass-panel rounded-2xl p-3 ring-1 ring-emerald-200/60">
        <p className="text-xs font-semibold text-emerald-900">{t("completeTitle")}</p>
        <p className="mt-1 text-[11px] text-emerald-800/80">{t("completeDesc")}</p>
      </section>
    );
  }

  const stepMeta = LEARN_STEPS[nextStep - 1];
  const isCompact = variant === "compact";

  return (
    <section className="glass-panel rounded-2xl border-l-4 border-l-violet-500 p-3 ring-1 ring-violet-200/50">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-sm">
          <GraduationCap className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-zinc-900">{t("progressTitle")}</p>
          <p className="mt-0.5 text-[11px] text-zinc-600">
            {t("stepOf", { current: nextStep, total: stepCount, title: stepMeta?.title ?? "" })}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          {!isCompact ? (
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">{stepMeta?.summary}</p>
          ) : null}
        </div>
        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-800 ring-1 ring-violet-200/70">
          {pct}%
        </span>
      </div>
      <Link
        href={`/learn/step/${nextStep}`}
        className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2 text-[11px] font-semibold text-white active:scale-[0.98]"
      >
        {t("continueLearning")}
      </Link>
      {!isCompact && done.size > 0 ? (
        <p className="mt-2 text-center text-[10px] text-zinc-500">
          {t("stepsDone", { count: done.size, total: stepCount })}
        </p>
      ) : null}
    </section>
  );
}
