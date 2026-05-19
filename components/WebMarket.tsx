"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Code,
  Download,
  Layers,
  Palette,
  Sparkles,
  Star,
  Wand2,
  Zap,
} from "lucide-react";

const products = [
  {
    icon: Wand2,
    title: "Prompt 工业化大全",
    sub: "覆盖 12 个垂类的 380+ Prompt 模板包",
    price: 19,
    sales: 1824,
    rating: 4.8,
    tag: "热销",
    color: "from-violet-500/30 to-fuchsia-500/15",
  },
  {
    icon: Code,
    title: "Next.js 出海 SaaS 脚手架",
    sub: "Stripe + i18n + Edge 部署预集成",
    price: 99,
    sales: 612,
    rating: 4.9,
    tag: "Pro",
    color: "from-cyan-500/30 to-violet-500/15",
  },
  {
    icon: Palette,
    title: "Glass UI · 玻璃拟态组件库",
    sub: "Tailwind + Framer Motion · 64 组件",
    price: 49,
    sales: 921,
    rating: 4.7,
    tag: "新品",
    color: "from-fuchsia-500/30 to-rose-500/15",
  },
  {
    icon: Bot,
    title: "Agent 工作流模板套装",
    sub: "客服 / 内容 / 销售三种生产级配方",
    price: 199,
    sales: 234,
    rating: 5.0,
    tag: "高端",
    color: "from-lime-400/30 to-cyan-400/15",
  },
  {
    icon: Layers,
    title: "AI 小程序模板 · 卷王版",
    sub: "5 种主题 · 一键部署 · 支付接入",
    price: 69,
    sales: 1306,
    rating: 4.6,
    tag: "推荐",
    color: "from-amber-400/30 to-fuchsia-500/15",
  },
  {
    icon: Zap,
    title: "冷启动陪跑（30 天）",
    sub: "MVP · 用户增长 · 复盘三件套",
    price: 999,
    sales: 86,
    rating: 4.9,
    tag: "定制",
    color: "from-rose-500/30 to-violet-500/15",
  },
];

const tags = [
  "全部",
  "Prompt 包",
  "脚手架",
  "组件库",
  "Agent",
  "小程序模板",
  "课程",
  "定制服务",
];

export function WebMarket() {
  return (
    <section
      id="market"
      className="relative border-t border-white/[0.06] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="chip mb-3">
              <Sparkles className="h-3 w-3 text-lime-300" />
              MARKET · CREATOR
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
              工具商城 <span className="text-gradient-warm">让代码变现</span>
            </h2>
            <p className="mt-3 max-w-xl text-slate-400">
              从 ¥19 的 Prompt 包，到 ¥999 的冷启动陪跑——
              个人和小团队都能用同一套上架流程标准化售卖。
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] text-slate-300">
            <Download className="h-3.5 w-3.5 text-emerald-300" />
            <span>本月 GMV</span>
            <span className="font-mono text-base font-bold text-white num-tab">
              ¥182,400
            </span>
            <span className="text-emerald-300">+38%</span>
          </div>
        </div>

        {/* 分类胶囊 */}
        <div className="mt-10 flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <button
              key={t}
              type="button"
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                i === 0
                  ? "border-violet-400/40 bg-violet-500/15 text-white"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-violet-400/30 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* 商品网格 */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur transition hover:-translate-y-1 hover:border-violet-400/35 hover:shadow-[0_0_64px_-16px_rgba(139,92,246,0.55)]"
            >
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${p.color} blur-2xl opacity-60`}
              />
              <div className="relative flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <p.icon className="h-5 w-5 text-violet-200" />
                </span>
                <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-slate-300">
                  {p.tag}
                </span>
              </div>
              <h3 className="relative mt-4 text-base font-bold text-white">
                {p.title}
              </h3>
              <p className="relative mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
                {p.sub}
              </p>

              <div className="relative mt-4 flex items-end justify-between border-t border-white/[0.06] pt-4">
                <div>
                  <p className="font-display text-2xl font-bold text-white num-tab">
                    <span className="text-sm text-slate-500">¥</span>
                    {p.price}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {p.rating} · 已售 {p.sales}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-ink-950 transition hover:bg-slate-100"
                >
                  加入心愿单
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 收入告知带 */}
        <div className="mt-10 grid gap-3 rounded-3xl border border-white/[0.08] bg-gradient-to-r from-violet-600/8 via-fuchsia-600/4 to-cyan-600/8 p-6 sm:grid-cols-3 sm:p-7">
          {[
            { k: "创作者数", v: "1,284" },
            { k: "上架作品", v: "3,612" },
            { k: "平均月入", v: "¥4,860" },
          ].map((x) => (
            <div key={x.k} className="text-center">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {x.k}
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-gradient num-tab">
                {x.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
