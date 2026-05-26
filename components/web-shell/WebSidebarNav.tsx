"use client";

import { usePathname } from "@/i18n/navigation";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { PenLine, Settings } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MAIN_NAV_ITEMS, resolveTab } from "@/lib/navConfig";
import { useClientUserId } from "@/lib/hooks/useClientUserId";
import { useConversationStats } from "@/lib/hooks/useConversationStats";
import { ViewModeSwitchButton } from "@/components/view-mode/ViewModeSwitchButton";
import { useViewModeOptional } from "@/components/view-mode/ViewModeProvider";
import { useViewModeLabel } from "@/lib/hooks/useViewModeLabel";

export function WebSidebarNav() {
  const pathname = usePathname() ?? "";
  const tab = resolveTab(pathname);
  const userId = useClientUserId();
  const { unread: msgUnread } = useConversationStats(Boolean(userId));
  const viewMode = useViewModeOptional();
  const t = useTranslations("nav");
  const tw = useTranslations("webShell");
  const modeLabel = useViewModeLabel(viewMode?.mode);

  return (
    <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 flex-col border-r border-violet-200/50 bg-white/85 px-3 py-5 backdrop-blur-xl lg:flex lg:w-[240px]">
      <Link
        href="/home"
        className="mb-1 px-2 font-display text-lg font-bold tracking-tight text-violet-700"
      >
        VibeCoding
      </Link>
      <p className="mb-5 px-2 text-[10px] font-medium text-zinc-500">{modeLabel}</p>

      <nav className="flex flex-1 flex-col gap-0.5" aria-label="主导航">
        {MAIN_NAV_ITEMS.map((it) => {
          const active = tab === it.tab;
          const Icon = it.Icon;
          const showBadge = it.unread && msgUnread > 0;
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition duration-200 hover:translate-x-0.5",
                active
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/25"
                      : "text-zinc-600 hover:bg-violet-50 hover:text-vinc-900",
              )}
            >
              <span className="relative">
                <Icon className="h-5 w-5" />
                {showBadge ? (
                  <span className="absolute -right-1.5 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-zinc-950">
                    {msgUnread > 9 ? "9+" : msgUnread}
                  </span>
                ) : null}
              </span>
              {t(it.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="mt-3 space-y-1 border-t border-zinc-200/70 pt-3 dark:border-zinc-800">
        <Link
          href="/publish"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-violet-50 hover:text-violet-800"
        >
          <PenLine className="h-4 w-4" />
          {tw("quickPublish")}
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-violet-50 hover:text-violet-800"
        >
          <Settings className="h-4 w-4" />
          {tw("quickSettings")}
        </Link>
        <ViewModeSwitchButton variant="sidebar" />
      </div>
    </aside>
  );
}
