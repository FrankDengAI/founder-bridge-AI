"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import clsx from "clsx";
import { CheckCircle2, Circle, Target } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  getMergedDoneMissions,
  getPersonaMissions,
  readPersona,
  PERSONA_HOME_COPY,
  todayMissionProgressPct,
  type DailyMissionId,
} from "@/lib/retention";

export function TodayMissionStrip() {
  const t = useTranslations("homeUi.missions");
  const [done, setDone] = useState<DailyMissionId[]>([]);
  const [flashId, setFlashId] = useState<DailyMissionId | null>(null);
  const prevDoneRef = useRef<DailyMissionId[]>([]);

  const refresh = () => {
    const merged = getMergedDoneMissions();
    const prev = prevDoneRef.current;
    const newly = merged.find((id) => !prev.includes(id));
    if (newly) {
      setFlashId(newly);
      window.setTimeout(() => setFlashId(null), 900);
    }
    prevDoneRef.current = merged;
    setDone(merged);
  };

  useEffect(() => {
    refresh();
    window.addEventListener("vibe-missions-updated", refresh);
    window.addEventListener("vibe-checkin-updated", refresh);
    return () => {
      window.removeEventListener("vibe-missions-updated", refresh);
      window.removeEventListener("vibe-checkin-updated", refresh);
    };
  }, []);

  const persona = readPersona();
  const missions = getPersonaMissions();
  const copy = persona ? PERSONA_HOME_COPY[persona] : null;
  const pct = todayMissionProgressPct();

  return (
    <section className="rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 p-3 text-white ring-1 ring-white/10">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold">
            <Target className="h-3.5 w-3.5 text-amber-300" />
            {t("title", { pct })}
          </p>
          {copy ? (
            <p className="mt-1 text-[10px] text-zinc-400">{copy.title}</p>
          ) : (
            <p className="mt-1 text-[10px] text-zinc-400">{t("defaultHint")}</p>
          )}
        </div>
        {pct >= 100 ? (
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
            {t("allDone")}
          </span>
        ) : null}
      </div>
      <ul className="mt-2 space-y-1.5">
        {missions.map((m) => {
          const ok = done.includes(m.id);
          const flash = flashId === m.id;
          return (
            <li key={m.id}>
              <Link
                href={m.href}
                className={clsx(
                  "flex items-center gap-2 rounded-xl px-2.5 py-2 text-[11px] transition",
                  "bg-white/5 hover:bg-white/10",
                  flash && "motion-safe:scale-[1.02] ring-2 ring-emerald-400/70",
                )}
              >
                {ok ? (
                  <CheckCircle2
                    className={clsx(
                      "h-4 w-4 shrink-0 text-emerald-400",
                      flash && "motion-safe:animate-bounce",
                    )}
                  />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-zinc-500" />
                )}
                <span className={ok ? "text-zinc-400 line-through" : "text-zinc-100"}>
                  {m.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
