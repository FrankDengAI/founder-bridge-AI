"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { syncLocalUserId } from "@/lib/clientSession";
import { VBC_AUTH_POST_MESSAGE } from "@/lib/constants";
import { useModePickerHref } from "@/lib/hooks/useModePickerHref";
import { authFlowQuery } from "@/lib/navBack";
import { safeNextPath } from "@/lib/viewMode";

type DemoRow = { id: string; displayName: string };

function isServiceError(message: string): boolean {
  return /SESSION_SECRET|数据库未连接|数据库表结构|迁移配置|服务暂时不可用|schema/i.test(
    message,
  );
}

function LoginError({ message, compact }: { message: string; compact?: boolean }) {
  const t = useTranslations("authForm");
  const adminHint = isServiceError(message);

  if (adminHint) {
    return (
      <div
        role="alert"
        className={clsx(
          "rounded-xl border border-amber-200 bg-amber-50 text-amber-950",
          compact ? "mt-2 px-3 py-2 text-[11px]" : "mt-4 px-4 py-3 text-sm",
        )}
      >
        <p className="font-semibold">{t("serviceErrorTitle")}</p>
        <p className="mt-1 leading-relaxed text-amber-900/90">{t("serviceErrorDesc")}</p>
        <details className="mt-2 text-xs text-amber-900/80">
          <summary className="cursor-pointer select-none font-medium">{t("adminSummary")}</summary>
          <p className="mt-1.5 leading-relaxed">{message}</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>
              {t("adminStartCommand")}{" "}
              <span className="font-mono">node scripts/render-start.cjs</span>
            </li>
            <li>
              {t("adminSessionSecret")}{" "}
              <span className="font-mono">SESSION_SECRET</span>
              {t("adminSessionSecretHint")}
            </li>
            <li>{t("adminDatabase")}</li>
            <li>{t("adminHealth")}</li>
          </ul>
        </details>
      </div>
    );
  }

  return (
    <p
      role="alert"
      className={clsx(
        "font-medium text-red-600",
        compact ? "mt-2 text-[11px] leading-snug" : "mt-4 text-sm",
      )}
    >
      {message}
    </p>
  );
}

type LoginFormProps = {
  variant?: "page" | "modal";
  onSuccess?: (userId: string) => void;
};

