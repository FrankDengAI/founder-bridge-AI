"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LayoutGrid, Smartphone } from "lucide-react";
import clsx from "clsx";
import { useViewModeOptional } from "@/components/view-mode/ViewModeProvider";
import { useViewModeLabel } from "@/lib/hooks/useViewModeLabel";
import type { ViewMode } from "@/lib/viewMode";

type Props = {
  variant?: "sidebar" | "compact" | "settings";
};

export function ViewModeSwitchButton({ variant = "compact" }: Props) {
  const ctx = useViewModeOptional();
  const router = useRouter();
  const t = useTranslations("viewMode");
  const targetLabel = useViewModeLabel(ctx?.mode === "app" ? "web" : "app");

  if (!ctx?.mode) return null;

  const target: ViewMode = ctx.mode === "app" ? "web" : "app";
  const label = ctx.mode === "app" ? t("switchToWeb") : t("switchToApp");
  const Icon = ctx.mode === "app" ? LayoutGrid : Smartphone;

  const switchMode = () => {
    ctx.setMode(target);
    router.refresh();
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("vbc-view-mode-changed", {
          detail: { mode: target, label: targetLabel },
        }),
      );
    }
  };

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={switchMode}
        className="flex w-full items-center gap-2 rounded-xl border border-zinc-200/80 bg-white/80 px-3 py-2.5 text-xs font-semibold text-zinc-700 transition hover:border-violet-300 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-200"
      >
        <Icon className="h-4 w-4" />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={switchMode}
      title={label}
      aria-label={label}
      className={clsx(
        "flex h-11 w-11 items-center justify-center rounded-2xl shadow-md ring-1 transition active:scale-95",
        "bg-white/90 text-violet-700 ring-zinc-200/80 hover:bg-white dark:bg-zinc-900 dark:text-violet-300 dark:ring-zinc-700",
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
