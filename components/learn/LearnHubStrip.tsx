"use client";

import { useCallback, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { readLearnStepsDone, toggleLearnStepDone } from "@/lib/appHub";
import { syncLessonProgressGamification } from "@/lib/gamification";
import { completeActivationStep } from "@/lib/activation";
import { completeMission } from "@/lib/retention";
import { LEARN_STEPS } from "@/lib/learnSteps";

const STEP_COUNT = LEARN_STEPS.length;

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
        if (nextDone) completeMission("learn_step");
        if (data.steps.length >= 3) completeActivationStep("week_publish_or_learn");
      } catch {
        void refreshRemote();
      }
    } else {
      const next = toggleLearnStepDone(step);
      setDone(next);
      syncLessonProgressGamification(next.size);
      if (next.has(step)) completeMission("learn_step");
      if (next.size >= 3) completeActivationStep("week_publish_or_learn");
    }
  };

  const pct = Math.round((done.size / STEP_COUNT) * 100);

  return (
    <section className="glass-panel rounded-shell p-4 shadow-panel ring-1 ring-white/70">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-zinc-950">学习路线进度</h2>
          <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
            8 步走完「想法 → 需求 → 提示词 → 代码 → 设计 → GitHub → 部署 → 反馈」的
            Vibe Coding 闭环。点击圆圈标记完成，或点步骤名进入详情按清单实操。
          </p>
          <p className="mt-1 text-[10px] text-zinc-500">
            {synced && !anonymous
              ? "已登录：进度写入数据库，并与工作台成就（路线生 / 通关者）同步。"
              : "未登录：进度仅保存在本机；登录后写入数据库并解锁成就。"}
          </p>
        </div>
        <div className="text-right">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-900 ring-1 ring-brand-200/70">
            {pct}%
          </span>
          <p className="mt-1 text-[10px] text-zinc-500">
            {done.size}/{STEP_COUNT} 步
          </p>
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {LEARN_STEPS.map((step, i) => {
          const n = i + 1;
          const isDone = done.has(n);
          return (
            <li
              key={step.title}
              className="flex flex-col items-center rounded-2xl bg-white/50 p-2 ring-1 ring-zinc-200/60"
            >
              <button
                type="button"
                title={isDone ? "标记为未完成" : "标记为已完成"}
                aria-pressed={isDone}
                onClick={() => void toggle(n)}
                className="flex flex-col items-center gap-1 rounded-xl p-1 transition hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                {isDone ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                ) : (
                  <Circle className="h-6 w-6 text-zinc-300" />
                )}
                <span className="text-[10px] font-bold text-zinc-500">{n}</span>
              </button>
              <Link
                href={`/learn/step/${n}`}
                className="mt-1 line-clamp-2 text-center text-[10px] font-semibold leading-tight text-brand-900 hover:underline"
                title={step.summary}
              >
                {step.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
