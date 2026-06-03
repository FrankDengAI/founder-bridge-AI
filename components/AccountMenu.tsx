"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import { performLogout } from "@/lib/authLogout";
import clsx from "clsx";

type Props = {
  size?: "default" | "compact";
};

export function AccountMenu({ size = "default" }: Props) {
  const t = useTranslations("account");
  const tn = useTranslations("nav");
  const compact = size === "compact";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "flex items-center shadow-md ring-1 transition",
          compact
            ? "h-9 w-9 justify-center rounded-xl px-0"
            : "h-11 gap-1 rounded-2xl px-2.5",
          open
            ? "bg-zinc-950 text-white ring-zinc-700"
            : "bg-white/90 text-zinc-800 ring-zinc-200/80 hover:bg-white dark:bg-zinc-900/90 dark:text-zinc-100 dark:ring-zinc-700",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("menu")}
      >
        <UserRound className={compact ? "h-4 w-4" : "h-5 w-5"} />
        {!compact ? (
          <ChevronDown
            className={clsx("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-[80] min-w-[200px] overflow-hidden rounded-2xl border border-white/60 bg-white/95 py-1 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)] ring-1 ring-zinc-200/60 backdrop-blur-xl dark:border-zinc-700 dark:bg-zinc-950/95 dark:ring-zinc-800"
        >
          <Link
            role="menuitem"
            href="/me"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-zinc-800 hover:bg-violet-50 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            <UserRound className="h-4 w-4 text-violet-600" />
            {tn("me")}
          </Link>
          <Link
            role="menuitem"
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-zinc-800 hover:bg-violet-50 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            <Settings className="h-4 w-4 text-zinc-500" />
            {t("settingsLogout")}
          </Link>
          <div className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
          <button
            role="menuitem"
            type="button"
            onClick={() => void performLogout()}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
