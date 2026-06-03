"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Compass, PenLine, Sparkles, Wrench } from "lucide-react";
import { DailyMatchCard } from "@/components/home/DailyMatchCard";
import { TodayMissionStrip } from "@/components/home/TodayMissionStrip";

const ACTIONS = [
  { href: "/match", key: "match" as const, Icon: Sparkles, accent: "from-violet-600 to-fuchsia-600" },
  { href: "/publish", key: "publish" as const, Icon: PenLine, accent: "from-indigo-600 to-violet-600" },
  { href: "/tools", key: "tools" as const, Icon: Wrench, accent: "from-emerald-600 to-teal-600" },
] as const;

export function HomeClearLanding() {
  const t = useTranslations("homeUi.clearLanding");

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-zinc-200/80 bg-white px-5 py-6 shadow-sm sm:px-8 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{t("eyebrow")}</p>
        <h2 className="mt-2 max-w-xl text-2xl font-bold leading-snug tracking-tight text-zinc-950 sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">{t("desc")}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {ACTIONS.map(({ href, key, Icon, accent }) => (
            <Link
              key={key}
              href={href}
              className="group flex flex-col rounded-2xl border border-zinc-200/90 bg-zinc-50/50 p-4 transition hover:border-violet-200 hover:bg-white hover:shadow-md"
            >
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-sm`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="mt-3 text-sm font-semibold text-zinc-900">{t(`actions.${key}.title`)}</span>
              <span className="mt-1 text-xs leading-relaxed text-zinc-500">{t(`actions.${key}.desc`)}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DailyMatchCard />
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
            <Compass className="h-3.5 w-3.5 text-violet-600" />
            {t("todayPath")}
          </p>
          <TodayMissionStrip />
        </div>
      </div>
    </section>
  );
}
