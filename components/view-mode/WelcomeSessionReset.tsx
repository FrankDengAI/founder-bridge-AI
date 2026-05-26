"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { clearViewMode } from "@/lib/viewMode";

/** 回到欢迎页时清除模式，确保下次进入 tabs 会重新选择 */
export function WelcomeSessionReset() {
  const pathname = usePathname() ?? "";

  useEffect(() => {
    const base = pathname.replace(/\/$/, "") || "/";
    if (base === "/welcome/mode") return;
    if (!base.startsWith("/welcome")) return;
    clearViewMode();
  }, [pathname]);

  return null;
}
