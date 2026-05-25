"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";

function ResetPasswordInner() {
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    if (password !== confirm) {
      setErr("两次密码不一致");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(j.error || "重置失败");
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "重置失败");
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <AuthCard>
        <p className="text-center text-sm text-red-600">链接无效，请从邮件重新打开。</p>
        <Link href="/welcome/forgot-password" className="mt-4 block text-center text-sm text-violet-700">
          重新申请重置
        </Link>
      </AuthCard>
    );
  }

  if (done) {
    return (
      <AuthCard>
        <p className="text-center text-sm text-emerald-700">密码已更新，请登录。</p>
        <Link
          href="/welcome/login"
          className="mt-4 block text-center text-sm font-semibold text-zinc-900"
        >
          去登录
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <h2 className="text-center text-xl font-bold text-zinc-900">设置新密码</h2>
      <label className="mt-6 block text-xs font-semibold text-zinc-600">
        新密码（至少 8 位）
        <input
          type="password"
          className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label className="mt-3 block text-xs font-semibold text-zinc-600">
        确认密码
        <input
          type="password"
          className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </label>
      {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
      <button
        type="button"
        disabled={busy || password.length < 8}
        onClick={() => void submit()}
        className="mt-5 w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white disabled:opacity-45"
      >
        {busy ? "保存中…" : "更新密码"}
      </button>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <Link href="/welcome/login" className="text-sm text-zinc-600 hover:text-zinc-900">
        ← 返回登录
      </Link>
      <Suspense fallback={<p className="text-center text-sm text-zinc-500">加载中…</p>}>
        <ResetPasswordInner />
      </Suspense>
    </div>
  );
}
