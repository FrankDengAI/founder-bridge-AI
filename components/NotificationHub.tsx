"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Bell, BellRing, CheckCheck, Sparkles } from "lucide-react";
import clsx from "clsx";
import {
  loadLocalNotifs,
  saveLocalNotifs,
  type LocalNotif,
} from "@/lib/notificationsLocal";

type Notif = LocalNotif;

type Props = {
  size?: "default" | "compact";
};

export function NotificationHub({ size = "default" }: Props) {
  const t = useTranslations("notifications");
  const compact = size === "compact";
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notif[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setItems(loadLocalNotifs());
    sync();
    window.addEventListener("vibe-notifs-updated", sync);
    return () => window.removeEventListener("vibe-notifs-updated", sync);
  }, []);

  const unread = items.filter((n) => !n.read).length;

  const markAll = useCallback(() => {
    const next = items.map((n) => ({ ...n, read: true }));
    setItems(next);
    saveLocalNotifs(next);
  }, [items]);

  const toggleOne = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
      saveLocalNotifs(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="pointer-events-auto relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "relative flex items-center justify-center shadow-sm ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
          compact ? "h-8 w-8 rounded-lg" : "h-11 w-11 rounded-2xl shadow-lg",
          unread
            ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white ring-white/30 hover:brightness-110"
            : "bg-white/90 text-zinc-800 ring-zinc-200/80 hover:bg-white dark:bg-zinc-900/90 dark:text-zinc-100 dark:ring-zinc-700",
        )}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? "vibe-notification-panel" : undefined}
        aria-label={t("hubLabel")}
      >
        {unread ? (
          <BellRing className={clsx(compact ? "h-4 w-4" : "h-5 w-5", "motion-safe:animate-pulse")} />
        ) : (
          <Bell className={compact ? "h-4 w-4" : "h-5 w-5"} />
        )}
        {unread ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-amber-950 ring-2 ring-white dark:ring-zinc-950">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-transparent"
            aria-label={t("closeOverlay")}
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            id="vibe-notification-panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby="vibe-notification-title"
            className="absolute right-0 top-[calc(100%+8px)] z-[70] w-[min(100vw-2rem,360px)] overflow-hidden rounded-3xl border border-white/50 bg-white/95 shadow-[0_24px_80px_-20px_rgba(109,40,217,0.45)] ring-1 ring-violet-200/40 backdrop-blur-2xl dark:border-zinc-700/80 dark:bg-zinc-950/95 dark:ring-violet-900/40"
          >
            <div className="flex items-center justify-between gap-2 border-b border-zinc-100/80 bg-gradient-to-r from-violet-600/10 via-fuchsia-500/10 to-cyan-500/10 px-4 py-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-600" aria-hidden />
                <span id="vibe-notification-title" className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  {t("title")}
                </span>
              </div>
              <button
                type="button"
                onClick={markAll}
                className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-zinc-700 ring-1 ring-zinc-200/80 hover:bg-white dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-700"
              >
                <CheckCheck className="h-3 w-3" />
                {t("markAllRead")}
              </button>
            </div>
            <ul className="max-h-[min(60vh,320px)] divide-y divide-zinc-100 overflow-y-auto dark:divide-zinc-800">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => toggleOne(n.id)}
                    className={clsx(
                      "flex w-full flex-col gap-1 px-4 py-3 text-left transition",
                      n.read ? "bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/50" : "bg-violet-50/50 hover:bg-violet-50 dark:bg-violet-950/20 dark:hover:bg-violet-950/35",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{n.title}</span>
                      <span className="shrink-0 text-[10px] text-zinc-400">{n.at}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">{n.body}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
