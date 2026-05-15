"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { appDemoReady, appShellHref, isExternalMiniapp } from "@/lib/miniappOrigin";

export function WebHero() {
  const homeHref = appShellHref("/home");
  const external = isExternalMiniapp();
  const appReady = appDemoReady();
  return (
    <section
      id="vision"
      className="relative overflow-hidden pb-24 pt-28 sm:pb-32 sm:pt-36"
    >
      <p
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[8%] -translate-x-1/2 select-none font-display text-[clamp(4rem,18vw,14rem)] font-black leading-none text-white/[0.04] sm:top-[12%]"
      >
        Vibe
      </p>
      <div className="pointer-events-none absolute inset-0 bg-hero-radial" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[1px] w-[120%] -translate-x-1/2 bg-gradient-to-r from-transparent via-fuchsia-400/40 to-transparent blur-[1px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:100%_120px] [mask-image:linear-gradient(180deg,transparent,black_15%,black_85%,transparent)]" />
      </div>
      <div
        className="pointer-events-none absolute -left-1/4 top-1/4 h-[520px] w-[520px] rounded-full bg-conic-glow opacity-40 blur-3xl animate-drift"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-fuchsia-600/20 blur-[100px]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/35 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet-100 shadow-[0_0_28px_-8px_rgba(139,92,246,0.5)]">
            <Sparkles className="h-3.5 w-3.5" />
            网页端品牌站 · 与 App 壳演示双轨并行
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            把{" "}
            <span className="text-gradient-anim">创业社交</span>
            <br />
            做成一场可生长的协作演出
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            匹配、内容、工具与交易链路在同一叙事里闭环。左侧是你要的品牌张力；右侧是实时脉动的产品切片——
            完整数据与账号流请跳转「App 演示」体验 PostgreSQL 真入库。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <motion.a
              href="#features"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-[0_0_40px_-6px_rgba(167,139,250,0.75)]"
            >
              浏览能力矩阵
              <ArrowRight className="h-4 w-4" />
            </motion.a>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-6 py-3 text-sm font-semibold text-white transition hover:border-violet-400/40 hover:bg-white/10"
            >
              登录演示
            </Link>
            {appReady ? (
              <a
                href={homeHref}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/35 hover:text-white"
              >
                打开 App 壳 / 小程序端
              </a>
            ) : (
              <span
                title="在部署环境设置 NEXT_PUBLIC_MINIAPP_URL 后可用"
                className="inline-flex cursor-default items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-6 py-3 text-sm font-semibold text-slate-500"
              >
                App 壳（待配置地址）
              </span>
            )}
          </div>
          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-10 sm:max-w-lg">
            {[
              ["120ms", "首屏感知"],
              ["∞", "兴趣图扩展"],
              ["4 轨", "匹配维度"],
            ].map(([v, k]) => (
              <div key={k}>
                <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {k}
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:justify-self-end"
        >
          <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-violet-950/40 via-ink-900 to-ink-950 web-card-glow sm:mx-auto lg:mx-0">
            <div className="absolute inset-0 bg-grid-fade bg-[length:24px_24px] opacity-80" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
            <div className="relative flex h-full flex-col p-5 sm:p-6">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-500">
                <span>live.preview</span>
                <span className="flex items-center gap-1.5 text-emerald-400/90">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  syncing
                </span>
              </div>
              <p className="mt-6 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                今日匹配池
                <span className="block text-base font-normal text-slate-400 sm:text-lg">
                  基于角色矩阵 + 兴趣向量
                </span>
              </p>
              <div className="mt-8 space-y-3">
                {["ADC × JUNGLE", "创作者 × 增长", "独立交付 × 设计"].map((row, i) => (
                  <div
                    key={row}
                    className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                  >
                    <span className="text-sm font-medium text-slate-200">{row}</span>
                    <span className="font-mono text-xs text-fuchsia-300/90">
                      {(0.86 - i * 0.07).toFixed(2)} σ
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-auto space-y-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.06] p-4">
                <p className="text-xs font-medium text-cyan-200/90">
                  提示：以上为网页端视觉切片；真实打分与入库在 App 演示内。
                </p>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-6 -right-6 hidden h-28 w-28 rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 blur-sm sm:block" />
        </motion.div>
      </div>
    </section>
  );
}
