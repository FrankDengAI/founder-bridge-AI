"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Command, PenSquare, Search } from "lucide-react";
import clsx from "clsx";
import { NotificationHub } from "@/components/NotificationHub";
import { useProtectedNav } from "@/lib/hooks/useProtectedNav";

type Props = {
  className?: string;
};

const iconBtnClass =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/90 text-zinc-800 ring-1 ring-zinc-200/80 shadow-sm transition hover:bg-white active:scale-95 dark:bg-zinc-900/90 dark:text-zinc-100 dark:ring-zinc-700";

export function AppQuickActions({ className }: Props) {
  const tApp = useTranslations("homeUi.discoveryApp");
  const tc = useTranslations("common");
  const { authed, isReady, guardNav } = useProtectedNav();

  const guestBtnClass = (base: string) => clsx(base, !isReady && "opacity-70");

  return (
    <div className={clsx("flex shrink-0 items-center gap-0.5", className)}>
      <NotificationHub size="compact" />
      <button
        type="button"
        title={tc("commandPalette")}
        aria-label={tc("commandPalette")}
        onClick={() => {
          if (authed) {
            window.dispatchEvent(new Event("vibe-open-command-palette"));
          } else {
            guardNav("/search", "search");
          }
        }}
        className={guestBtnClass(iconBtnClass)}
      >
        <Command className="h-4 w-4" />
      </button>
      {authed ? (
        <Link href="/search" className={iconBtnClass} aria-label={tc("openSearch")}>
          <Search className="h-4 w-4" />
        </Link>
      ) : (
        <button
          type="button"
          className={guestBtnClass(iconBtnClass)}
          aria-label={tc("openSearch")}
          onClick={() => guardNav("/search", "search")}
        >
          <Search className="h-4 w-4" />
        </button>
      )}
      {authed ? (
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
          aria-label={tApp("publishAction")}
          data-testid="topbar-publish"
          className={guestBtnClass(
            "inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-gradient-to-r from-brand-600 to-fuchsia-600 px-2 text-[10px] font-semibold text-white shadow-glow transition hover:brightness-105 active:scale-[0.98]",
          )}
          onClick={() => guardNav("/publish", "publish")}
        >
          <PenSquare className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{tApp("publishShort")}</span>
        </button>
      )}
    </div>
  );
}
