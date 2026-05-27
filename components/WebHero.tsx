"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Cpu,
  Github,
  Heart,
  Layers,
  Radar,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { appDemoReady, isExternalMiniapp } from "@/lib/miniappOrigin";
import { useAppEntryHref } from "@/lib/hooks/useAppEntryHref";

const HERO_STATS = [
  { v: "30s", k: "极速匹配", sub: "约 30 秒仪式动效" },
  { v: "7轨", k: "多维加权", sub: "角色 × 关键词 × 方向 × 资金 × …" },
  { v: "∞", k: "兴趣图谱", sub: "可生长的内容兴趣向量" },
  { v: "100ms", k: "首屏感知", sub: "Edge 友好的骨架预渲染" },
] as const;

const FLOATING_TICKERS = [
  { label: "新匹配", value: "+42", trend: "up" as const, color: "violet" },
  { label: "心愿单", value: "918", trend: "up" as const, color: "fuchsia" },
  { label: "Demo 订单", value: "256", trend: "up" as const, color: "cyan" },
];

export function WebHero() {
  const appEntry = useAppEntryHref();
  const homeHref = appEntry("/home");
  const external = isExternalMiniapp();
  const appReady = appDemoReady();

  return (
    <section
      id="vision"
      className="relative scroll-mt-20 overflow-hidden pb-24 pt-28 sm:pb-32 sm:pt-36"
    >
      {/* 巨型水印 */}
      <p
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[6%] -translate-x-1/2 select-none font-display text-[clamp(4rem,18vw,14rem)] font-black leading-none text-violet-500/[0.06] sm:top-[10%]"
      >
        Vibe
      </p>

      {/* 多层光晕 */}
      <div className="pointer-events-none absolute inset-0 bg-hero-radial" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[1px] w-[120%] -translate-x-1/2 bg-gradient-to-r from-transparent via-fuchsia-400/40 to-transparent blur-[1px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[length:100%_120px] [mask-image:linear-gradient(180deg,transparent,black_15%,black_85%,transparent)]" />
      </div>
      <div
        className="pointer-events-none absolute -left-1/4 top-1/4 h-[520px] w-[520px] rounded-full bg-conic-glow opacity-40 blur-3xl animate-drift"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-fuchsia-600/20 blur-[100px]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12">
        {/* 左侧文案 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="chip-strong">
            <Sparkles className="h-3.5 w-3.5" />
            内容 · 工具 · 创业匹配 · 一体化 Vibe Coding 社区
          </p>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.06] tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.6rem]">
            把
            <span className="text-gradient-anim"> 创业社交 </span>
            <br />
            做成一场
            <br className="sm:hidden" />
            <span className="text-gradient-cool">可生长的协作演出</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
            来自笔记、工具、项目与个人画像的多维信号，被一个可解释的匹配引擎实时编织——
            让你在 30 秒内遇到那位 <span className="font-semibold text-zinc-900">真正能开工</span> 的伙伴。
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <motion.a
              href="#features"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
            >
              <Zap className="h-4 w-4" />
              浏览能力矩阵
              <ArrowRight className="h-4 w-4" />
            </motion.a>
            <Link href="/login" className="btn-ghost">
              登录演示
            </Link>
            {appReady ? (
              <a
                href={homeHref}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="btn-ghost"
              >
                <Layers className="h-4 w-4" />
                打开 App 壳
              </a>
            ) : (
              <span
                title="在部署环境设置 NEXT_PUBLIC_MINIAPP_URL 后可用"
                className="inline-flex cursor-default items-center gap-2 rounded-full border border-zinc-200/80 bg-zinc-50 px-6 py-3 text-sm font-semibold text-zinc-500"
              >
                App 壳（待配置）
              </span>
            )}
          </div>

          {/* 4 列统计 */}
          <dl className="mt-12 grid grid-cols-2 gap-3 border-t border-violet-200/50 pt-10 sm:grid-cols-4 sm:gap-4">
            {HERO_STATS.map((s, i) => (
              <motion.div
                key={s.k}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }}
                className="group relative rounded-2xl border border-violet-200/50 bg-white/70 p-3 shadow-sm backdrop-blur-md transition hover:border-violet-300/60 hover:shadow-md"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  {s.k}
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-zinc-900 num-tab">
                  {s.v}
                </dd>
                <p className="mt-1 text-[10px] leading-snug text-zinc-500">
                  {s.sub}
                </p>
              </motion.div>
            ))}
          </dl>
        </motion.div>

        {/* 右侧 — 立体匹配预览卡 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:justify-self-end"
        >
          {/* 主预览卡 */}
          <div className="glass-v2-strong relative aspect-[5/6] w-full max-w-md overflow-hidden rounded-[2rem] sm:mx-auto lg:mx-0">
            <div className="absolute inset-0 bg-grid-fade bg-[length:24px_24px] opacity-60" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />

            {/* 装饰旋转环 */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-violet-400/20 spin-slow"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full border border-fuchsia-400/15 spin-slow"
              style={{ animationDirection: "reverse", animationDuration: "36s" }}
            />

            <div className="relative flex h-full flex-col p-5 sm:p-6">
              {/* 顶栏 */}
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                <span className="flex items-center gap-2">
                  <Radar className="h-3.5 w-3.5 text-violet-500" />
                  match.engine · v2
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="pulse-dot text-emerald-500" />
                  online
                </span>
              </div>

              {/* 标题 */}
              <div className="mt-6">
                <p className="font-display text-2xl font-bold leading-tight text-zinc-900 sm:text-[1.7rem]">
                  今日匹配池
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  <span className="text-gradient">角色 × 兴趣向量 × 方向语义</span>
                </p>
              </div>

              {/* 候选行 */}
              <div className="mt-7 space-y-3">
                {[
                  {
                    title: "ADC × JUNGLE",
                    sub: "Next.js · 增长黑客",
                    score: 0.92,
                    color: "from-violet-500/40 to-fuchsia-500/30",
                  },
                  {
                    title: "创作者 × 增长",
                    sub: "小红书运营 · 出海",
                    score: 0.83,
                    color: "from-fuchsia-500/40 to-rose-400/30",
                  },
                  {
                    title: "独立交付 × 设计",
                    sub: "LLM 应用 · 设计系统",
                    score: 0.78,
                    color: "from-cyan-400/40 to-violet-500/25",
                  },
                ].map((row, i) => (
                  <motion.div
                    key={row.title}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
                    className={`group relative overflow-hidden rounded-2xl border border-violet-200/50 bg-gradient-to-br ${row.color} px-3.5 py-2.5 backdrop-blur`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">
                          {row.title}
                        </p>
                        <p className="text-[10px] text-zinc-600">
                          {row.sub}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs text-violet-800 num-tab">
                          {Math.round(row.score * 100)}
                        </p>
                        <p className="text-[9px] uppercase tracking-wider text-zinc-500">
                          score
                        </p>
                      </div>
                    </div>
                    {/* 评分进度条 */}
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-violet-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${row.score * 100}%` }}
                        transition={{ delay: 0.7 + i * 0.12, duration: 0.9, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 底部 mini 指标 */}
              <div className="mt-auto grid grid-cols-3 gap-2 border-t border-violet-200/50 pt-4">
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-wider text-zinc-500">
                    候选池
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-bold text-zinc-900 num-tab">
                    1,284
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-wider text-zinc-500">
                    平均分
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-bold text-gradient num-tab">
                    72.4
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-wider text-zinc-500">
                    新会话
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-bold text-cyan-600 num-tab">
                    +18
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 漂浮装饰：左下 mini ticker 卡 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="absolute -bottom-6 -left-4 hidden w-[10.5rem] sm:block lg:-left-10"
          >
            <div className="glass-v2 rounded-2xl p-3 float-y">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                live ticker
              </div>
              <div className="mt-2 space-y-1.5">
                {FLOATING_TICKERS.map((t) => (
                  <div
                    key={t.label}
                    className="flex items-center justify-between text-[11px]"
                  >
                    <span className="text-zinc-500">{t.label}</span>
                    <span className="font-mono font-bold text-zinc-900 num-tab">
                      {t.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 漂浮装饰：右上 GitHub 接入 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="absolute -right-4 -top-4 hidden sm:block lg:-right-8"
          >
            <div className="glass-v2 flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold text-zinc-700">
              <Github className="h-3.5 w-3.5 text-cyan-600" />
              GitHub 已直连
              <span className="pulse-dot text-cyan-400" />
            </div>
          </motion.div>

          {/* 漂浮装饰：右侧中央 - 内容卡 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.95, duration: 0.6 }}
            className="absolute right-2 top-[42%] hidden w-[9.5rem] lg:block"
          >
            <div className="glass-v2 rounded-2xl p-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-fuchsia-700">
                <Cpu className="h-3 w-3" />
                AI 评分
              </div>
              <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-zinc-600">
                「方向语义 + 关键词向量都高度匹配，建议优先邀约。」
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-rose-600">
                <Heart className="h-3 w-3 fill-current" />
                双向意向命中
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 滚动信任标识 */}
      <div className="relative mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <p className="mb-4 text-center text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-500">
          技术栈 · 部署能力
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] font-mono text-zinc-500">
          {[
            "Next.js 14",
            "Prisma · PostgreSQL",
            "TailwindCSS",
            "Framer Motion",
            "Edge Runtime",
            "Playwright E2E",
            "GitHub OAuth",
            "Vercel 部署",
          ].map((t) => (
            <span key={t} className="transition hover:text-zinc-700">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
