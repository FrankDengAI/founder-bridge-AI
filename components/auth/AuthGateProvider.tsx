"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "@/i18n/navigation";
import { LoginModal } from "@/components/auth/LoginModal";
import { loginReasonFromNext } from "@/lib/auth/loginReason";
import {
  refreshClientSession,
  useClientUserId,
  useClientUserReady,
} from "@/lib/hooks/useClientUserId";
import { safeNextPath } from "@/lib/viewMode";

export type OpenLoginOptions = {
  next?: string;
  reason?: string;
};

type AuthGateContextValue = {
  isAuthenticated: boolean;
  isReady: boolean;
  open: boolean;
  next: string | null;
  reason: string | null;
  openLogin: (opts?: OpenLoginOptions) => void;
  closeLogin: () => void;
};

const AuthGateContext = createContext<AuthGateContextValue | null>(null);

export function AuthGateProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const userId = useClientUserId();
  const isReady = useClientUserReady();
  const [open, setOpen] = useState(false);
  const [next, setNext] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const openLogin = useCallback(
    (opts?: OpenLoginOptions) => {
      const target = opts?.next ? safeNextPath(opts.next) : null;
      if (isReady && userId) {
        if (target && target !== "/home") router.push(target);
        return;
      }
      setLoginError(null);
      setNext(target);
      setReason(opts?.reason ?? loginReasonFromNext(target) ?? null);
      setOpen(true);
    },
    [isReady, userId, router],
  );

  const closeLogin = useCallback(() => {
    setOpen(false);
    setNext(null);
    setReason(null);
  }, []);

  const handleSuccess = useCallback(
    async (_loggedInUserId: string) => {
      const target = next ? safeNextPath(next) : "/home";
      const user = await refreshClientSession();
      if (!user?.userId) {
        setLoginError("session_refresh_failed");
        return;
      }
      setLoginError(null);
      setOpen(false);
      setNext(null);
      setReason(null);
      router.push(target);
    },
    [next, router],
  );

  const value = useMemo<AuthGateContextValue>(
    () => ({
      isAuthenticated: Boolean(userId),
      isReady,
      open,
      next,
      reason,
      openLogin,
      closeLogin,
    }),
    [userId, isReady, open, next, reason, openLogin, closeLogin],
  );

  return (
    <AuthGateContext.Provider value={value}>
      {children}
      <LoginModal
        open={open}
        reason={reason}
        next={next}
        loginError={loginError}
        onClose={closeLogin}
        onSuccess={handleSuccess}
      />
    </AuthGateContext.Provider>
  );
}

export function useAuthGate() {
  const ctx = useContext(AuthGateContext);
  if (!ctx) {
    throw new Error("useAuthGate must be used within AuthGateProvider");
  }
  return ctx;
}

export function useAuthGateOptional() {
  return useContext(AuthGateContext);
}
