"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Check } from "lucide-react";
import clsx from "clsx";
import { ROLES, type Role } from "@/lib/domain/role";
import { getRoleLabel } from "@/lib/labels";
import { INTEREST_OPTIONS } from "@/lib/interestPool";
import { roleToPersona, writePersona } from "@/lib/retention";
import { syncLocalUserId } from "@/lib/clientSession";
import { useModePickerHref } from "@/lib/hooks/useModePickerHref";

const STEP_KEYS = ["regStepAccount", "regStepNickname", "regStepRole", "regStepInterest"] as const;

export function RegisterWizard() {
  const t = useTranslations("auth");
  const tr = useTranslations("authRegister");
  const tCommon = useTranslations("common");
  const tRoles = useTranslations("roles");
  const steps = useMemo(() => STEP_KEYS.map((k) => t(k)), [t]);
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<Role>("ADC");
  const [tags, setTags] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const modeHref = useModePickerHref();

  const toggleTag = (t: string) => {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const canNextStep0 =
    username.trim().length >= 3 &&
    password.length >= 8 &&
    password === confirmPassword;

  const submit = async () => {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: username.trim(),
          password,
          displayName,
          role,
          interestTags: tags,
        }),
      });
      const j = (await res.json().catch(() => ({}))) as { error?: string; userId?: string };
      if (!res.ok) {
        const hint =
          j.userId && res.status === 503
            ? `${j.error ?? tr("autoLoginFail")}${tr("accountCreatedGoLogin")}`
            : j.error || (res.status === 503 ? tr("dbNotConnected") : tr("registerFail"));
        throw new Error(hint);
      }
      if (!j.userId) throw new Error(tr("registerInvalidResponse"));
      writePersona(roleToPersona(role));
      syncLocalUserId(j.userId);
      window.location.href = modeHref("/home");
    } catch (e) {
      setErr(e instanceof Error ? e.message : t("registerFail"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {steps.map((label, i) => (
          <div
            key={label}
            className={clsx(
              "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
              i === step
                ? "border-violet-300 bg-violet-50 text-violet-900 shadow-sm"
                : i < step
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-zinc-200 bg-zinc-50 text-zinc-500",
            )}
          >
            {i < step ? <Check className="h-4 w-4" /> : <span>{i + 1}</span>}
            {label}
          </div>
        ))}
      </div>

      {step === 0 ? (
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-zinc-600">
            {t("usernameHint")}
            <input
              type="text"
              autoComplete="username"
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={tr("usernamePlaceholder")}
            />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            {t("passwordHint")}
            <input
              type="password"
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            {t("confirmPassword")}
            <input
              type="password"
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          {password && confirmPassword && password !== confirmPassword ? (
            <p className="text-xs text-red-600">{t("passwordMismatch")}</p>
          ) : null}
        </div>
      ) : null}

      {step === 1 ? (
        <label className="block text-xs font-semibold text-zinc-600">
          {t("displayName")}
          <input
            className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={tr("displayNamePlaceholder")}
          />
        </label>
      ) : null}

      {step === 2 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-600">{t("roleSection")}</p>
          <div className="grid gap-2">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={clsx(
                  "rounded-xl border px-3 py-3 text-left text-sm font-semibold transition",
                  role === r
                    ? "border-violet-400 bg-violet-50 text-violet-950 ring-1 ring-violet-200"
                    : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300",
                )}
              >
                {getRoleLabel(tRoles, r)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-600">{t("interestSection")}</p>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                className={clsx(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  tags.includes(t)
                    ? "border-violet-400 bg-violet-50 text-violet-900"
                    : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {err ? <p className="text-sm font-medium text-red-600">{err}</p> : null}

      <div className="flex gap-2">
        <button
          type="button"
          disabled={step === 0 || busy}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="flex-1 rounded-full border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-40"
        >
          {tCommon("back")}
        </button>
        {step < steps.length - 1 ? (
          <button
            type="button"
            disabled={
              busy ||
              (step === 0 && !canNextStep0) ||
              (step === 1 && !displayName.trim())
            }
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
          >
            {tCommon("next")}
          </button>
        ) : (
          <button
            type="button"
            disabled={tags.length === 0 || busy}
            onClick={() => void submit()}
            className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:opacity-50"
          >
            {busy ? tCommon("loading") : t("submitRegister")}
          </button>
        )}
      </div>

      <p className="text-center text-xs text-zinc-500">
        {t("hasAccount")}{" "}
        <Link href="/welcome/login" className="font-semibold text-violet-700 hover:underline">
          {t("goLogin")}
        </Link>
      </p>
    </div>
  );
}
