"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Command, PenSquare, Search } from "lucide-react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export function HomeToolbar() {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  return (
    <div className="flex items-center gap-1.5">
      <LocaleSwitcher />
      <button
        type="button"
        title={tc("commandPalette")}
        aria-label={tc("commandPalette")}
        onClick={() => window.dispatchEvent(new Event("vibe-open-command-palette"))}
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-zinc-800 ring-1 ring-zinc-200/80 shadow-sm transition hover:bg-white active:scale-95"
      >
        <Command className="h-4 w-4" />
      </button>
      <Link
        href="/search"
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-zinc-800 ring-1 ring-zinc-200/80 shadow-sm transition hover:bg-white active:scale-95"
        aria-label={tc("openSearch")}
      >
        <Search className="h-4 w-4" />
      </Link>
      <Link
        href="/publish"
        className="inline-flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 text-xs font-semibold text-white shadow-glow transition hover:brightness-105 active:scale-[0.98]"
      >
        <PenSquare className="h-4 w-4" />
        {t("publishNote")}
      </Link>
    </div>
  );
}
