"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { Link } from "@/i18n/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { syncLocalUserId } from "@/lib/clientSession";
import { VBC_AUTH_POST_MESSAGE } from "@/lib/constants";
import { useModePickerHref } from "@/lib/hooks/useModePickerHref";

type DemoRow = { id: string; displayName: string };

function isServiceError(message: string): boolean {
  return /SESSION_SECRET|数据库未连接|数据库表结构|迁移配置|服务暂时不可用|schema/i.test(
    message,
  );
}

function LoginError({ message }: { message: string }) {
  const adminHint = isServiceError(message);

  if (adminHint) {
    return (
      <div
        role="alert"
        className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      >
        <p className="font-semibold">暂时无法完成登录</p>
        <p className="mt-1 leading-relaxed text-amber-900/90">
          服务端认证尚未就绪，不是你的账号或密码问题。请稍后再试，或联系站点管理员完成部署配置。
        </p>
        <details className="mt-2 text-xs text-amber-900/80">
          <summary className="cursor-pointer select-none font-medium">管理员排查</summary>
          <p className="mt-1.5 leading-relaxed">{message}</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>
              Render Dashboard → Environment → 添加{" "}
              <span className="font-mono">SESSION_SECRET</span>（至少 16 位随机字符串）
            </li>
            <li>确认已配置 DATABASE_URL 且部署日志中 migrate deploy 成功</li>
            <li>保存环境变量后点击 Manual Deploy 重新部署</li>
          </ul>
        </details>
      </div>
    );
  }

  return (
    <p role="alert" className="mt-4 text-sm font-medium text-red-600">
      {message}
    </p>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const embed = searchParams.get("embed") === "1";
  const modeHref = useModePickerHref();

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
        throw new Error(j.error || (res.status === 503 ? "数据库未连接，请联系管理员配置 DATABASE_URL" : "登录失败"));
      }
      if (!j.userId) throw new Error("登录响应无效");
      syncLocalUserId(j.userId);
      if (embed && typeof window !== "undefined" && window.parent !== window) {
        window.parent.postMessage(
          { type: VBC_AUTH_POST_MESSAGE, userId: j.userId },
          window.location.origin,
        );
      }
      window.location.href = modeHref("/home");
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
      if (embed && typeof window !== "undefined" && window.parent !== window) {
        window.parent.postMessage(
          { type: VBC_AUTH_POST_MESSAGE, userId: data.userId },
          window.location.origin,
        );
      }
      window.location.href = modeHref("/home");
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
            使用注册的账号与密码登录。还没有账号请先注册。
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block text-xs font-semibold text-zinc-600">
            账号
            <input
              type="text"
              autoComplete="username"
              autoFocus={!embed}
              disabled={busy}
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 disabled:bg-zinc-50 disabled:text-zinc-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="注册时填写的账号"
            />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            密码
            <input
              type="password"
              autoComplete="current-password"
              disabled={busy}
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 disabled:bg-zinc-50 disabled:text-zinc-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
              onKeyDown={(e) => e.key === "Enter" && canSubmit && void submitLogin()}
            />
          </label>
        </div>

        {err ? <LoginError message={err} /> : null}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => void submitLogin()}
          className="mt-5 w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {busy ? "登录中…" : "登 录"}
        </button>

        {!embed ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-zinc-100 pt-5 text-xs font-medium text-zinc-500">
            <Link href="/welcome/register" className="text-violet-700 hover:text-violet-900">
              注册新账号
            </Link>
            <span className="hidden text-zinc-300 sm:inline" aria-hidden>
              ·
            </span>
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
