"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { safeNextPath } from "@/lib/viewMode";
import { useTranslations } from "next-intl";
import {
  AtSign,
  Check,
  Code2,
  HeartHandshake,
  Lock,
  Rocket,
  Sparkles,
  UserRound,
} from "lucide-react";
import clsx from "clsx";
import { ROLES, type Role } from "@/lib/domain/role";
import { getRoleLabel, getRoleMatchDesc } from "@/lib/labels";
import { INTEREST_OPTIONS } from "@/lib/interestPool";
import { roleToPersona, writePersona } from "@/lib/retention";
import { syncLocalUserId } from "@/lib/clientSession";
import { useModePickerHref } from "@/lib/hooks/useModePickerHref";

const STEP_KEYS = ["regStepAccount", "regStepNickname", "regStepRole", "regStepInterest"] as const;

const ROLE_ICON: Record<Role, typeof Code2> = {
  JUNGLE: Rocket,
  SUPPORT: HeartHandshake,
  ADC: Code2,
};

type Props = {
  step: number;
  onStepChange: (step: number) => void;
};

function Stepper({
  steps,
  current,
  busy,
  onJump,
}: {
  steps: string[];
  current: number;
  busy: boolean;
  onJump: (index: number) => void;
}) {
  return (
    <ol className="flex items-start justify-between gap-1" aria-label="Registration steps">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex min-w-0 flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {i > 0 ? (
                <span
                  className={clsx(
                    "h-0.5 flex-1 rounded-full transition-colors",
                    done || active ? "bg-violet-400" : "bg-zinc-200",
                  )}
                  aria-hidden
                />
              ) : (
                <span className="flex-1" aria-hidden />
              )}
              <button
                type="button"
                disabled={busy || i > current}
                onClick={() => {
                  if (i < current) onJump(i);
                }}
                className={clsx(
                  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition",
                  done &&
                    "cursor-pointer bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 hover:bg-emerald-600",
                  active &&
                    "bg-white text-violet-700 ring-2 ring-violet-500 ring-offset-2 ring-offset-violet-600",
                  !done &&
                    !active &&
                    "bg-white/20 text-white/70",
                  i < current && !busy && "cursor-pointer",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : i + 1}
              </button>
              {i < steps.length - 1 ? (
                <span
                  className={clsx(
                    "h-0.5 flex-1 rounded-full transition-colors",
                    i < current ? "bg-violet-400" : "bg-white/25",
                  )}
                  aria-hidden
                />
              ) : (
                <span className="flex-1" aria-hidden />
              )}
            </div>
            <span
              className={clsx(
                "mt-2 hidden max-w-[4.5rem] truncate text-center text-[10px] font-semibold leading-tight sm:block",
                active ? "text-white" : done ? "text-violet-100" : "text-white/55",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Field({
  label,
  icon: Icon,
  children,
  hint,
}: {
  label: string;
  icon: typeof UserRound;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-zinc-700">{label}</span>
      {hint ? <p className="mt-0.5 text-[11px] text-zinc-500">{hint}</p> : null}
      <div className="relative mt-2">
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          aria-hidden
        />
        {children}
      </div>
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-zinc-200/90 bg-white py-3 pl-10 pr-3 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15";

export function RegisterWizard({ step, onStepChange }: Props) {
  const t = useTranslations("auth");
  const tr = useTranslations("authRegister");
  const tCommon = useTranslations("common");
  const tRoles = useTranslations("roles");
  const tw = useTranslations("welcome");
  const steps = useMemo(() => STEP_KEYS.map((k) => t(k)), [t]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<Role>("ADC");
  const [tags, setTags] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"), "/home");
  const modeHref = useModePickerHref();

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag],
    );
  };

  const canNextStep0 =
    username.trim().length >= 3 &&
    password.length >= 8 &&
    password === confirmPassword;

  const passwordOk = password.length >= 8;
  const passwordsMatch = !confirmPassword || password === confirmPassword;

  const goBack = () => onStepChange(Math.max(0, step - 1));
  const goNext = () => onStepChange(Math.min(steps.length - 1, step + 1));

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
      window.location.href = modeHref(next);
    } catch (e) {
      setErr(e instanceof Error ? e.message : t("registerFail"));
    } finally {
      setBusy(false);
    }
  };

  const stepHints = [
    tr("stepHintAccount"),
    tr("stepHintNickname"),
    tr("stepHintRole"),
    tr("stepHintInterest"),
  ];

  const totalSteps = steps.length;
  const progressPct = ((step + 1) / totalSteps) * 100;

  return (
    <div className="flex flex-col">
      <div className="bg-gradient-to-br from-violet-600 via-violet-600 to-fuchsia-600 px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white/95 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {tr("heroBadge")}
        </p>
        <h1 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
          {tw("registerTitle")}
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-violet-100/95">{tw("registerDesc")}</p>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] font-medium text-violet-100/90">
          {tr("stepProgress", { current: step + 1, total: totalSteps })}
          <span className="mx-1.5 text-white/40">·</span>
          <span className="text-white">{steps[step]}</span>
        </p>

        <div className="mt-5">
          <Stepper
            steps={steps}
            current={step}
            busy={busy}
            onJump={onStepChange}
          />
        </div>
      </div>

      <div className="space-y-5 px-5 py-6 sm:px-7 sm:py-7">
        <div>
          <h2 className="text-base font-bold text-zinc-900">{steps[step]}</h2>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">{stepHints[step]}</p>
        </div>

        {step === 0 ? (
          <div className="space-y-4">
            <Field label={t("usernameHint")} icon={AtSign}>
              <input
                type="text"
                autoComplete="username"
                autoFocus
                className={inputClass}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={tr("usernamePlaceholder")}
              />
            </Field>
            <Field label={t("passwordHint")} icon={Lock}>
              <input
                type="password"
                autoComplete="new-password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>
            {password ? (
              <div className="flex items-center gap-2 px-0.5">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <span
                      key={n}
                      className={clsx(
                        "h-1 flex-1 rounded-full transition-colors",
                        password.length >= n * 2 ? "bg-violet-500" : "bg-zinc-200",
                      )}
                    />
                  ))}
                </div>
                <span
                  className={clsx(
                    "text-[10px] font-medium",
                    passwordOk ? "text-emerald-600" : "text-zinc-500",
                  )}
                >
                  {passwordOk ? "✓" : "8+"}
                </span>
              </div>
            ) : null}
            <Field label={t("confirmPassword")} icon={Lock}>
              <input
                type="password"
                autoComplete="new-password"
                className={clsx(
                  inputClass,
                  confirmPassword && !passwordsMatch && "border-red-300 focus:border-red-400 focus:ring-red-500/15",
                )}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>
            {confirmPassword && !passwordsMatch ? (
              <p className="text-xs font-medium text-red-600">{t("passwordMismatch")}</p>
            ) : null}
          </div>
        ) : null}

        {step === 1 ? (
          <Field label={t("displayName")} icon={UserRound}>
            <input
              autoFocus
              className={inputClass}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={tr("displayNamePlaceholder")}
            />
          </Field>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-2.5 sm:grid-cols-1">
            {ROLES.map((r) => {
              const Icon = ROLE_ICON[r];
              const selected = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={clsx(
                    "flex gap-3 rounded-2xl border p-3.5 text-left transition",
                    selected
                      ? "border-violet-400 bg-gradient-to-br from-violet-50 to-fuchsia-50/80 shadow-sm ring-1 ring-violet-200"
                      : "border-zinc-200/90 bg-white hover:border-violet-200 hover:bg-violet-50/30",
                  )}
                >
                  <span
                    className={clsx(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      selected
                        ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                        : "bg-zinc-100 text-zinc-600",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-900">
                        {getRoleLabel(tRoles, r)}
                      </span>
                      {selected ? (
                        <Check className="h-4 w-4 text-violet-600" aria-hidden />
                      ) : null}
                    </span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-zinc-600">
                      {getRoleMatchDesc(tRoles, r)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            <p className="text-[11px] text-zinc-500">{tr("interestSectionHint")}</p>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((opt) => {
                const on = tags.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleTag(opt)}
                    className={clsx(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition active:scale-[0.98]",
                      on
                        ? "border-violet-400 bg-violet-600 text-white shadow-sm shadow-violet-500/20"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-violet-200 hover:bg-violet-50/50",
                    )}
                  >
                    {on ? <Check className="h-3.5 w-3.5" /> : null}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {err ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700"
          >
            {err}
          </p>
        ) : null}

        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            disabled={step === 0 || busy}
            onClick={goBack}
            className="min-w-[5.5rem] rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
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
              onClick={goNext}
              className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {tCommon("next")}
            </button>
          ) : (
            <button
              type="button"
              disabled={tags.length === 0 || busy}
              onClick={() => void submit()}
              className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {busy ? tCommon("loading") : t("submitRegister")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
