"use client";

import { useLocale } from "next-intl";
import { modePickerHref } from "@/lib/localePath";
import { isExternalMiniapp, miniappOrigin } from "@/lib/miniappOrigin";

/** 营销站 / 登录桥：locale 感知的「进入 App 演示」链接 */
export function useAppEntryHref() {
  const locale = useLocale();
  return (next = "/home") => {
    const path = modePickerHref(next, locale);
    if (!isExternalMiniapp()) return path;
    const ext = miniappOrigin();
    if (!ext) return path;
    return `${ext.replace(/\/$/, "")}${path}`;
  };
}
