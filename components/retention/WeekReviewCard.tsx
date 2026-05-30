"use client";

import { useEffect, useState } from "react";
import { Share2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { getUnlockedBadges } from "@/lib/gamification";
import {
  countCheckInsThisWeek,
  countEventsThisWeek,
} from "@/lib/retention";

function isSunday() {
  return new Date().getDay() === 0;
}

export function WeekReviewCard() {
  const t = useTranslations("retention.weekReview");
  const [toast, setToast] = useState<string | null>(null);
  const [stats, setStats] = useState({
    checkIns: 0,
    missionDays: 0,
    badges: 0,
    matches: 0,
  });

  useEffect(() => {
    const refresh = () => {
      setStats({
        checkIns: countCheckInsThisWeek(),
        missionDays: countEventsThisWeek("daily_missions_all_done"),
        badges: getUnlockedBadges().length,
        matches: countEventsThisWeek("match_run"),
      });
    };
    refresh();
    window.addEventListener("vibe-checkin-updated", refresh);
    window.addEventListener("vibe-track-updated", refresh);
    window.addEventListener("vibe-badges-updated", refresh);
    return () => {
      window.removeEventListener("vibe-checkin-updated", refresh);
      window.removeEventListener("vibe-track-updated", refresh);
      window.removeEventListener("vibe-badges-updated", refresh);
    };
  }, []);

  if (!isSunday()) return null;

  const share = async () => {
    const text = t("shareText", {
      checkIns: stats.checkIns,
      missionDays: stats.missionDays,
      matches: stats.matches,
      badges: stats.badges,
    });
    try {
      if (navigator.share) {
        await navigator.share({ title: t("title"), text });
        setToast(t("shareOpened"));
      } else {
        await navigator.clipboard.writeText(text);
        setToast(t("copied"));
      }
    } catch {
      setToast(t("cancelled"));
    }
    window.setTimeout(() => setToast(null), 2000);
  };

  return (
    <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-3 text-white shadow-lg">
      <p className="flex items-center gap-1.5 text-xs font-semibold">
        <Sparkles className="h-3.5 w-3.5" />
        {t("title")}
      </p>
      <div className="mt-2 grid grid-cols-4 gap-2 text-center text-[10px]">
        <div>
          <p className="text-lg font-bold tabular-nums">{stats.checkIns}</p>
          <p className="opacity-80">{t("checkIn")}</p>
        </div>
        <div>
          <p className="text-lg font-bold tabular-nums">{stats.missionDays}</p>
          <p className="opacity-80">{t("missions")}</p>
        </div>
        <div>
          <p className="text-lg font-bold tabular-nums">{stats.matches}</p>
          <p className="opacity-80">{t("matches")}</p>
        </div>
        <div>
          <p className="text-lg font-bold tabular-nums">{stats.badges}</p>
          <p className="opacity-80">{t("badges")}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => void share()}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 py-2 text-[11px] font-semibold hover:bg-white/25"
      >
        <Share2 className="h-3.5 w-3.5" />
        {t("share")}
      </button>
      {toast ? <p className="mt-1 text-center text-[10px] text-white/90">{toast}</p> : null}
    </section>
  );
}
