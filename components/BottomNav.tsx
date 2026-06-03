"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { MAIN_NAV_ITEMS, resolveTab, type NavTab } from "@/lib/navConfig";
import { useClientUserId } from "@/lib/hooks/useClientUserId";
import { useConversationStats } from "@/lib/hooks/useConversationStats";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

const TAB_REASON: Partial<Record<NavTab, string>> = {
  "/match": "match",
  "/messages": "messages",
  "/me": "me",
};

export function BottomNav() {
  const pathname = usePathname() ?? "";
  const tab = resolveTab(pathname);
  const userId = useClientUserId();
  const { isAuthenticated, isReady, requireAuth } = useRequireAuth();
  const { unread: msgUnread } = useConversationStats(Boolean(userId));
  const t = useTranslations("nav");
  const tNavExtra = useTranslations("navExtra");

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)]"
      aria-label={tNavExtra("main")}
    >
      <div className="mx-auto max-w-lg px-3">
        <div className="mb-2 rounded-[22px] border border-violet-200/60 bg-white/90 p-1.5 shadow-[0_12px_40px_-20px_rgba(139,92,246,0.35)] backdrop-blur-2xl">
          <div className="flex items-stretch justify-around rounded-[18px] bg-gradient-to-r from-violet-50/80 via-white to-fuchsia-50/80 p-0.5">
            {MAIN_NAV_ITEMS.map((it) => {
              const active = tab === it.tab;
              const Icon = it.Icon;
              const showBadge = it.unread && msgUnread > 0;
              const needsAuth = it.tab !== "/home";
              const reason = TAB_REASON[it.tab];

              const className = clsx(
                "relative flex min-w-[52px] flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[10px] transition-all duration-300 motion-safe:active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:min-w-[56px] sm:text-[11px]",
                active
                  ? "bg-gradient-to-br from-violet-600 via-fuchsia-600 to-violet-700 text-white shadow-lg shadow-fuchsia-500/35 ring-1 ring-white/25"
                  : "text-zinc-600 hover:bg-violet-50/80 hover:text-violet-900",
              );

              const inner = (
                <>
                  {active ? (
                    <span className="absolute inset-x-2 -top-1 h-1 rounded-full bg-gradient-to-r from-amber-300 via-white to-cyan-200 opacity-90 blur-[2px] motion-safe:animate-pulse sm:inset-x-3" />
                  ) : null}
                  <span className="relative">
                    <Icon
                      className={clsx(
                        "h-5 w-5 transition-transform duration-300",
                        active
                          ? "scale-110 text-white drop-shadow"
                          : "text-zinc-500",
                      )}
                    />
                    {showBadge ? (
                      <span className="absolute -right-1.5 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                        {msgUnread > 9 ? "9+" : msgUnread}
                      </span>
                    ) : null}
                  </span>
                  <span className={clsx("relative z-[1]", active && "font-bold tracking-wide")}>
                    {t(it.labelKey)}
                  </span>
                </>
              );

              if (needsAuth && !isAuthenticated) {
                return (
                  <button
                    key={it.href}
                    type="button"
                    disabled={!isReady}
                    className={clsx(className, !isReady && "opacity-50")}
                    onClick={() => {
                      requireAuth({ next: it.href, reason: reason ?? "default" });
                    }}
                  >
                    {inner}
                  </button>
                );
              }

              return (
                <Link
                  key={it.href}
                  href={it.href}
                  aria-current={active ? "page" : undefined}
                  className={className}
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
