"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useViewModeOptional } from "@/components/view-mode/ViewModeProvider";
import { missionKeyForPath } from "@/lib/webModuleMission";

type Props = {
  title: string;
  subtitle?: string;
  backHref?: string;
  right?: React.ReactNode;
};

export function PageHeader({ title, subtitle, backHref, right }: Props) {
  const isWeb = useViewModeOptional()?.isWeb ?? false;
  const pathname = usePathname() ?? "/home";
  const missionKey = isWeb ? missionKeyForPath(pathname) : null;
  const tCommon = useTranslations("common");
  const tMissions = useTranslations("missions");
  const missionTagline = missionKey ? tMissions(`${missionKey}.tagline`) : null;
  const missionPurpose = missionKey ? tMissions(`${missionKey}.purpose`) : null;
  const displaySubtitle = subtitle ?? missionPurpose;

  if (isWeb) {
    return (
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="web-section flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200/80 pb-5"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {backHref ? (
              <Link
                href={backHref}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                aria-label={tCommon("back")}
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
            ) : null}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-600">
                  VibeCoding
                </p>
                {missionTagline ? (
                  <span className="chip-strong text-[10px]">{missionTagline}</span>
                ) : null}
              </div>
              <h1 className="truncate text-2xl font-bold tracking-tight text-zinc-900 xl:text-3xl">
                {title}
              </h1>
            </div>
          </div>
          {displaySubtitle ? (
            <p
              className={clsx(
                "mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600",
                backHref && "pl-11",
              )}
            >
              {displaySubtitle}
            </p>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </motion.header>
    );
  }

  return (
    <header className="glass-panel flex items-start justify-between gap-3 rounded-shell border border-white/50 bg-grad-header px-4 py-3 shadow-panel dark:border-zinc-800/80">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex h-8 w-8 items-center justify-center rounded-panel bg-white/70 text-zinc-700 ring-1 ring-zinc-200/80 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label={tCommon("back")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : null}
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">
              VibeCoding
            </p>
            <h1 className="truncate text-base font-semibold text-zinc-900">{title}</h1>
          </div>
        </div>
        {subtitle ? (
          <p className="mt-1 pl-0 text-xs leading-relaxed text-zinc-600 sm:pl-10">
            {subtitle}
          </p>
        ) : null}
      </div>
      {right ? <div className="shrink-0 pt-1">{right}</div> : null}
    </header>
  );
}
