"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Command, MessageCircle, PenSquare, Search } from "lucide-react";
import clsx from "clsx";
import { NotificationHub } from "@/components/NotificationHub";
import { useConversationStats } from "@/lib/hooks/useConversationStats";
import { useClientUserId } from "@/lib/hooks/useClientUserId";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

type Props = {
  className?: string;
};

const iconBtnClass =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/90 text-zinc-800 ring-1 ring-zinc-200/80 shadow-sm transition hover:bg-white active:scale-95 dark:bg-zinc-900/90 dark:text-zinc-100 dark:ring-zinc-700";

export function AppQuickActions({ className }: Props) {
  const tApp = useTranslations("homeUi.discoveryApp");
  const tc = useTranslations("common");
  const userId = useClientUserId();
  const { isAuthenticated, isReady, requireAuth } = useRequireAuth();
  const { unread: msgUnread } = useConversationStats(Boolean(userId));

  const guestBtnClass = (base: string) =>
    clsx(base, !isReady && "pointer-events-none opacity-50");

  return (
    <div className={clsx("flex shrink-0 items-center gap-0.5", className)}>
      <NotificationHub size="compact" />
      {isAuthenticated ? (
        <Link href="/messages" className={clsx("relative", iconBtnClass)} aria-label={tApp("messages")}>
          <MessageCircle className="h-4 w-4" />
          {msgUnread > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
              {msgUnread > 9 ? "9+" : msgUnread}
            </span>
          ) : null}
        </Link>
      ) : (
        <button
          type="button"
          className={guestBtnClass(iconBtnClass)}
          disabled={!isReady}
          aria-label={tApp("messages")}
          onClick={() => requireAuth({ next: "/messages", reason: "messages" })}
        >
          <MessageCircle className="h-4 w-4" />
        </button>
      )}
      <button
        type="button"
        title={tc("commandPalette")}
        aria-label={tc("commandPalette")}
        onClick={() => {
          if (isAuthenticated) {
            window.dispatchEvent(new Event("vibe-open-command-palette"));
          } else {
            requireAuth({ next: "/search", reason: "search" });
          }
        }}
        className={guestBtnClass(iconBtnClass)}
        disabled={!isReady}
      >
        <Command className="h-4 w-4" />
      </button>
      {isAuthenticated ? (
        <Link href="/search" className={iconBtnClass} aria-label={tc("openSearch")}>
          <Search className="h-4 w-4" />
        </Link>
      ) : (
        <button
          type="button"
          className={guestBtnClass(iconBtnClass)}
          disabled={!isReady}
          aria-label={tc("openSearch")}
          onClick={() => requireAuth({ next: "/search", reason: "search" })}
        >
          <Search className="h-4 w-4" />
        </button>
      )}
      {isAuthenticated ? (
        <Link
          href="/publish"
          aria-label={tApp("publishAction")}
          data-testid="topbar-publish"
          className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-gradient-to-r from-brand-600 to-fuchsia-600 px-2 text-[10px] font-semibold text-white shadow-glow transition hover:brightness-105 active:scale-[0.98]"
        >
          <PenSquare className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">{tApp("publishShort")}</span>
        </Link>
      ) : (
        <button
          type="button"
          disabled={!isReady}
          aria-label={tApp("publishAction")}
          data-testid="topbar-publish"
          className={guestBtnClass(
            "inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-gradient-to-r from-brand-600 to-fuchsia-600 px-2 text-[10px] font-semibold text-white shadow-glow transition hover:brightness-105 active:scale-[0.98]",
          )}
          onClick={() => requireAuth({ next: "/publish", reason: "publish" })}
        >
          <PenSquare className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{tApp("publishShort")}</span>
        </button>
      )}
    </div>
  );
}
