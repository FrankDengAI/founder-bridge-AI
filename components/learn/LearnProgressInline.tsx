"use client";

import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLearnProgress } from "@/lib/hooks/useLearnProgress";
import { LEARN_STEPS } from "@/lib/learnSteps";

export function LearnProgressInline() {
  const t = useTranslations("learn");
  const { loading, nextStep, pct, complete, stepCount } = useLearnProgress();

  if (loading || complete) return null;

  const stepMeta = LEARN_STEPS[nextStep - 1];

  return (
    <Link
      href={`/learn/step/${nextStep}`}
      className="flex items-center gap-2 rounded-2xl bg-violet-50/80 px-3 py-2 ring-1 ring-violet-200/60 transition hover:bg-violet-50"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-violet-950">{t("inlineTitle")}</p>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/80">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-violet-700">
            {nextStep}/{stepCount}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[10px] text-violet-900/70">{stepMeta?.title}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-violet-600" />
    </Link>
  );
}
