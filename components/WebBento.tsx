"use client";

import { motion } from "framer-motion";
import {
  GitBranch,
  Radar,
  ShoppingBag,
  Users,
  Zap,
} from "lucide-react";

const items = [
  {
    title: "智能匹配",
    desc: "角色、预算档、技能关键词与期望队友组合，多轨打分可解释。",
    icon: Radar,
    className: "md:col-span-2",
    accent: "from-violet-500/20 to-transparent",
  },
  {
    title: "内容发现",
    desc: "For You、搜索历史与热词骨架，贴近主流信息流体验。",
    icon: Zap,
    className: "",
    accent: "from-fuchsia-500/15 to-transparent",
  },
  {
    title: "关系链",
    desc: "关注、评论、点赞收藏与通知中心本地联动。",
    icon: Users,
    className: "",
    accent: "from-cyan-500/15 to-transparent",
  },
  {
    title: "工具与交易",
    desc: "心愿单、演示订单与学习进度写入 SQLite。",
    icon: ShoppingBag,
    className: "md:col-span-2",
    accent: "from-lime-400/10 to-transparent",
  },
  {
    title: "工程化",
    desc: "Next App Router、Prisma、Playwright 烟测与 Windows 轮询兜底。",
    icon: GitBranch,
    className: "",
    accent: "from-violet-400/10 to-transparent",
  },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemMotion = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function WebBento() {
  return (
    <section id="features" className="border-t border-white/[0.06] py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-gradient-anim">能力矩阵</span>
          </h2>
          <p className="mt-4 text-slate-400">
            网页端负责品牌与叙事密度；小程序/App 壳端承载完整业务闭环与数据持久化。
          </p>
        </div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5"
        >
          {items.map((it) => (
            <motion.li
              key={it.title}
              variants={itemMotion}
              className={`group relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 shadow-inset transition hover:border-violet-400/35 hover:shadow-[0_0_48px_-14px_rgba(139,92,246,0.45)] ${it.className}`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${it.accent} opacity-0 transition group-hover:opacity-100`}
              />
              <it.icon className="relative h-9 w-9 text-violet-300" strokeWidth={1.25} />
              <h3 className="relative mt-4 font-display text-xl font-bold text-white">
                {it.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-400">
                {it.desc}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
