"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const j = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
      if (!res.ok) throw new Error(j.error || "请求失败");
      setMsg(j.message || "若该邮箱已注册，你将收到重置邮件。");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "请求失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <Link href="/welcome/login" className="text-sm text-zinc-600 hover:text-zinc-900">
        ← 返回登录
      </Link>
      <AuthCard>
        <h2 className="text-center text-xl font-bold text-zinc-900">忘记密码</h2>
        <p className="mt-2 text-center text-sm text-zinc-500">输入注册邮箱，我们将发送重置链接。</p>
        <label className="mt-6 block text-xs font-semibold text-zinc-600">
          邮箱
          <input
            type="email"
            className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {msg ? <p className="mt-3 text-sm text-emerald-700">{msg}</p> : null}
        {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
        <button
          type="button"
          disabled={!email.trim() || busy}
          onClick={() => void submit()}
          className="mt-5 w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white disabled:opacity-45"
        >
          {busy ? "发送中…" : "发送重置邮件"}
        </button>
      </AuthCard>
    </div>
  );
}
