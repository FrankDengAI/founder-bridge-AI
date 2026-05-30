"use client";

import { useEffect, useState } from "react";
import { Cpu, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { socialProofCounts } from "@/lib/retention";

type Props = {
  reviewCount?: number;
};

export function SocialProofTicker({ reviewCount = 0 }: Props) {
  const t = useTranslations("retention.socialProof");
  const [counts, setCounts] = useState({ matchesToday: 12, greetsToday: 28 });

  useEffect(() => {
    const refresh = () => setCounts(socialProofCounts());
    refresh();
    window.addEventListener("vibe-track-updated", refresh);
    window.addEventListener("vibe-missions-updated", refresh);
    return () => {
      window.removeEventListener("vibe-track-updated", refresh);
      window.removeEventListener("vibe-missions-updated", refresh);
    };
  }, []);

  return (
    <p className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-zinc-50 via-violet-50/40 to-zinc-50 px-3 py-2.5 text-[10px] text-zinc-600 ring-1 ring-zinc-200/70">
      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
      <span>{t("matchedToday", { count: counts.matchesToday })}</span>
      <span className="text-zinc-300">·</span>
      <span>{t("newGreetings", { count: counts.greetsToday })}</span>
      {reviewCount > 0 ? (
        <>
          <span className="text-zinc-300">·</span>
          <span className="inline-flex items-center gap-1">
            <Cpu className="h-3 w-3 text-violet-600" />
            {t("modelReviews", { count: reviewCount })}
          </span>
        </>
      ) : null}
    </p>
  );
}
