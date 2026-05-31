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
import { useMemo } from "react";
import { useTranslations } from "next-intl";

const PRODUCT_DEFS = [
  { key: "prompt", icon: Wand2, price: 19, sales: 1824, rating: 4.8, color: "from-violet-500/30 to-fuchsia-500/15" },
  { key: "scaffold", icon: Code, price: 99, sales: 612, rating: 4.9, color: "from-cyan-500/30 to-violet-500/15" },
  { key: "components", icon: Palette, price: 49, sales: 921, rating: 4.7, color: "from-fuchsia-500/30 to-rose-500/15" },
  { key: "agent", icon: Bot, price: 199, sales: 234, rating: 5.0, color: "from-lime-400/30 to-cyan-400/15" },
  { key: "miniapp", icon: Layers, price: 69, sales: 1306, rating: 4.6, color: "from-amber-400/30 to-fuchsia-500/15" },
  { key: "coaching", icon: Zap, price: 999, sales: 86, rating: 4.9, color: "from-rose-500/30 to-violet-500/15" },
] as const;

const TAG_KEYS = ["all", "prompt", "scaffold", "components", "agent", "miniapp", "course", "service"] as const;

const STAT_KEYS = ["creators", "listings", "avgIncome"] as const;
const STAT_VALUES = ["1,284", "3,612", "¥4,860"] as const;

export function WebMarket() {
  const t = useTranslations("marketingSite.market");

  const products = useMemo(
    () =>
      PRODUCT_DEFS.map((p) => ({
        ...p,
        title: t(`products.${p.key}.title`),
        sub: t(`products.${p.key}.sub`),
        tag: t(`products.${p.key}.tag`),
      })),
    [t],
  );

  return (
    <section
      id="market"
      className="marketing-section relative py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="chip mb-3">
              <Sparkles className="h-3 w-3 text-lime-600" />
              {t("chip")}
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
              {t("title")}{" "}
              <span className="text-gradient-warm">{t("titleAccent")}</span>
            </h2>
            <p className="mt-3 max-w-xl text-zinc-600">{t("desc")}</p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-zinc-200/80 bg-white/90 px-4 py-2 text-[11px] text-zinc-700">
            <Download className="h-3.5 w-3.5 text-emerald-600" />
            <span>{t("gmvLabel")}</span>
            <span className="font-mono text-base font-bold text-zinc-900 num-tab">
              ¥182,400
            </span>
            <span className="text-emerald-600">+38%</span>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {TAG_KEYS.map((key, i) => (
            <button
              key={key}
              type="button"
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                i === 0
                  ? "border-violet-300 bg-violet-50 text-violet-800"
                  : "border-zinc-200/80 bg-zinc-50 text-zinc-600 hover:border-violet-300 hover:text-violet-900"
              }`}
            >
              {t(`tags.${key}`)}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_0_64px_-16px_rgba(139,92,246,0.35)]"
            >
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${p.color} blur-2xl opacity-60`}
              />
              <div className="relative flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200/80 bg-zinc-50">
                  <p.icon className="h-5 w-5 text-violet-700" />
                </span>
                <span className="rounded-full border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-zinc-600">
                  {p.tag}
                </span>
              </div>
              <h3 className="relative mt-4 text-base font-bold text-zinc-900">
                {p.title}
              </h3>
              <p className="relative mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-600">
                {p.sub}
              </p>

              <div className="relative mt-4 flex items-end justify-between border-t border-zinc-200/80 pt-4">
                <div>
                  <p className="font-display text-2xl font-bold text-zinc-900 num-tab">
                    <span className="text-sm text-zinc-500">¥</span>
                    {p.price}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-600">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {p.rating} · {t("sold", { sales: p.sales })}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-ink-950 transition hover:bg-slate-100"
                >
                  {t("wishlist")}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid gap-3 rounded-3xl border border-zinc-200/80 bg-gradient-to-r from-violet-50 via-fuchsia-50/50 to-cyan-50 p-6 sm:grid-cols-3 sm:p-7">
          {STAT_KEYS.map((key, i) => (
            <div key={key} className="text-center">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                {t(`stats.${key}`)}
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-gradient num-tab">
                {STAT_VALUES[i]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
