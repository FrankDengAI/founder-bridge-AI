"use client";

import { motion } from "framer-motion";

const bars = [40, 72, 55, 88, 48, 92, 64, 78, 52, 95, 58, 84] as const;

export function WebPulse() {
  return (
    <section
      id="pulse"
      className="relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-600/5 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              <span className="text-gradient-anim">实时脉动</span>
            </h2>
            <p className="mt-3 max-w-lg text-slate-400">
              用纯前端动画模拟「增长仪表盘」气质；真实指标与订单流在 App 演示中可查询。
            </p>
          </div>
          <p className="font-mono text-xs text-slate-500">
            MOCK_STREAM · NOT_FINANCIAL_ADVICE
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 rounded-3xl border border-violet-500/20 bg-ink-900/85 p-6 web-card-glow backdrop-blur-md sm:p-8"
        >
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/[0.06] pb-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                协作热度（演示）
              </p>
              <p className="mt-1 font-display text-4xl font-bold text-gradient">+128%</p>
            </div>
            <div className="text-right text-sm text-slate-400">
              <p>过去 24h · 会话级模拟</p>
              <p className="mt-1 font-mono text-xs text-slate-500">UTC+8</p>
            </div>
          </div>
          <div className="mt-8 flex h-40 items-end justify-between gap-1 sm:h-48 sm:gap-1.5">
            {bars.map((h, i) => (
              <div
                key={i}
                className="origin-bottom flex-1 animate-pulsebar rounded-t-md bg-gradient-to-t from-violet-600/80 via-fuchsia-500/60 to-cyan-400/40"
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 0.07}s`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
