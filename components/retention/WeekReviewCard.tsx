"use client";

import { useEffect, useState } from "react";
import { Share2, Sparkles } from "lucide-react";
import { getUnlockedBadges } from "@/lib/gamification";
import {
  countCheckInsThisWeek,
  countEventsThisWeek,
} from "@/lib/retention";

function isSunday() {
  return new Date().getDay() === 0;
}

export function WeekReviewCard() {
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
    const text = `\u672c\u5468\u6211\u5728 VibeHub\uff1a\u7b7e\u5230 ${stats.checkIns} \u5929\u3001\u4efb\u52a1\u901a\u5173 ${stats.missionDays} \u5929\u3001${stats.matches} \u6b21\u5339\u914d\u3001${stats.badges} \u679a\u5fbd\u7ae0\u3002\u4e00\u8d77\u6765\u627e\u521b\u4e1a\u4f19\u4f34\uff01`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "VibeHub \u5468\u56de\u987e", text });
        setToast("\u5df2\u5524\u8d77\u5206\u4eab");
      } else {
        await navigator.clipboard.writeText(text);
        setToast("\u5468\u56de\u987e\u5df2\u590d\u5236");
      }
    } catch {
      setToast("\u5206\u4eab\u5df2\u53d6\u6d88");
    }
    window.setTimeout(() => setToast(null), 2000);
  };

  return (
    <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-3 text-white shadow-lg">
      <p className="flex items-center gap-1.5 text-xs font-semibold">
        <Sparkles className="h-3.5 w-3.5" />
        {"\u672c\u5468\u56de\u987e"}
      </p>
      <div className="mt-2 grid grid-cols-4 gap-2 text-center text-[10px]">
        <div>
          <p className="text-lg font-bold tabular-nums">{stats.checkIns}</p>
          <p className="opacity-80">{"\u7b7e\u5230\u5929"}</p>
        </div>
        <div>
          <p className="text-lg font-bold tabular-nums">{stats.missionDays}</p>
          <p className="opacity-80">{"\u4efb\u52a1\u901a\u5173"}</p>
        </div>
        <div>
          <p className="text-lg font-bold tabular-nums">{stats.matches}</p>
          <p className="opacity-80">{"\u5339\u914d\u6b21"}</p>
        </div>
        <div>
          <p className="text-lg font-bold tabular-nums">{stats.badges}</p>
          <p className="opacity-80">{"\u5fbd\u7ae0"}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => void share()}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 py-2 text-[11px] font-semibold hover:bg-white/25"
      >
        <Share2 className="h-3.5 w-3.5" />
        {"\u5206\u4eab\u672c\u5468\u6210\u957f"}
      </button>
      {toast ? <p className="mt-1 text-center text-[10px] text-white/90">{toast}</p> : null}
    </section>
  );
}
