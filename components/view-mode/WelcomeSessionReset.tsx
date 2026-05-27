"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { clearViewMode } from "@/lib/viewMode";
import { stripLocalePrefix } from "@/lib/localePath";

/** 回到欢迎页时清除模式，确保下次进入 tabs 会重新选择 */
export function WelcomeSessionReset() {
  const pathname = usePathname() ?? "";

  useEffect(() => {
    const base = stripLocalePrefix(pathname).replace(/\/$/, "") || "/";
    if (base === "/welcome/mode") return;
    if (!base.startsWith("/welcome")) return;
    clearViewMode();
  }, [pathname]);

  return null;
}
