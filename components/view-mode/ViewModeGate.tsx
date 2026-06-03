"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  defaultViewModeFromViewport,
  getViewMode,
  setViewMode,
} from "@/lib/viewMode";
import { useViewMode } from "@/components/view-mode/ViewModeProvider";
import { ViewModeLoading } from "@/components/view-mode/ViewModeLoading";

export function ViewModeGate({ children }: { children: React.ReactNode }) {
  const { ready, mode, setMode } = useViewMode();
  const t = useTranslations("viewMode");

  useEffect(() => {
    if (!ready) return;
    const stored = getViewMode();
    if (stored && !mode) {
      setMode(stored);
      return;
    }
    if (mode || stored) return;

    const defaultMode = defaultViewModeFromViewport();
    setViewMode(defaultMode);
    setMode(defaultMode);
  }, [ready, mode, setMode]);

  if (!ready) {
    return <ViewModeLoading message={t("loadingMode")} />;
  }

  if (!mode && !getViewMode()) {
    return <ViewModeLoading message={t("loadingMode")} />;
  }

  return <>{children}</>;
}
