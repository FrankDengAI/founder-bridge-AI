"use client";

import { motion } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";

const stories = [
  {
    name: "林深",
    handle: "@deepforest",
    role: "独立开发者 · 出海 SaaS",
    avatarBg: "from-violet-400 to-fuchsia-400",
    quote:
      "在「能力 × 方向」雷达里第一眼锁定了我的运营合伙人——3 天就拼出 MVP 上线，第二周拿到第一笔订阅。",
    metric: "上线 14 天 · MRR ¥18,200",
  },
  {
    name: "阿语",
    handle: "@yu_studio",
    role: "AI 内容创作者",
    avatarBg: "from-cyan-400 to-violet-400",
    quote:
      "把 Cursor / Claude Code 实战教程发到 For You 流，自然涨粉 3.4k，比抖音视频效率高 5×。",
    metric: "涨粉 +3,400 · 收藏 1.2w",
  },
  {
    name: "TZ",
    handle: "@tz.dev",
    role: "全栈 · 设计交付",
    avatarBg: "from-fuchsia-400 to-rose-400",
    quote:
      "我把 Glass UI 组件库上架到工具商城。第一个月卖了 312 份，是我前两年开源积累的 6 倍。",
    metric: "工具商城 312 单",
  },
  {
    name: "Yo",
    handle: "@yo.codes",
    role: "在校 · Vibe Coding 新手",
    avatarBg: "from-amber-400 to-fuchsia-400",
    quote:
      "学习路线把零散知识收了起来，按节奏跟着做了一个班级管理小程序，期末项目直接拿了 A+。",
    metric: "完成 24 个 Step",
  },
];

export function WebStories() {
  return (
    <section
      id="stories"
      className="marketing-section relative py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="chip mb-3 inline-flex">
            <Sparkles className="h-3 w-3 text-rose-600" />
            REAL · STORIES
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
            <span className="text-gradient-warm">他们</span> 在这里
            <br className="sm:hidden" />
            把想法变成业务
          </h2>
          <p className="mt-3 text-zinc-600">
            四种典型用户的 30 天切片——从匹配伙伴到上架变现，链路在同一个平台闭环。
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {stories.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 p-6 backdrop-blur transition hover:border-violet-300 hover:bg-zinc-50 sm:p-7"
            >
              <Quote
                aria-hidden
                className="pointer-events-none absolute -right-3 -top-3 h-20 w-20 text-zinc-900/[0.04] transition group-hover:text-zinc-900/[0.08]"
              />
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.avatarBg} text-base font-bold text-white ring-1 ring-zinc-200/80`}
                >
                  {s.name.slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">{s.name}</p>
                  <p className="text-[11px] text-zinc-600">
                    <span className="font-mono">{s.handle}</span> · {s.role}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-[14px] leading-relaxed text-zinc-700">
                「{s.quote}」
              </p>
              <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-mono font-semibold text-emerald-800">
                <span className="pulse-dot text-emerald-400" />
                {s.metric}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
