"use client";

import { useCallback } from "react";
import { useAuthGate, type OpenLoginOptions } from "@/components/auth/AuthGateProvider";
import { loginReasonFromNext } from "@/lib/auth/loginReason";

export function useRequireAuth() {
  const { isAuthenticated, isReady, openLogin } = useAuthGate();

  const requireAuth = useCallback(
    (opts?: OpenLoginOptions): boolean => {
      if (!isReady) return false;
      if (isAuthenticated) return true;
      openLogin({
        ...opts,
        reason: opts?.reason ?? loginReasonFromNext(opts?.next),
      });
      return false;
    },
    [isAuthenticated, isReady, openLogin],
  );

  return {
    isAuthenticated,
    isReady,
    sessionLoading: !isReady,
    requireAuth,
    openLogin,
  };
}
