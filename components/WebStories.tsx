"use client";

import { motion } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

const STORY_KEYS = ["deepforest", "yu", "tz", "yo"] as const;
const AVATAR_BGS = [
  "from-violet-400 to-fuchsia-400",
  "from-cyan-400 to-violet-400",
  "from-fuchsia-400 to-rose-400",
  "from-amber-400 to-fuchsia-400",
] as const;

export function WebStories() {
  const t = useTranslations("marketingSite.stories");

  return (
    <section
      id="stories"
      className="marketing-section relative py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="chip mb-3 inline-flex">
            <Sparkles className="h-3 w-3 text-rose-600" />
            {t("chip")}
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
            <span className="text-gradient-warm">{t("titleAccent")}</span> {t("titleRest")}
            <br className="sm:hidden" />
            {t("titleLine2")}
          </h2>
          <p className="mt-3 text-zinc-600">{t("desc")}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {STORY_KEYS.map((key, i) => {
            const name = t(`items.${key}.name`);
            return (
              <motion.div
                key={key}
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
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${AVATAR_BGS[i]} text-base font-bold text-white ring-1 ring-zinc-200/80`}
                  >
                    {name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{name}</p>
                    <p className="text-[11px] text-zinc-600">
                      <span className="font-mono">{t(`items.${key}.handle`)}</span> ·{" "}
                      {t(`items.${key}.role`)}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-[14px] leading-relaxed text-zinc-700">
                  「{t(`items.${key}.quote`)}」
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-mono font-semibold text-emerald-800">
                  <span className="pulse-dot text-emerald-400" />
                  {t(`items.${key}.metric`)}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