export function LoginForm({ variant = "page", onSuccess }: LoginFormProps) {
  const tAuth = useTranslations("auth");
  const tForm = useTranslations("authForm");
  const tModal = useTranslations("authModal");
  const tWelcome = useTranslations("welcome");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const embed = variant === "page" && searchParams.get("embed") === "1";
  const isModal = variant === "modal";
  const modeHref = useModePickerHref();
  const nextRaw = searchParams.get("next");
  const afterLoginPath = safeNextPath(nextRaw, "/home");
  const backTarget = safeNextPath(nextRaw, "/home");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [demoEnabled, setDemoEnabled] = useState(false);
  const [demoUsers, setDemoUsers] = useState<DemoRow[]>([]);
  const [demoUserId, setDemoUserId] = useState("");
  const [demoPassword, setDemoPassword] = useState("demo");
  const [showDemo, setShowDemo] = useState(false);

  const loadDemoUsers = useCallback(() => {
    void fetch("/api/auth/users")
      .then(async (r) => {
        if (!r.ok) return null;
        return r.json() as Promise<{ users: DemoRow[] }>;
      })
      .then((d) => {
        if (!d?.users?.length) return;
        setDemoEnabled(true);
        setDemoUsers(d.users);
        setDemoUserId((prev) =>
          prev && d.users.some((u) => u.id === prev) ? prev : d.users[0].id,
        );
      })
      .catch(() => {
        /* demo login disabled */
      });
  }, []);

  useEffect(() => {
    loadDemoUsers();
  }, [loadDemoUsers]);

  const canSubmit = Boolean(username.trim() && password) && !busy;

  const submitLogin = async () => {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const j = (await res.json().catch(() => ({}))) as { error?: string; userId?: string };
      if (!res.ok) {
        throw new Error(j.error || (res.status === 503 ? tForm("dbNotConnected") : tAuth("loginFail")));
      }
      if (!j.userId) throw new Error(tForm("invalidLoginResponse"));
      syncLocalUserId(j.userId);
      if (isModal && onSuccess) {
        onSuccess(j.userId);
        return;
      }
      if (embed && typeof window !== "undefined" && window.parent !== window) {
        window.parent.postMessage(
          { type: VBC_AUTH_POST_MESSAGE, userId: j.userId },
          window.location.origin,
        );
      }
      window.location.href = modeHref(afterLoginPath);
    } catch (e) {
      setErr(e instanceof Error ? e.message : tAuth("loginFail"));
    } finally {
      setBusy(false);
    }
  };

  const submitDemo = async () => {
    if (!demoUserId) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          demoMode: true,
          userId: demoUserId,
          password: demoPassword,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || tForm("demoLoginFail"));
      }
      const data = (await res.json()) as { userId: string };
      syncLocalUserId(data.userId);
      if (isModal && onSuccess) {
        onSuccess(data.userId);
        return;
      }
      if (embed && typeof window !== "undefined" && window.parent !== window) {
        window.parent.postMessage(
          { type: VBC_AUTH_POST_MESSAGE, userId: data.userId },
          window.location.origin,
        );
      }
      window.location.href = modeHref(afterLoginPath);
    } catch (e) {
      setErr(e instanceof Error ? e.message : tForm("demoLoginFail"));
    } finally {
      setBusy(false);
    }
  };

  const selectedDemo = useMemo(
    () => demoUsers.find((u) => u.id === demoUserId),
    [demoUsers, demoUserId],
  );

  return (
    <div
      className={clsx(
        "mx-auto flex w-full flex-col",
        isModal ? "max-w-none gap-0" : "max-w-md gap-4",
      )}
    >
      {!embed && !isModal ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Link
            href={backTarget}
            className="inline-flex w-fit text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
          >
            ← {backTarget === "/home" ? tForm("backToDiscovery") : tCommon("back")}
          </Link>
          {backTarget === "/home" ? (
            <Link
              href="/welcome"
              className="text-xs font-medium text-zinc-500 hover:text-violet-700"
            >
              {tWelcome("backToWelcomeBoard")}
            </Link>
          ) : null}
        </div>
      ) : null}

      <AuthCard
        className={isModal ? "border-0 p-0 shadow-none ring-0 dark:bg-transparent" : undefined}
      >
        {!isModal ? (
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
              {tWelcome("loginTitle")} VibeCoding
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">{tWelcome("loginDesc")}</p>
          </div>
        ) : null}

        <div className={clsx(isModal ? "space-y-3" : "mt-6 space-y-4")}>
          <label
            className={clsx(
              "block",
              isModal
                ? "text-[11px] font-medium tracking-wide text-zinc-500"
                : "text-xs font-semibold text-zinc-600",
            )}
          >
            {tAuth("username")}
            <input
              type="text"
              autoComplete="username"
              autoFocus={!embed || isModal}
              disabled={busy}
              className={clsx(
                "mt-1 w-full border border-zinc-200/90 bg-white/90 text-zinc-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 disabled:bg-zinc-50 disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100",
                isModal
                  ? "rounded-lg px-3 py-2 text-sm"
                  : "rounded-xl px-3 py-3 text-sm",
              )}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={tAuth("usernameHint")}
            />
          </label>
          <label
            className={clsx(
              "block",
              isModal
                ? "text-[11px] font-medium tracking-wide text-zinc-500"
                : "text-xs font-semibold text-zinc-600",
            )}
          >
            {tAuth("password")}
            <input
              type="password"
              autoComplete="current-password"
              disabled={busy}
              className={clsx(
                "mt-1 w-full border border-zinc-200/90 bg-white/90 text-zinc-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 disabled:bg-zinc-50 disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100",
                isModal
                  ? "rounded-lg px-3 py-2 text-sm"
                  : "rounded-xl px-3 py-3 text-sm",
              )}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tAuth("passwordHint")}
              onKeyDown={(e) => e.key === "Enter" && canSubmit && void submitLogin()}
            />
          </label>
        </div>

        {err ? <LoginError message={err} compact={isModal} /> : null}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => void submitLogin()}
          className={clsx(
            "w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 font-semibold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45",
            isModal ? "mt-3 py-2.5 text-sm" : "mt-5 py-3.5 text-sm shadow-lg",
          )}
        >
          {busy ? tCommon("loading") : isModal ? tModal("submitContinue") : tAuth("submitLogin")}
        </button>

        {!embed && !isModal ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-zinc-100 pt-5 text-xs font-medium text-zinc-500">
            <Link
              href={`/welcome/register${authFlowQuery(nextRaw)}`}
              className="text-violet-700 hover:text-violet-900"
            >
              {tAuth("register")}
            </Link>
            <span className="hidden text-zinc-300 sm:inline" aria-hidden>
              ·
            </span>
            <Link
              href={`/welcome/forgot-password${authFlowQuery(nextRaw)}`}
              className="hover:text-violet-700"
            >
              {tForm("forgotPassword")}
            </Link>
          </div>
        ) : null}

        {demoEnabled ? (
          <div
            className={clsx(
              "border-t border-zinc-100 dark:border-zinc-800",
              isModal ? "mt-4 pt-3" : "mt-6 pt-5",
            )}
          >
            <button
              type="button"
              onClick={() => setShowDemo((v) => !v)}
              className="text-xs font-semibold text-zinc-500 hover:text-violet-700"
            >
              {showDemo ? tForm("demoToggleClose") : tForm("demoToggleOpen")}
            </button>
            {showDemo ? (
              <div className="mt-3 space-y-3 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-3">
                <p className="text-[11px] text-amber-950">{tForm("demoDesc")}</p>
                <ul
                  className={clsx(
                    "space-y-1 overflow-y-auto",
                    isModal ? "max-h-28" : "max-h-40",
                  )}
                >
                  {demoUsers.map((u) => (
                    <li key={u.id}>
                      <button
                        type="button"
                        onClick={() => setDemoUserId(u.id)}
                        className={clsx(
                          "flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-xs",
                          u.id === demoUserId
                            ? "bg-violet-100 font-semibold"
                            : "hover:bg-white",
                        )}
                      >
                        <Image
                          src={`https://i.pravatar.cc/48?u=${encodeURIComponent(u.id)}`}
                          alt=""
                          width={28}
                          height={28}
                          className="rounded-full"
                          unoptimized
                        />
                        {u.displayName}
                      </button>
                    </li>
                  ))}
                </ul>
                {selectedDemo ? (
                  <input
                    type="password"
                    value={demoPassword}
                    onChange={(e) => setDemoPassword(e.target.value)}
                    placeholder={tForm("demoPasswordPlaceholder")}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs"
                  />
                ) : null}
                <button
                  type="button"
                  disabled={busy || !demoUserId}
                  onClick={() => void submitDemo()}
                  className="w-full rounded-full bg-amber-900 py-2 text-xs font-semibold text-white disabled:opacity-40"
                >
                  {tForm("demoEnter")}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </AuthCard>
    </div>
  );
}
