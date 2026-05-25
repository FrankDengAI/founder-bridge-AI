"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";

function VerifyEmailInner() {
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "ok" | "err">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("err");
      setMessage("缺少验证 token");
      return;
    }
    void fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        const j = (await r.json().catch(() => ({}))) as { message?: string; error?: string };
        if (!r.ok) throw new Error(j.error || "验证失败");
        setStatus("ok");
        setMessage(j.message || "邮箱已验证");
      })
      .catch((e: unknown) => {
        setStatus("err");
        setMessage(e instanceof Error ? e.message : "验证失败");
      });
  }, [token]);

  return (
    <AuthCard>
      <h2 className="text-center text-xl font-bold text-zinc-900">邮箱验证</h2>
      {status === "loading" ? (
        <p className="mt-4 text-center text-sm text-zinc-600">正在验证…</p>
      ) : null}
      {status === "ok" ? (
        <div className="mt-4 space-y-3 text-center">
          <p className="text-sm text-emerald-700">{message}</p>
          <Link
            href="/welcome/login?verified=1"
            className="inline-flex rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white"
          >
            去登录
          </Link>
        </div>
      ) : null}
      {status === "err" ? (
        <div className="mt-4 space-y-3 text-center">
          <p className="text-sm text-red-600">{message}</p>
          <Link href="/welcome/login" className="text-sm text-violet-700 hover:underline">
            返回登录
          </Link>
        </div>
      ) : null}
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <Suspense fallback={<p className="text-center text-sm text-zinc-500">加载中…</p>}>
        <VerifyEmailInner />
      </Suspense>
    </div>
  );
}
