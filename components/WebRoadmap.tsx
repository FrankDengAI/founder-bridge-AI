"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Rocket, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

const MILESTONE_KEYS = ["p0", "p1", "p2", "p3", "p4", "p5"] as const;
const ITEM_INDICES = ["0", "1", "2", "3"] as const;

type MilestoneStatus = "shipped" | "in_progress" | "planned";

const MILESTONE_STATUS: Record<(typeof MILESTONE_KEYS)[number], MilestoneStatus> = {
  p0: "shipped",
  p1: "shipped",
  p2: "shipped",
  p3: "shipped",
  p4: "in_progress",
  p5: "planned",
};

export function WebRoadmap() {
  const t = useTranslations("marketingSite.roadmap");

  const statusBadge = useMemo(
    () => ({
      shipped: {
        icon: CheckCircle2,
        cls: "border-emerald-200 bg-emerald-50 text-emerald-800",
        label: t("status.shipped"),
      },
      in_progress: {
        icon: Clock,
        cls: "border-amber-200 bg-amber-50 text-amber-800",
        label: t("status.inProgress"),
      },
      planned: {
        icon: Rocket,
        cls: "border-zinc-200 bg-zinc-50 text-zinc-600",
        label: t("status.planned"),
      },
    }),
    [t],
  );

  const milestones = useMemo(
    () =>
      MILESTONE_KEYS.map((phase) => ({
        phase: phase.toUpperCase(),
        status: MILESTONE_STATUS[phase],
        title: t(`milestones.${phase}.title`),
        items: ITEM_INDICES.map((i) => t(`milestones.${phase}.items.${i}`)),
      })),
    [t],
  );

  return (
    <section
      id="roadmap"
      className="marketing-section relative py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="chip mb-3">
              <Sparkles className="h-3 w-3 text-cyan-600" />
              {t("chip")}
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
              <span className="text-gradient-cool">{t("title")}</span>
              <br className="sm:hidden" /> {t("titleSuffix")}
            </h2>
            <p className="mt-3 max-w-xl text-zinc-600">{t("desc")}</p>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            {t("updated")}
          </div>
        </div>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-violet-400/40 via-fuchsia-400/30 to-transparent sm:left-1/2"
          />

          <ul className="space-y-6 sm:space-y-10">
            {milestones.map((m, i) => {
              const badge = statusBadge[m.status];
              const Badge = badge.icon;
              const leftSide = i % 2 === 0;
              return (
                <motion.li
                  key={m.phase}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="relative pl-12 sm:pl-0"
                >
                  <div className="absolute left-0 top-2 flex h-8 w-8 items-center justify-center sm:left-1/2 sm:-translate-x-1/2">
                    <div className="relative">
                      <div className="relative h-8 w-8 rounded-full border border-violet-300 bg-white shadow-sm backdrop-blur" />
                      {m.status === "shipped" ? (
                        <CheckCircle2 className="absolute inset-0 m-auto h-4 w-4 text-emerald-600" />
                      ) : m.status === "in_progress" ? (
                        <>
                          <Clock className="absolute inset-0 m-auto h-4 w-4 text-amber-600" />
                          <span className="absolute inset-0 rounded-full border border-amber-300 animate-ping-slow" />
                        </>
                      ) : (
                        <Rocket className="absolute inset-0 m-auto h-4 w-4 text-zinc-500" />
                      )}
                    </div>
                  </div>

                  <div
                    className={`sm:flex sm:gap-0 ${
                      leftSide ? "" : "sm:flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`sm:w-[calc(50%-2.5rem)] ${
                        leftSide ? "sm:pr-10" : "sm:pl-10"
                      }`}
                    >
                      <div className="glass-v2 rounded-2xl p-5 transition hover:border-violet-300">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-violet-700">
                            {m.phase}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${badge.cls}`}
                          >
                            <Badge className="h-3 w-3" />
                            {badge.label}
                          </span>
                        </div>
                        <h3 className="mt-2 text-base font-bold text-zinc-900 sm:text-lg">
                          {m.title}
                        </h3>
                        <ul className="mt-3 space-y-1.5">
                          {m.items.map((it) => (
                            <li
                              key={it}
                              className="flex gap-2 text-[12px] leading-relaxed text-zinc-600"
                            >
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400/70" />
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
