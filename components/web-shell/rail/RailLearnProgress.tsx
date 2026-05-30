"use client";

import { GraduationCap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useLearnProgress } from "@/lib/hooks/useLearnProgress";
import { LEARN_STEPS } from "@/lib/learnSteps";
import { RAIL_MISSIONS } from "@/lib/webModuleMission";
import { RailPanel } from "./RailPanel";
import { RailSkeleton } from "./RailPanel";

export function RailLearnProgress() {
  const t = useTranslations("learn");
  const { loading, nextStep, pct, complete, stepCount } = useLearnProgress();

  if (loading) return <RailSkeleton className="h-32" />;

  const stepMeta = LEARN_STEPS[nextStep - 1];

  return (
    <RailPanel
      title={RAIL_MISSIONS.learnProgress.title}
      purpose={RAIL_MISSIONS.learnProgress.purpose}
      icon={<GraduationCap className="h-4 w-4 text-violet-600" />}
      index={0}
    >
      {complete ? (
        <p className="text-xs text-emerald-700">{t("completeTitle")}</p>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div
              className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-50 ring-2 ring-violet-200"
              style={{
                background: `conic-gradient(violet-600 ${pct * 3.6}deg, rgb(237 233 254) 0deg)`,
              }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-bold text-violet-700">
                {pct}%
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-zinc-900">
                第 {nextStep}/{stepCount} 步
              </p>
              <p className="mt-0.5 line-clamp-2 text-[11px] text-zinc-600">{stepMeta?.title}</p>
            </div>
          </div>
          {stepMeta ? (
            <Link
              href={`/learn/step/${nextStep}`}
              className="mt-3 inline-flex text-xs font-semibold text-violet-700 hover:underline"
            >
              继续学习 →
            </Link>
          ) : null}
        </>
      )}
    </RailPanel>
  );
}
