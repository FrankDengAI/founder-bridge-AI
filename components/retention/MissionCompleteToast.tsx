"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  isAllTodayMissionsDone,
  MISSION_LABELS,
  todayKey,
  type DailyMissionId,
} from "@/lib/retention";
import { recordGamifyEvent } from "@/lib/gamification";

function MiniConfetti() {
  const dots = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {dots.map((i) => (
        <span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full motion-safe:animate-ping"
          style={{
            left: `${8 + (i * 7) % 84}%`,
            top: `${20 + (i * 11) % 40}%`,
            backgroundColor: ["#fbbf24", "#a78bfa", "#34d399", "#f472b6"][i % 4],
            animationDelay: `${i * 40}ms`,
            animationDuration: "900ms",
          }}
        />
      ))}
    </div>
  );
}

export function MissionCompleteToast() {
  const t = useTranslations("retention.missions");
  const [msg, setMsg] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const allDoneDayRef = useRef<string | null>(null);

  useEffect(() => {
    const fireAllDone = () => {
      const day = todayKey();
      if (allDoneDayRef.current === day) return;
      if (!isAllTodayMissionsDone()) return;
      allDoneDayRef.current = day;
      recordGamifyEvent("daily_missions_done");
      setCelebrate(true);
      setMsg(t("allDone"));
      window.setTimeout(() => setCelebrate(false), 1200);
      window.setTimeout(() => setMsg(null), 3200);
    };

    const onItem = (e: Event) => {
      const id = (e as CustomEvent<{ id: DailyMissionId }>).detail?.id;
      if (!id) return;
      setMsg(t("complete", { label: MISSION_LABELS[id] ?? id }));
      window.setTimeout(() => setMsg(null), 2200);
      fireAllDone();
    };

    const onMissions = () => fireAllDone();

    window.addEventListener("vibe-mission-item-done", onItem);
    window.addEventListener("vibe-missions-updated", onMissions);
    return () => {
      window.removeEventListener("vibe-mission-item-done", onItem);
      window.removeEventListener("vibe-missions-updated", onMissions);
    };
  }, []);

  if (!msg) return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-[60] -translate-x-1/2">
      <div
        className="relative overflow-hidden rounded-2xl bg-zinc-950 px-4 py-2.5 text-center text-xs font-semibold text-white shadow-xl ring-1 ring-emerald-400/40 motion-safe:animate-pulse"
        role="status"
      >
        {celebrate ? <MiniConfetti /> : null}
        <span className="relative z-[1]">{msg}</span>
      </div>
    </div>
  );
}
