"use client";

import { useTranslations } from "next-intl";
import type { ViewMode } from "@/lib/viewMode";

export function useViewModeLabel(mode: ViewMode | null | undefined): string {
  const t = useTranslations("viewMode");
  if (mode === "app") return t("app");
  if (mode === "web") return t("web");
  return t("web");
}

export function useViewModeShortLabel(mode: ViewMode | null | undefined): string {
  const t = useTranslations("viewMode");
  if (mode === "app") return t("appShort");
  if (mode === "web") return t("webShort");
  return t("webShort");
}
