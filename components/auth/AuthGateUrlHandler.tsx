"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useAuthGate } from "@/components/auth/AuthGateProvider";
import { stripLocalePrefix } from "@/lib/localePath";
import { loginReasonFromNext } from "@/lib/auth/loginReason";
import { safeNextPath } from "@/lib/viewMode";

/** 处理 /home?auth=login&next=...（middleware 重定向或直链） */
export function AuthGateUrlHandler() {
  const searchParams = useSearchParams();
  const pathname = usePathname() ?? "/home";
  const router = useRouter();
  const { openLogin, isAuthenticated, isReady } = useAuthGate();
  const handled = useRef(false);

  useEffect(() => {
    if (!isReady) return;
    const base = stripLocalePrefix(pathname);
    if (base !== "/home") return;

    const auth = searchParams.get("auth");
    if (auth !== "login") return;

    const nextRaw = searchParams.get("next");
    const next = nextRaw ? safeNextPath(nextRaw) : undefined;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("auth");
    params.delete("next");
    const qs = params.toString();
    const homeClean = qs ? `/home?${qs}` : "/home";

    if (isAuthenticated) {
      const dest = next && next !== "/home" ? next : homeClean;
      router.replace(dest);
      return;
    }

    if (!handled.current) {
      handled.current = true;
      openLogin({ next, reason: loginReasonFromNext(next) });
    }

    // 已在 /home 时仅清 URL，避免 router.replace 触发整页 RSC 重载（10s+）
    const url = new URL(window.location.href);
    url.searchParams.delete("auth");
    url.searchParams.delete("next");
    const restQs = url.searchParams.toString();
    const clean = restQs ? `${url.pathname}?${restQs}` : url.pathname;
    window.history.replaceState(window.history.state, "", clean);
  }, [searchParams, pathname, router, openLogin, isAuthenticated, isReady]);

  useEffect(() => {
    handled.current = false;
  }, [searchParams]);

  return null;
}
