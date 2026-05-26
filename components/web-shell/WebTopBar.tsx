"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AccountMenu } from "@/components/AccountMenu";
import { NotificationHub } from "@/components/NotificationHub";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ViewModeSwitchButton } from "@/components/view-mode/ViewModeSwitchButton";
import { useViewModeOptional } from "@/components/view-mode/ViewModeProvider";
import { useViewModeLabel } from "@/lib/hooks/useViewModeLabel";

type Props = {
  pageLabelKey?: string;
};

export function WebTopBar({ pageLabelKey }: Props) {
  const viewMode = useViewModeOptional();
  const t = useTranslations("nav");
  const tw = useTranslations("webShell");
  const modeLabel = useViewModeLabel(viewMode?.mode);

  return (
    <header className="sticky top-0 z-30 border-b border-violet-200/50 bg-white/90 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-3 px-3 sm:px-4">
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
        <Link
          href="/search"
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-zinc-200/80 bg-zinc-50/90 px-3 py-2 text-sm text-zinc-500 transition duration-200 hover:border-violet-300 hover:bg-white hover:text-zinc-700 sm:px-4"
        >
          <Search className="h-4 w-4 shrink-0" />
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
