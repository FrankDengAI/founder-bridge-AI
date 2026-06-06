"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { useAuthGate } from "@/components/auth/AuthGateProvider";
import { loginReasonFromNext } from "@/lib/auth/loginReason";
import { stripLocalePrefix } from "@/lib/localePath";

const GUEST_PROTECTED_PREFIXES = ["/match", "/bounty", "/messages", "/me", "/publish", "/search"];

function isGuestProtectedPath(pathname: string): boolean {
  const base = stripLocalePrefix(pathname);
  return GUEST_PROTECTED_PREFIXES.some(
    (p) => base === p || base.startsWith(`${p}/`),
  );
}

/** 游客误入受保护 Tab 时自动弹出登录层（middleware 边缘情况兜底） */
export function GuestTabGate() {
  const pathname = usePathname() ?? "/home";
  const { isAuthenticated, isReady, openLogin } = useAuthGate();
  const prompted = useRef<string | null>(null);

  useEffect(() => {
    if (!isReady || isAuthenticated) {
      prompted.current = null;
      return;
    }
    const base = stripLocalePrefix(pathname);
    if (!isGuestProtectedPath(pathname)) {
      prompted.current = null;
      return;
    }
    if (prompted.current === base) return;
    prompted.current = base;
    const qs =
      typeof window !== "undefined"
        ? window.location.search.replace(/^\?/, "")
        : "";
    const next = qs ? `${base}?${qs}` : base;
    openLogin({
      next,
      reason: loginReasonFromNext(base) ?? "default",
    });
  }, [pathname, isReady, isAuthenticated, openLogin]);

  return null;
}
