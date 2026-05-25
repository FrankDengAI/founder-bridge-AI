"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { AuthCard } from "@/components/auth/AuthCard";
import { syncLocalUserId } from "@/lib/clientSession";
import { VBC_AUTH_POST_MESSAGE } from "@/lib/constants";

type Row = { id: string; displayName: string };

type Tab = "account" | "password";

type UserListState = "loading" | "ready" | "empty" | "error";

export function LoginForm() {
  const searchParams = useSearchParams();
  const embed = searchParams.get("embed") === "1";

  const [users, setUsers] = useState<Row[]>([]);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("demo");
  const [tab, setTab] = useState<Tab>("account");
  const [agree, setAgree] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [userListState, setUserListState] = useState<UserListState>("loading");

  const loadUsers = useCallback(() => {
    setUserListState("loading");
    setErr(null);
    void fetch("/api/auth/users")
      .then(async (r) => {
        if (!r.ok) {
          const raw = await r.text().catch(() => "");
          let msg = raw.trim() || `请求失败（${r.status}）`;
          try {
            const j = JSON.parse(raw) as { message?: string };
            if (typeof j?.message === "string" && j.message.trim()) msg = j.message.trim();
          } catch {
            /* 非 JSON 时用原文 */
          }
          throw new Error(msg);
        }
        return r.json() as Promise<{ users: Row[] }>;
      })
      .then((d) => {
        const list = d.users ?? [];
        setUsers(list);
        if (list.length) {
          setUserId((prev) => (prev && list.some((u) => u.id === prev) ? prev : list[0].id));
          setUserListState("ready");
        } else {
          setUserId("");
          setUserListState("empty");
        }
      })
      .catch(() => {
        setUsers([]);
        setUserId("");
        setUserListState("error");
        setErr(
          "无法加载演示账号列表。请确认服务器已配置 DATABASE_URL、迁移已成功，并执行 npm run db:seed。",
        );
      });
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const selected = useMemo(
    () => users.find((u) => u.id === userId),
    [users, userId],
  );

  const canSubmit =
    userListState === "ready" && Boolean(userId) && agree && !busy;

  const submit = async () => {
    if (!agree) {
      setErr("请先勾选同意演示用户协议");
      return;
    }
    if (!userId) {
      setErr("请先选择一个演示账号");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, password }),
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
            演示环境：选择账号进入；口令为{" "}
            <span className="rounded bg-violet-100 px-1 font-mono text-violet-800">
              demo
            </span>{" "}
            或留空。
          </p>
        </div>

        {userListState === "empty" || userListState === "error" ? (
          <div
            className={clsx(
              "mt-4 rounded-2xl border px-3 py-3 text-xs leading-relaxed",
              userListState === "error"
                ? "border-red-200 bg-red-50 text-red-950"
                : "border-amber-200/80 bg-amber-50 text-amber-950",
            )}
          >
            {userListState === "error" ? (
              <p>{err ?? "无法加载账号列表。"}</p>
            ) : (
              <p>
                当前数据库中还没有演示用户，登录按钮会保持不可用。请在能访问同一{" "}
                <span className="font-mono">DATABASE_URL</span> 的环境执行一次{" "}
                <span className="font-mono font-semibold">npm run db:seed</span>
                ，然后点下方「重新加载」。
              </p>
            )}
          </div>
        ) : null}

        <div className="mt-6 flex rounded-xl bg-zinc-100 p-1">
          <button
            type="button"
            onClick={() => setTab("account")}
            className={clsx(
              "flex-1 rounded-lg py-2.5 text-sm font-semibold transition",
              tab === "account"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800",
            )}
          >
            演示账号
          </button>
          <button
            type="button"
            onClick={() => setTab("password")}
            className={clsx(
              "flex-1 rounded-lg py-2.5 text-sm font-semibold transition",
              tab === "password"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800",
            )}
          >
            口令
          </button>
        </div>

        {tab === "account" ? (
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-zinc-500">选择账号</p>
              <button
                type="button"
                onClick={() => loadUsers()}
                disabled={userListState === "loading"}
                className="text-xs font-semibold text-violet-600 hover:underline disabled:opacity-40"
              >
                重新加载
              </button>
            </div>
            {userListState === "loading" ? (
              <p className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-4 text-center text-sm text-zinc-500">
                正在加载演示账号…
              </p>
            ) : null}
            <ul className="max-h-[min(52vh,320px)] space-y-2 overflow-y-auto pr-0.5">
              {users.map((u) => {
                const active = u.id === userId;
                return (
                  <li key={u.id}>
                    <button
                      type="button"
                      onClick={() => setUserId(u.id)}
                      className={clsx(
                        "flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition",
                        active
                          ? "border-violet-400 bg-violet-50 ring-1 ring-violet-200"
                          : "border-zinc-200/90 bg-white hover:border-zinc-300",
                      )}
                    >
                      <Image
                        src={`https://i.pravatar.cc/96?u=${encodeURIComponent(u.id)}`}
                        alt=""
                        width={44}
                        height={44}
                        className="h-11 w-11 shrink-0 rounded-full bg-zinc-100 object-cover"
                        unoptimized
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-zinc-900">
                          {u.displayName}
                        </span>
                        <span className="block truncate font-mono text-[11px] text-zinc-400">
                          {u.id}
                        </span>
                      </span>
                      {active ? (
                        <span className="shrink-0 text-xs font-bold text-violet-600">当前</span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {selected ? (
              <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                <Image
                  src={`https://i.pravatar.cc/96?u=${encodeURIComponent(selected.id)}`}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                  unoptimized
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900">
                    {selected.displayName}
                  </p>
                  <p className="truncate font-mono text-[11px] text-zinc-500">{selected.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTab("account")}
                  className="ml-auto shrink-0 text-xs font-semibold text-violet-600 hover:underline"
                >
                  更换
                </button>
              </div>
            ) : null}
            <label className="block text-xs font-semibold text-zinc-600">
              演示口令
              <input
                type="password"
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none ring-violet-500/0 transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入 demo"
                autoComplete="off"
              />
            </label>
          </div>
        )}

        <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-left">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
          />
          <span className="text-xs leading-relaxed text-zinc-500">
            已阅读并同意
            <span className="font-medium text-zinc-700">《演示用户协议》</span>
            （非真实法律文件，仅用于界面演示）
          </span>
        </label>

        {err && userListState !== "error" ? (
          <p className="mt-3 text-sm font-medium text-red-600">{err}</p>
        ) : null}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => void submit()}
          className="mt-5 w-full rounded-full bg-zinc-900 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-800 disabled:opacity-45"
        >
          {busy
            ? "登录中…"
            : userListState === "loading"
              ? "加载账号…"
              : userListState === "error"
                ? "无法登录（未加载账号）"
                : userListState === "empty"
                  ? "暂无演示账号"
                  : !agree
                    ? "请先勾选协议"
                    : "登 录"}
        </button>

        {!embed ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-zinc-100 pt-5 text-xs font-medium text-zinc-500">
            <Link href="/welcome/register" className="text-zinc-700 hover:text-violet-700">
              注册新账号
            </Link>
            <span className="text-zinc-300">|</span>
            <Link href="/welcome/guest" className="hover:text-violet-700">
              先选兴趣
            </Link>
            <span className="text-zinc-300">|</span>
            <Link href="/welcome" className="hover:text-violet-700">
              更多方式
            </Link>
          </div>
        ) : null}
      </AuthCard>
    </div>
  );
}
