"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { AuthCard } from "@/components/auth/AuthCard";
import { syncLocalUserId } from "@/lib/clientSession";
import { VBC_AUTH_POST_MESSAGE } from "@/lib/constants";

type DemoRow = { id: string; displayName: string };

export function LoginForm() {
  const searchParams = useSearchParams();
  const embed = searchParams.get("embed") === "1";
  const verified = searchParams.get("verified") === "1";

  const [email, setEmail] = useState("");
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

  const canSubmit = Boolean(email.trim() && password) && !busy;

  const submitEmail = async () => {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || "登录失败");
      }
      const data = (await res.json()) as { userId: string };
      syncLocalUserId(data.userId);
      if (embed && typeof window !== "undefined" && window.parent !== window) {
        window.parent.postMessage(
          { type: VBC_AUTH_POST_MESSAGE, userId: data.userId },
          "*",
        );
      }
      window.location.href = "/home";
    } catch (e) {
      setErr(e instanceof Error ? e.message : "登录失败");
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
        throw new Error(j.error || "演示登录失败");
      }
      const data = (await res.json()) as { userId: string };
      syncLocalUserId(data.userId);
      window.location.href = "/home";
    } catch (e) {
      setErr(e instanceof Error ? e.message : "演示登录失败");
    } finally {
      setBusy(false);
    }
  };

  const selectedDemo = useMemo(
    () => demoUsers.find((u) => u.id === demoUserId),
    [demoUsers, demoUserId],
  );

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      {!embed ? (
        <Link
          href="/welcome"
          className="inline-flex w-fit text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          ← 返回
        </Link>
      ) : null}

      <AuthCard>
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
            登录 VibeCoding
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            使用注册邮箱与密码登录。新用户请先注册并验证邮箱。
          </p>
        </div>

        {verified ? (
          <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
            邮箱已验证，请登录。
          </p>
        ) : null}

        <div className="mt-6 space-y-4">
          <label className="block text-xs font-semibold text-zinc-600">
            邮箱
            <input
              type="email"
              autoComplete="email"
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            密码
            <input
              type="password"
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
            />
          </label>
        </div>

        {err ? <p className="mt-3 text-sm font-medium text-red-600">{err}</p> : null}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => void submitEmail()}
          className="mt-5 w-full rounded-full bg-zinc-900 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-800 disabled:opacity-45"
        >
          {busy ? "登录中…" : "登 录"}
        </button>

        {!embed ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-zinc-100 pt-5 text-xs font-medium text-zinc-500">
            <Link href="/welcome/register" className="text-zinc-700 hover:text-violet-700">
              注册新账号
            </Link>
            <span className="text-zinc-300">|</span>
            <Link href="/welcome/forgot-password" className="hover:text-violet-700">
              忘记密码
            </Link>
          </div>
        ) : null}

        {demoEnabled ? (
          <div className="mt-6 border-t border-zinc-100 pt-5">
            <button
              type="button"
              onClick={() => setShowDemo((v) => !v)}
              className="text-xs font-semibold text-zinc-500 hover:text-violet-700"
            >
              {showDemo ? "收起演示模式" : "演示模式（staging）"}
            </button>
            {showDemo ? (
              <div className="mt-3 space-y-3 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-3">
                <p className="text-[11px] text-amber-950">
                  选择演示账号，口令为 demo 或留空。
                </p>
                <ul className="max-h-40 space-y-1 overflow-y-auto">
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
                    placeholder="演示口令 demo"
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs"
                  />
                ) : null}
                <button
                  type="button"
                  disabled={busy || !demoUserId}
                  onClick={() => void submitDemo()}
                  className="w-full rounded-full bg-amber-900 py-2 text-xs font-semibold text-white disabled:opacity-40"
                >
                  演示登录
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </AuthCard>
    </div>
  );
}