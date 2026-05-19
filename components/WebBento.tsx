"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Bookmark,
  GitBranch,
  Heart,
  Radar,
  ShoppingBag,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemMotion = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

/** 角色互补矩阵 mini 热图 */
function RoleMatrixViz() {
  const labels = ["ADC", "JG", "SUP"];
  // 行=我，列=对方；分数越高越互补
  const matrix = [
    [0.4, 0.92, 0.78],
    [0.92, 0.45, 0.84],
    [0.78, 0.84, 0.4],
  ];
  return (
    <div className="mt-5 flex items-center gap-3">
      <div>
        <div className="ml-7 flex gap-1.5">
          {labels.map((l) => (
            <span
              key={l}
              className="w-7 text-center text-[9px] font-mono uppercase text-slate-500"
            >
              {l}
            </span>
          ))}
        </div>
        <div className="mt-1 flex flex-col gap-1.5">
          {matrix.map((row, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-5 text-right text-[9px] font-mono uppercase text-slate-500">
                {labels[i]}
              </span>
              {row.map((v, j) => (
                <span
                  key={j}
                  className="h-7 w-7 rounded-md"
                  style={{
                    background: `linear-gradient(135deg, rgba(167,139,250,${
                      v * 0.85
                    }), rgba(236,72,153,${v * 0.55}))`,
                    boxShadow: v > 0.8 ? "0 0 12px rgba(167,139,250,0.5)" : "none",
                  }}
                  title={`${labels[i]} × ${labels[j]}: ${v.toFixed(2)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-1.5 text-[10px] text-slate-400">
        <p className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded bg-violet-400/80" />
          强互补
        </p>
        <p className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded bg-violet-400/40" />
          中互补
        </p>
        <p className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded bg-violet-400/15" />
          同位
        </p>
      </div>
    </div>
  );
}

/** 信息流 mini 卡片 */
function FeedMiniViz() {
  const tags = ["LLM", "Cursor", "出海", "增长"];
  return (
    <div className="mt-5 grid grid-cols-3 gap-1.5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="relative aspect-[3/4] overflow-hidden rounded-lg border border-white/[0.07] bg-gradient-to-br from-violet-500/12 via-fuchsia-500/8 to-cyan-500/12"
        >
          <div className="absolute inset-0 dot-grid opacity-50" />
          {i === 1 ? (
            <div className="absolute inset-x-1 bottom-1 rounded bg-black/40 px-1 py-0.5 text-[8px] text-white backdrop-blur">
              {tags[i % tags.length]}
            </div>
          ) : null}
          {i === 3 ? (
            <Heart className="absolute right-1 top-1 h-2.5 w-2.5 fill-rose-400 text-rose-400" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** 关系链 mini */
function GraphMiniViz() {
  return (
    <div className="relative mt-5 h-28">
      <svg viewBox="0 0 220 110" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="edge-g" x1="0" x2="1">
            <stop offset="0" stopColor="rgba(167,139,250,0.6)" />
            <stop offset="1" stopColor="rgba(236,72,153,0.4)" />
          </linearGradient>
        </defs>
        <g stroke="url(#edge-g)" strokeWidth="1" fill="none" opacity="0.7">
          <path d="M30 55 L 110 30" />
          <path d="M30 55 L 110 80" />
          <path d="M110 30 L 190 50" />
          <path d="M110 80 L 190 50" />
          <path d="M110 30 L 110 80" />
        </g>
        {[
          { x: 30, y: 55, r: 8, c: "#a78bfa" },
          { x: 110, y: 30, r: 6, c: "#e879f9" },
          { x: 110, y: 80, r: 6, c: "#22d3ee" },
          { x: 190, y: 50, r: 9, c: "#fff" },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r + 6} fill={n.c} opacity="0.15" />
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.c} />
          </g>
        ))}
      </svg>
      <div className="absolute left-1 bottom-1 text-[9px] font-mono uppercase text-slate-500">
        关注图 · 演示
      </div>
    </div>
  );
}

/** 工具商城 mini */
function MarketMiniViz() {
  const items = [
    { name: "Prompt 包", price: "¥19", icon: "🧠" },
    { name: "脚手架", price: "¥99", icon: "⚙️" },
    { name: "组件库", price: "¥49", icon: "🎨" },
    { name: "Agent", price: "¥199", icon: "🤖" },
  ];
  return (
    <div className="mt-5 grid grid-cols-2 gap-2">
      {items.map((it) => (
        <div
          key={it.name}
          className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-2.5 py-2"
        >
          <span className="text-base">{it.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-white">
              {it.name}
            </p>
            <p className="text-[9px] font-mono text-slate-400">{it.price}</p>
          </div>
          <ShoppingBag className="h-3 w-3 text-violet-300" />
        </div>
      ))}
    </div>
  );
}

/** 工程化 mini */
function StackMiniViz() {
  return (
    <div className="mt-5 flex flex-wrap gap-1.5">
      {[
        "Next.js",
        "Prisma",
        "PostgreSQL",
        "Playwright",
        "Edge",
        "Vercel",
      ].map((t) => (
        <span
          key={t}
          className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-slate-300"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

const items = [
  {
    title: "智能匹配 · 多轨可解释",
    desc: "角色互补 × 关键词向量 × 方向语义 × 资金档 × 活跃度 × 双向意向，每一维独立可视化、可调权。",
    icon: Radar,
    className: "md:col-span-2 md:row-span-2",
    accent: "from-violet-500/22 via-fuchsia-500/8 to-transparent",
    badge: "核心",
    viz: <RoleMatrixViz />,
  },
  {
    title: "内容发现 · For You 流",
    desc: "图文 / 视频 / 代码 / 长文 / 工具评测多形态混排，规则推荐 + 兴趣标签向量。",
    icon: Zap,
    className: "md:col-span-2",
    accent: "from-fuchsia-500/18 to-transparent",
    badge: "已上线",
    viz: <FeedMiniViz />,
  },
  {
    title: "关系链 · 全本地联动",
    desc: "关注 / 评论 / 点赞 / 收藏 / 通知幂等写入，主页与消息互联。",
    icon: Users,
    className: "",
    accent: "from-cyan-500/16 to-transparent",
    badge: "稳定",
    viz: <GraphMiniViz />,
  },
  {
    title: "工具商城 · 创作者变现",
    desc: "心愿单、演示订单、学习进度三端同源；模板、Agent、定制服务一站式上架。",
    icon: ShoppingBag,
    className: "md:col-span-2",
    accent: "from-lime-400/16 to-transparent",
    badge: "可交付",
    viz: <MarketMiniViz />,
  },
  {
    title: "工程化 · Edge 友好",
    desc: "Next App Router、Prisma 双库、Playwright 烟测、Windows 轮询兜底。",
    icon: GitBranch,
    className: "",
    accent: "from-violet-400/12 to-transparent",
    badge: "Production",
    viz: <StackMiniViz />,
  },
] as const;

export function WebBento() {
  return (
    <section
      id="features"
      className="relative border-t border-white/[0.06] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="chip mb-3">
              <Activity className="h-3 w-3 text-violet-300" />
              CAPABILITY · MATRIX
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
              <span className="text-gradient-anim">能力矩阵</span>
            </h2>
            <p className="mt-4 text-slate-400">
              五个核心子系统协同工作。每一块都不是 PPT 截图 ——
              都是真实跑在 Prisma 上的业务模块。
            </p>
          </div>
          <div className="flex gap-2 text-[11px] font-mono uppercase tracking-wider text-slate-500">
            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-emerald-300">
              ● 5 已上线
            </span>
            <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-amber-300">
              ◐ 2 公测
            </span>
          </div>
        </div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5"
        >
          {items.map((it) => (
            <motion.li
              key={it.title}
              variants={itemMotion}
              className={`group relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-white/[0.05] to-white/[0.015] p-6 shadow-inset backdrop-blur transition hover:-translate-y-0.5 hover:border-violet-400/35 hover:shadow-[0_0_64px_-16px_rgba(139,92,246,0.55)] ${it.className}`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${it.accent} opacity-0 transition group-hover:opacity-100`}
              />
              <div className="relative flex items-start justify-between">
                <it.icon
                  className="h-9 w-9 text-violet-300"
                  strokeWidth={1.25}
                />
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {it.badge}
                </span>
              </div>
              <h3 className="relative mt-4 font-display text-xl font-bold text-white">
                {it.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-400">
                {it.desc}
              </p>
              <div className="relative">{it.viz}</div>
              {/* 角部装饰 */}
              <Sparkles
                aria-hidden
                className="pointer-events-none absolute -right-3 -bottom-3 h-12 w-12 rotate-12 text-white/[0.05] transition group-hover:text-white/[0.1]"
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
