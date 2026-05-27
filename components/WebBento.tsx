"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  Code2,
  FileText,
  GitBranch,
  Heart,
  Layers,
  PlayCircle,
  Radar,
  ShoppingBag,
  Sparkles,
  Star,
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
              className="w-7 text-center text-[9px] font-mono uppercase text-zinc-500"
            >
              {l}
            </span>
          ))}
        </div>
        <div className="mt-1 flex flex-col gap-1.5">
          {matrix.map((row, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-5 text-right text-[9px] font-mono uppercase text-zinc-500">
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
      <div className="space-y-1.5 text-[10px] text-zinc-600">
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

type FeedMiniCard = {
  type: string;
  title: string;
  tag: string;
  seed: string;
  chip: string;
  icon: typeof FileText;
  overlay?: "video" | "code" | "longform";
  hot?: boolean;
};

const FEED_MINI_ITEMS: FeedMiniCard[] = [
  {
    type: "图文",
    title: "Cursor 多文件 Agent",
    tag: "Cursor",
    seed: "vibe-feed-note",
    chip: "bg-white/95 text-zinc-900",
    icon: FileText,
  },
  {
    type: "短视频",
    title: "Claude Code 实战",
    tag: "02:48",
    seed: "vibe-feed-video",
    chip: "bg-rose-500/95 text-white",
    icon: PlayCircle,
    overlay: "video",
    hot: true,
  },
  {
    type: "代码",
    title: "RAG Agent 模板",
    tag: ".ts",
    seed: "vibe-feed-code",
    chip: "bg-indigo-500/95 text-white",
    icon: Code2,
    overlay: "code",
  },
  {
    type: "长文",
    title: "独立开发工具栈",
    tag: "8 min",
    seed: "vibe-feed-article",
    chip: "bg-cyan-500/95 text-white",
    icon: BookOpen,
    overlay: "longform",
  },
  {
    type: "工具评测",
    title: "Cursor 深度评测",
    tag: "★ 4.8",
    seed: "vibe-feed-review",
    chip: "bg-amber-500/95 text-white",
    icon: Star,
  },
  {
    type: "项目展示",
    title: "SaaS 首周复盘",
    tag: "出海",
    seed: "vibe-feed-showcase",
    chip: "bg-fuchsia-500/95 text-white",
    icon: Layers,
  },
];

function FeedMiniCardView({ card }: { card: FeedMiniCard }) {
  const Icon = card.icon;
  return (
    <div className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-white/[0.1] bg-gradient-to-br from-violet-600/35 via-fuchsia-600/25 to-cyan-600/30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${card.seed}/180/240`}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

      <span
        className={`absolute left-1 top-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[7px] font-semibold shadow-sm backdrop-blur ${card.chip}`}
      >
        <Icon className="h-2 w-2 shrink-0" />
        {card.type}
      </span>

      {card.hot ? (
        <Heart className="absolute right-1 top-1 h-2.5 w-2.5 fill-rose-400 text-rose-400 drop-shadow" />
      ) : null}

      {card.overlay === "video" ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/50 backdrop-blur">
            <PlayCircle className="h-3.5 w-3.5 text-white" />
          </span>
        </span>
      ) : null}

      {card.overlay === "code" ? (
        <span className="absolute right-1 top-5 rounded bg-black/55 px-1 py-0.5 text-[7px] font-mono text-white backdrop-blur">
          <Code2 className="mr-0.5 inline h-2 w-2" />
          {card.tag}
        </span>
      ) : null}

      {card.overlay === "longform" ? (
        <span className="absolute right-1 top-5 inline-flex items-center gap-0.5 rounded bg-black/55 px-1 py-0.5 text-[7px] font-mono text-white backdrop-blur">
          <BookOpen className="h-2 w-2" />
          {card.tag}
        </span>
      ) : null}

      <div className="absolute inset-x-1 bottom-1 space-y-0.5">
        <p className="line-clamp-2 text-[8px] font-semibold leading-tight text-white drop-shadow">
          {card.title}
        </p>
        {!card.overlay ? (
          <span className="inline-block rounded bg-black/45 px-1 py-0.5 text-[7px] font-medium text-white/90 backdrop-blur">
            #{card.tag}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** 信息流 mini 卡片 —— 六种内容形态混排预览 */
function FeedMiniViz() {
  return (
    <div className="mt-5 grid grid-cols-3 gap-1.5">
      {FEED_MINI_ITEMS.map((card) => (
        <FeedMiniCardView key={card.title} card={card} />
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
      <div className="absolute left-1 bottom-1 text-[9px] font-mono uppercase text-zinc-500">
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
          className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50 px-2.5 py-2"
        >
          <span className="text-base">{it.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-zinc-900">
              {it.name}
            </p>
            <p className="text-[9px] font-mono text-zinc-600">{it.price}</p>
          </div>
          <ShoppingBag className="h-3 w-3 text-violet-600" />
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
          className="rounded-full border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 text-[10px] font-mono text-zinc-600"
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
      className="marketing-section relative py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="chip mb-3">
              <Activity className="h-3 w-3 text-violet-600" />
              CAPABILITY · MATRIX
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
              <span className="text-gradient-anim">能力矩阵</span>
            </h2>
            <p className="mt-4 text-zinc-600">
              五个核心子系统协同工作。每一块都不是 PPT 截图 ——
              都是真实跑在 Prisma 上的业务模块。
            </p>
          </div>
          <div className="flex gap-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800">
              ● 5 已上线
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-800">
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
              className={`group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-[0_0_64px_-16px_rgba(139,92,246,0.35)] ${it.className}`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${it.accent} opacity-0 transition group-hover:opacity-100`}
              />
              <div className="relative flex items-start justify-between">
                <it.icon
                  className="h-9 w-9 text-violet-600"
                  strokeWidth={1.25}
                />
                <span className="rounded-full border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-zinc-600">
                  {it.badge}
                </span>
              </div>
              <h3 className="relative mt-4 font-display text-xl font-bold text-zinc-900">
                {it.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-zinc-600">
                {it.desc}
              </p>
              <div className="relative">{it.viz}</div>
              <Sparkles
                aria-hidden
                className="pointer-events-none absolute -right-3 -bottom-3 h-12 w-12 rotate-12 text-zinc-900/[0.05] transition group-hover:text-zinc-900/[0.1]"
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
