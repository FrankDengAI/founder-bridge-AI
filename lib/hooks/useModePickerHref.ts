"use client";

import { useLocale } from "next-intl";
import { modePickerHref as buildModePickerHref } from "@/lib/localePath";

export function useModePickerHref() {
  const locale = useLocale();
  return (next = "/home") => buildModePickerHref(next, locale);
}
