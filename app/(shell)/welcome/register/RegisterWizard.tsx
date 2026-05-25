"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import clsx from "clsx";
import { ROLES, type Role } from "@/lib/domain/role";
import { ROLE_LABEL } from "@/lib/labels";
import { INTEREST_OPTIONS } from "@/lib/interestPool";
import { roleToPersona, writePersona } from "@/lib/retention";
import { syncLocalUserId } from "@/lib/clientSession";

const STEPS = ["账号", "昵称", "角色", "兴趣"] as const;

export function RegisterWizard() {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<Role>("ADC");
  const [tags, setTags] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || "注册失败");
      }
      const data = (await res.json()) as { userId: string };
      writePersona(roleToPersona(role));
      syncLocalUserId(data.userId);
      window.location.href = "/home";
    } catch (e) {
      setErr(e instanceof Error ? e.message : "注册失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
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
            账号（字母开头，3–32 位）
            <input
              type="text"
              autoComplete="username"
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="例如：xiaolin"
            />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            密码（至少 8 位）
            <input
              type="password"
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            确认密码
            <input
              type="password"
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          {password && confirmPassword && password !== confirmPassword ? (
            <p className="text-xs text-red-600">两次密码不一致</p>
          ) : null}
        </div>
      ) : null}

      {step === 1 ? (
        <label className="block text-xs font-semibold text-zinc-600">
          昵称
          <input
            className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="例如：小林"
          />
        </label>
      ) : null}

      {step === 2 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-600">创业角色</p>
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
                {ROLE_LABEL[r]}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-600">兴趣标签（多选）</p>
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
          上一步
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            disabled={
              busy ||
              (step === 0 && !canNextStep0) ||
              (step === 1 && !displayName.trim())
            }
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            className="flex-1 rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            下一步
          </button>
        ) : (
          <button
            type="button"
            disabled={tags.length === 0 || busy}
            onClick={() => void submit()}
            className="flex-1 rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {busy ? "注册中…" : "完成注册"}
          </button>
        )}
      </div>

      <p className="text-center text-xs text-zinc-500">
        已有账号？{" "}
        <Link href="/welcome/login" className="font-semibold text-violet-700 hover:underline">
          去登录
        </Link>
      </p>
    </div>
  );
}
