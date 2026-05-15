"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

const PHASES = [
  {
    key: "parse",
    label: "解析画像",
    detail: "读取你的角色、关键词、方向与资金档位",
  },
  {
    key: "scan",
    label: "扫描候选池",
    detail: "在种子用户与演示账号中筛选可匹配对象",
  },
  {
    key: "rank",
    label: "多维评分",
    detail: "角色互补、关键词、方向、资金与新鲜度加权",
  },
  {
    key: "reveal",
    label: "生成推荐",
    detail: "整理可解释理由与排序结果",
  },
] as const;

const ROTATING_TIPS = [
  "服务端计算在毫秒级完成；动效用于模拟「深度扫描」的产品体验。",
  "推荐列表中的每一条理由，都对应算法里的一个维度，便于你复盘筛选逻辑。",
  "若结果不理想，可回到上方调整关键词或期望伙伴类型后再跑一次。",
  "创业匹配没有标准答案——分数是冷启动线索，真实契合度仍来自沟通。",
  "资金档位差异大时，算法会降权但仍可能保留「强角色互补」的候选。",
] as const;

type Props = {
  active: boolean;
  durationMs?: number;
  onComplete: () => void;
  onCancel: () => void;
};

export function MatchProgress({
  active,
  durationMs = 30_000,
  onComplete,
  onCancel,
}: Props) {
  const [tick, setTick] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) {
      setTick(0);
      return;
    }
    const started = Date.now();
    const id = window.setInterval(() => {
      const t = Math.min(1, (Date.now() - started) / durationMs);
      setTick(t);
      if (t >= 1) {
        window.clearInterval(id);
        onCompleteRef.current();
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [active, durationMs]);

  const phaseIndex = Math.min(
    PHASES.length - 1,
    Math.floor(tick * PHASES.length),
  );
  const phase = PHASES[phaseIndex];

  const secondsLeft = useMemo(
    () => Math.max(0, Math.ceil((1 - tick) * (durationMs / 1000))),
    [tick, durationMs],
  );

  const tipIndex = Math.min(
    ROTATING_TIPS.length - 1,
    Math.floor(tick * ROTATING_TIPS.length * 1.2) % ROTATING_TIPS.length,
  );

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white/90 shadow-glow ring-1 ring-white/70 backdrop-blur-xl">
        <div className="relative px-5 pb-5 pt-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(167,139,250,0.35),transparent_55%)]" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-fuchsia-600 text-white shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-950">智能匹配进行中</p>
                  <p className="truncate text-[11px] text-zinc-600">
                    约 {Math.round(durationMs / 1000)} 秒体验 · 剩余{" "}
                    <span className="tabular-nums font-semibold text-violet-700">
                      {secondsLeft}
                    </span>{" "}
                    秒
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="shrink-0 rounded-xl bg-white/70 px-3 py-1.5 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200/80 hover:bg-white"
              >
                取消
              </button>
            </div>

            <div className="mb-2 h-2 overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 via-fuchsia-500 to-sky-400 transition-[width] duration-75"
                style={{ width: `${Math.round(tick * 100)}%` }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-medium text-zinc-600">
              <span className="text-zinc-900">{phase.label}</span>
              <span className="tabular-nums text-violet-700">{Math.round(tick * 100)}%</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">{phase.detail}</p>

            <div className="mt-3 flex items-start gap-2 rounded-2xl bg-violet-50/80 px-3 py-2.5 ring-1 ring-violet-200/60">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600" />
              <p className="text-[11px] leading-relaxed text-violet-950">{ROTATING_TIPS[tipIndex]}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PHASES.map((p, i) => (
                <div
                  key={p.key}
                  className={[
                    "rounded-2xl border px-2 py-2.5 text-center text-[10px] leading-tight sm:text-[11px]",
                    i === phaseIndex
                      ? "border-brand-300 bg-brand-50 font-semibold text-brand-950 shadow-sm"
                      : i < phaseIndex
                        ? "border-emerald-200/80 bg-emerald-50/70 font-medium text-emerald-900"
                        : "border-zinc-200/70 bg-white/60 text-zinc-500",
                  ].join(" ")}
                >
                  <span className="block font-semibold text-zinc-900">{p.label}</span>
                  <span className="mt-0.5 block font-normal text-zinc-500">{p.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
