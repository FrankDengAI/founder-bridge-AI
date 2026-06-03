"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LoginForm } from "@/app/[locale]/(shell)/welcome/login/LoginForm";
import { isAuthModalReason } from "@/lib/auth/authModalReasons";
import { authFlowQuery } from "@/lib/navBack";
import { useIsWebMode } from "@/lib/hooks/useIsWebMode";

type Props = {
  open: boolean;
  reason: string | null;
  next: string | null;
  loginError?: string | null;
  onClose: () => void;
  onSuccess: (userId: string) => void;
};

const SWIPE_CLOSE_PX = 72;

const panelSurface =
  "max-h-[min(62vh,520px)] overflow-y-auto bg-white/80 shadow-xl ring-1 ring-white/50 backdrop-blur-2xl dark:bg-zinc-950/75 dark:ring-white/10";

export function LoginModal({ open, reason, next, loginError, onClose, onSuccess }: Props) {
  const t = useTranslations("authModal");
  const tForm = useTranslations("authForm");
  const isWeb = useIsWebMode();
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  const subtitle = isAuthModalReason(reason)
    ? t(`reason.${reason}` as "reason.viewPost")
    : t("subtitle");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLInputElement>('input[autocomplete="username"]')?.focus();
    }, 80);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY ?? 0;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (isWeb) return;
      const endY = e.changedTouches[0]?.clientY ?? 0;
      if (endY - touchStartY.current > SWIPE_CLOSE_PX) onClose();
    },
    [isWeb, onClose],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/30 backdrop-blur-md motion-safe:animate-[fadeIn_200ms_ease-out]"
        aria-label={t("close")}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={
          isWeb
            ? "relative z-[101] mx-4 w-full max-w-sm motion-safe:animate-[scaleIn_220ms_ease-out]"
            : "relative z-[101] w-full max-w-[min(100%,22rem)] motion-safe:animate-[slideUp_280ms_cubic-bezier(0.22,1,0.36,1)]"
        }
      >
        <div
          data-testid="login-modal-panel"
          className={
            isWeb
              ? `${panelSurface} rounded-3xl`
              : `${panelSurface} rounded-t-[1.35rem] shadow-[0_-8px_40px_-16px_rgba(0,0,0,0.28)]`
          }
          onClick={(e) => e.stopPropagation()}
        >
          {!isWeb ? (
            <div className="flex justify-center pt-2 pb-0.5" aria-hidden>
              <span className="h-1 w-9 rounded-full bg-zinc-300/90" />
            </div>
          ) : null}

          <div className="sticky top-0 z-10 flex items-start justify-between gap-2 border-b border-white/40 bg-white/60 px-4 py-2 backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-950/60">
            <div className="min-w-0 pr-1">
              <h2 id="auth-modal-title" className="text-sm font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                {t("title")}
              </h2>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
                {subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100/90 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="px-4 pb-3 pt-1">
            {loginError ? (
              <p className="mb-1.5 text-center text-[11px] font-medium text-red-600" role="alert">
                {t("sessionRefreshFailed")}
              </p>
            ) : null}
            <LoginForm key={next ?? "default"} variant="modal" onSuccess={onSuccess} />
            <p className="mt-1.5 text-center text-[11px] text-zinc-500">
              <Link
                href={`/welcome/forgot-password${authFlowQuery(next)}`}
                className="text-violet-700 hover:underline dark:text-violet-400"
                onClick={onClose}
              >
                {tForm("forgotPassword")}
              </Link>
            </p>
            <p className="mt-2 text-center text-[11px] text-zinc-500">
              {t("noAccount")}{" "}
              <Link
                href={`/welcome/register${authFlowQuery(next)}`}
                className="font-semibold text-violet-700 hover:underline dark:text-violet-400"
                onClick={onClose}
              >
                {t("register")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
