"use client";

import { useCallback } from "react";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

/** 受保护路由：仅会话就绪且已登录时允许 Link 导航，否则弹登录层 */
export function useProtectedNav() {
  const { isAuthenticated, isReady, requireAuth } = useRequireAuth();
  const authed = isReady && isAuthenticated;

  const guardNav = useCallback(
    (href: string, reason?: string) => {
      if (authed) return true;
      requireAuth({ next: href, reason });
      return false;
    },
    [authed, requireAuth],
  );

  return { authed, isReady, guardNav, requireAuth };
}
