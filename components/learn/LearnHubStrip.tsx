"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { readLearnStepsDone, toggleLearnStepDone } from "@/lib/appHub";
import { syncLessonProgressGamification } from "@/lib/gamification";

const STEP_COUNT = 8;

export function LearnHubStrip() {
  const [done, setDone] = useState<Set<number>>(new Set());
  const [synced, setSynced] = useState(false);
  const [anonymous, setAnonymous] = useState(true);

  const refreshRemote = useCallback(async () => {
    const res = await fetch("/api/learn/progress");
    const data = (await res.json()) as { steps: number[]; anonymous?: boolean };
    setAnonymous(Boolean(data.anonymous));
    if (data.anonymous) {
      setDone(readLearnStepsDone());
      setSynced(false);
    } else {
      setDone(new Set(data.steps));
      setSynced(true);
      syncLessonProgressGamification(data.steps.length);
    }
  }, []);

  useEffect(() => {
    void refreshRemote();
  }, [refreshRemote]);

  const toggle = async (step: number) => {
    if (synced && !anonymous) {
      const was = done.has(step);
      const nextDone = !was;
      setDone((prev) => {
        const n = new Set(prev);
        if (nextDone) n.add(step);
        else n.delete(step);
        return n;
      });
      try {
        const res = await fetch("/api/learn/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step, done: nextDone }),
        });
        if (!res.ok) throw new Error("fail");
        const data = (await res.json()) as { steps: number[] };
        setDone(new Set(data.steps));
        syncLessonProgressGamification(data.steps.length);
      } catch {
        void refreshRemote();
      }
    } else {
      const next = toggleLearnStepDone(step);
      setDone(next);
      syncLessonProgressGamification(next.size);
    }
  };

  const pct = Math.round((done.size / STEP_COUNT) * 100);

  return (
    <section className="glass-panel rounded-shell p-4 shadow-panel ring-1 ring-white/70">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-zinc-950">学习路线进度</h2>
          <p className="mt-1 text-[11px] text-zinc-500">
            {synced && !anonymous
              ? "已登录：进度写入 SQLite，并与工作台成就同步。"
              : "未登录：进度仅存于本机；登录后将同步到数据库。"}
          </p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-900 ring-1 ring-brand-200/70">
          {pct}%
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ol className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
        {Array.from({ length: STEP_COUNT }, (_, i) => i + 1).map((step) => {
          const isDone = done.has(step);
          return (
            <li key={step} className="flex flex-col items-center gap-1">
              <button
                type="button"
                title={isDone ? "标记未完成" : "标记已完成"}
                aria-pressed={isDone}
                onClick={() => void toggle(step)}
                className="flex flex-col items-center gap-1 rounded-xl p-1 transition hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                {isDone ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                ) : (
                  <Circle className="h-6 w-6 text-zinc-300" />
                )}
                <span className="text-[10px] font-semibold text-zinc-600">{step}</span>
              </button>
              <Link
                href={`/learn/step/${step}`}
                className="text-[9px] font-medium text-brand-800 hover:underline"
              >
                打开
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
