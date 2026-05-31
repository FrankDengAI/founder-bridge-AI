"use client";

import { Link } from "@/i18n/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, PlugZap, Unplug } from "lucide-react";
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

export function GitHubDemoActions() {
  const t = useTranslations("github");
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

  const connect = useCallback(() => {
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
          {state === "disconnected" && t("disconnected")}
          {state === "connecting" && t("connecting")}
          {state === "connected" && t("connected")}
          {state === "error" && t("error")}
        </span>
        {state === "connecting" ? (
          <Loader2 className="h-4 w-4 shrink-0 motion-safe:animate-spin" />
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {state === "connected" ? (
          <button
            type="button"
            onClick={disconnect}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Unplug className="h-4 w-4" />
            {t("disconnect")}
          </button>
        ) : (
          <button
            type="button"
            disabled={state === "connecting"}
            onClick={connect}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <PlugZap className="h-4 w-4" />
            {state === "error" ? t("reconnect") : t("connect")}
          </button>
        )}
        <Link
          href="/home"
          className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
        >
          {t("backDiscover")}
        </Link>
      </div>
    </div>
  );
}
