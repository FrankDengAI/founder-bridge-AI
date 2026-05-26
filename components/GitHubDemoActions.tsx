"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Loader2, PlugZap, Unplug, XCircle } from "lucide-react";
import clsx from "clsx";

const LS_KEY = "vibe_github_demo_connected";

type ConnState = "disconnected" | "connecting" | "connected" | "error";

function readLs(): ConnState {
  if (typeof window === "undefined") return "disconnected";
  try {
    return localStorage.getItem(LS_KEY) === "1" ? "connected" : "disconnected";
  } catch {
    return "disconnected";
  }
}

/** 演示用 localStorage 状态机；生产环境可替换为 GitHub OAuth App */
export function GitHubDemoActions() {
  const [state, setState] = useState<ConnState>("disconnected");

  useEffect(() => {
    setState(readLs());
  }, []);

  const disconnect = useCallback(() => {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      /* ignore */
    }
    setState("disconnected");
  }, []);

  const simulateFail = useCallback(() => {
    setState("error");
  }, []);

  const simulateConnect = useCallback(() => {
    setState("connecting");
    window.setTimeout(() => {
      try {
        localStorage.setItem(LS_KEY, "1");
      } catch {
        /* ignore */
      }
      setState("connected");
    }, 650);
  }, []);

  return (
    <div className="space-y-3">
      <div
        className={clsx(
          "flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-[11px] font-semibold ring-1",
          state === "connected" && "bg-emerald-50 text-emerald-900 ring-emerald-200/80",
          state === "connecting" && "bg-amber-50 text-amber-950 ring-amber-200/70",
          state === "error" && "bg-rose-50 text-rose-900 ring-rose-200/80",
          state === "disconnected" && "bg-zinc-50 text-zinc-700 ring-zinc-200/70",
        )}
        role="status"
        aria-live="polite"
      >
        <span>
          {state === "disconnected" && "状态：未连接"}
          {state === "connecting" && "状态：正在连接（演示）…"}
          {state === "connected" && "状态：已连接（仅本机标记）"}
          {state === "error" && "状态：连接失败（可重试）"}
        </span>
        {state === "connecting" ? <Loader2 className="h-4 w-4 shrink-0 motion-safe:animate-spin" /> : null}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {state === "connected" ? (
          <button
            type="button"
            onClick={disconnect}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Unplug className="h-4 w-4" />
            断开连接
          </button>
        ) : (
          <button
            type="button"
            disabled={state === "connecting"}
            onClick={simulateConnect}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <PlugZap className="h-4 w-4" />
            {state === "error" ? "重试连接（演示）" : "模拟连接成功"}
          </button>
        )}
        <Link
          href="/home"
          className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
        >
          返回学习首页
        </Link>
      </div>

      {state !== "connected" ? (
        <button
          type="button"
          disabled={state === "connecting"}
          onClick={simulateFail}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300/90 py-2.5 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:hover:bg-zinc-900/40"
        >
          <XCircle className="h-3.5 w-3.5" />
          演示：模拟 OAuth 失败（不写入连接状态）
        </button>
      ) : null}
    </div>
  );
}
