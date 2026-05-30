"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { AccountMenu } from "@/components/AccountMenu";
import { NotificationHub } from "@/components/NotificationHub";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ViewModeSwitchButton } from "@/components/view-mode/ViewModeSwitchButton";
import { useViewModeOptional } from "@/components/view-mode/ViewModeProvider";
import { useViewModeLabel } from "@/lib/hooks/useViewModeLabel";
import { missionForPath } from "@/lib/webModuleMission";

type Props = {
  pageLabelKey?: string;
};

export function WebTopBar({ pageLabelKey }: Props) {
  const pathname = usePathname() ?? "/home";
  const mission = missionForPath(pathname);
  const viewMode = useViewModeOptional();
  const t = useTranslations("nav");
  const tw = useTranslations("webShell");
  const modeLabel = useViewModeLabel(viewMode?.mode);

  return (
    <header className="sticky top-0 z-30 border-b border-violet-200/50 bg-white/90 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-3 sm:gap-4 sm:px-4">
        <Link
          href="/home"
          className="shrink-0 font-display text-base font-bold tracking-tight text-violet-700 lg:hidden"
        >
          VibeCoding
        </Link>
        {pageLabelKey ? (
          <span className="shrink-0 rounded-lg bg-violet-50 px-2 py-0.5 text-sm font-semibold text-violet-800 lg:hidden">
            {t(pageLabelKey)}
          </span>
        ) : null}
        {pageLabelKey ? (
          <div className="hidden min-w-0 shrink-0 lg:block lg:max-w-[200px] xl:max-w-[240px]">
            <p className="truncate text-sm font-bold text-zinc-900">{t(pageLabelKey)}</p>
            {mission ? (
              <p className="truncate text-[10px] leading-snug text-zinc-500">{mission.tagline}</p>
            ) : null}
          </div>
        ) : null}
        <Link
          href="/search"
          className="group flex min-w-0 flex-1 max-w-2xl items-center gap-2 rounded-full border border-zinc-200/80 bg-zinc-50/90 px-4 py-2.5 text-sm text-zinc-500 transition duration-200 hover:border-violet-300 hover:bg-white hover:text-zinc-700 hover:shadow-sm lg:max-w-xl xl:max-w-2xl"
        >
          <Search className="h-4 w-4 shrink-0 transition group-hover:text-violet-600" />
          <span className="truncate">{tw("searchPlaceholder")}</span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {viewMode?.mode ? (
            <span className="hidden rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-bold text-violet-700 sm:inline">
              {modeLabel}
            </span>
          ) : null}
          <LocaleSwitcher />
          <ViewModeSwitchButton variant="compact" />
          <AccountMenu />
          <NotificationHub />
        </div>
      </div>
    </header>
  );
}
