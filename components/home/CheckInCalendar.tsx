"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Flame } from "lucide-react";
import {
  canCheckInToday,
  canUseStreakFreeze,
  completeMission,
  getCheckInCalendar7,
  isStreakBroken,
  performCheckIn,
  readCheckIn,
  applyStreakFreeze,
  type CalendarDay,
} from "@/lib/retention";
import { recordGamifyEvent } from "@/lib/gamification";

export function CheckInCalendar() {
  const [streak, setStreak] = useState(0);
  const [can, setCan] = useState(false);
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [broken, setBroken] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const refresh = () => {
    const s = readCheckIn();
    setStreak(s.streak);
    setCan(canCheckInToday());
    setDays(getCheckInCalendar7());
    setBroken(isStreakBroken());
  };

  useEffect(() => {
    refresh();
    const onUp = () => refresh();
    window.addEventListener("vibe-checkin-updated", onUp);
    return () => window.removeEventListener("vibe-checkin-updated", onUp);
  }, []);

  const checkIn = () => {
    const next = performCheckIn();
    setStreak(next.streak);
    setCan(false);
    setBroken(false);
    setDays(getCheckInCalendar7());
    recordGamifyEvent("daily_login");
    completeMission("checkin");
    if (next.streak >= 7) recordGamifyEvent("daily_7");
    setToast(`签到成功！连续 ${next.streak} 天`);
    window.setTimeout(() => setToast(null), 2000);
  };

  return (
    <section className="rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50/40 p-3 ring-1 ring-amber-200/70">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-600" />
          <div>
            <p className="text-xs font-semibold text-amber-950">
              连续签到 {streak} 天
            </p>
            <p className="text-[10px] text-amber-800/80">
              7 日日历 · 断签后 streak 重新计数
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={!can}
          onClick={checkIn}
          className="rounded-xl bg-orange-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm disabled:opacity-50"
        >
          {can ? "今日签到" : "已签到"}
        </button>
      </div>

      {broken && can ? (
        <div className="mt-2 space-y-1.5">
          <p className="flex items-center gap-1.5 rounded-xl bg-rose-100/80 px-2.5 py-1.5 text-[10px] font-medium text-rose-900 ring-1 ring-rose-200/60">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            你已断签，今日签到将重新开始连续天数
          </p>
          {canUseStreakFreeze() ? (
            <button
              type="button"
              onClick={() => {
                if (applyStreakFreeze()) {
                  recordGamifyEvent("streak_freeze_used");
                  refresh();
                  setToast("已使用本周补签卡，连续天数已保住");
                  window.setTimeout(() => setToast(null), 2200);
                }
              }}
              className="w-full rounded-xl bg-violet-600 px-2.5 py-1.5 text-[10px] font-bold text-white"
            >
              使用补签卡（本周 1 次）
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="mt-3 grid grid-cols-7 gap-1">
        {days.map((d) => (
          <div
            key={d.date}
            className={[
              "flex flex-col items-center rounded-xl py-2 text-center transition",
              d.isToday ? "ring-2 ring-orange-400/80" : "ring-1 ring-amber-200/50",
              d.checked
                ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white"
                : "bg-white/70 text-zinc-500",
            ].join(" ")}
          >
            <span className="text-[9px] font-medium opacity-80">周{d.weekday}</span>
            <span className="mt-0.5 text-[11px] font-bold tabular-nums">
              {d.date.slice(8)}
            </span>
            {d.checked ? (
              <span className="mt-0.5 text-[8px] font-semibold">✓</span>
            ) : (
              <span className="mt-0.5 h-2 w-2 rounded-full bg-zinc-200" />
            )}
          </div>
        ))}
      </div>

      {streak >= 7 ? (
        <p className="mt-2 text-center text-[10px] font-semibold text-emerald-800">
          七日燃成就已解锁
        </p>
      ) : (
        <p className="mt-2 text-center text-[10px] text-amber-800/90">
          再坚持 {Math.max(0, 7 - streak)} 天解锁「七日燃」徽章
        </p>
      )}

      {toast ? (
        <p className="mt-2 text-center text-[10px] font-medium text-emerald-800">{toast}</p>
      ) : null}
    </section>
  );
}
