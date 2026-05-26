"use client";

import { LayoutGrid, Smartphone } from "lucide-react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useViewModeOptional } from "@/components/view-mode/ViewModeProvider";
import { useViewModeLabel, useViewModeShortLabel } from "@/lib/hooks/useViewModeLabel";
import type { ViewMode } from "@/lib/viewMode";

const modes: ViewMode[] = ["app", "web"];

export function ViewModeSettingsPanel() {
  const ctx = useViewModeOptional();
  const router = useRouter();
  const t = useTranslations("viewMode");

  if (!ctx?.mode) return null;

  const switchTo = (target: ViewMode) => {
    if (target === ctx.mode) return;
    ctx.setMode(target);
    router.refresh();
    window.dispatchEvent(
      new CustomEvent("vbc-view-mode-changed", {
        detail: { mode: target, label: t(target === "app" ? "app" : "web") },
      }),
    );
  };

  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      {modes.map((m) => (
        <ModeCard key={m} mode={m} active={ctx.mode === m} onSelect={() => switchTo(m)} t={t} />
      ))}
    </div>
  );
}

function ModeCard({
  mode,
  active,
  onSelect,
  t,
}: {
  mode: ViewMode;
  active: boolean;
  onSelect: () => void;
  t: ReturnType<typeof useTranslations<"viewMode">>;
}) {
  const Icon = mode === "app" ? Smartphone : LayoutGrid;
  const title = useViewModeLabel(mode);
  const short = useViewModeShortLabel(mode);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        "rounded-2xl border p-3 text-left transition active:scale-[0.98]",
        active
          ? "border-violet-400 bg-violet-50/90 ring-1 ring-violet-200 dark:border-violet-700 dark:bg-violet-950/40 dark:ring-violet-800"
          : "border-zinc-200/80 bg-white/60 hover:border-violet-300 dark:border-zinc-800 dark:bg-zinc-900/40",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={clsx(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            active
              ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
            {active ? (
              <span className="ml-1.5 text-[10px] font-bold text-violet-600 dark:text-violet-400">
                {t("current")}
              </span>
            ) : null}
          </p>
          <p className="text-[11px] text-zinc-500">{short}</p>
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
        {t(mode === "app" ? "appDesc" : "webDesc")}
      </p>
    </button>
  );
}
