"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, GraduationCap, Sparkles, UserRound, Wrench } from "lucide-react";
import clsx from "clsx";

const items = [
  { href: "/home", label: "发现", Icon: Compass, tab: "/home" },
  { href: "/learn", label: "学习", Icon: GraduationCap, tab: "/learn" },
  { href: "/tools", label: "工具", Icon: Wrench, tab: "/tools" },
  { href: "/match", label: "匹配", Icon: Sparkles, tab: "/match" },
  { href: "/me", label: "我的", Icon: UserRound, tab: "/me" },
] as const;

function resolveTab(pathname: string) {
  if (pathname.startsWith("/match")) return "/match";
  if (
    pathname.startsWith("/me") ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/creator") ||
    pathname.startsWith("/orders")
  ) {
    return "/me";
  }
  if (pathname.startsWith("/workspace")) return "/home";
  if (pathname.startsWith("/demo")) return "/home";
  if (pathname.startsWith("/tools") || pathname.startsWith("/market")) {
    return "/tools";
  }
  if (pathname.startsWith("/learn")) return "/learn";
  return "/home";
}

export function BottomNav() {
  const pathname = usePathname();
  const tab = resolveTab(pathname);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)]"
      aria-label="主导航"
    >
      <div className="mx-auto max-w-lg px-3">
        <div className="mb-2 rounded-[22px] border border-white/50 bg-white/70 p-1.5 shadow-[0_16px_50px_-24px_rgba(109,40,217,0.55)] backdrop-blur-2xl dark:border-zinc-800/80 dark:bg-zinc-950/75">
          <div className="flex items-stretch justify-around rounded-[18px] bg-gradient-to-r from-zinc-100/50 via-white/40 to-zinc-100/50 p-0.5 dark:from-zinc-900/50 dark:via-zinc-950/40 dark:to-zinc-900/50">
            {items.map((it) => {
              const active = tab === it.tab;
              const Icon = it.Icon;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "relative flex min-w-[56px] flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[11px] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                    active
                      ? "bg-gradient-to-br from-violet-600 via-fuchsia-600 to-violet-700 text-white shadow-lg shadow-fuchsia-500/35 ring-1 ring-white/25"
                      : "text-zinc-600 hover:bg-white/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-100",
                  )}
                >
                  {active ? (
                    <span className="absolute inset-x-3 -top-1 h-1 rounded-full bg-gradient-to-r from-amber-300 via-white to-cyan-200 opacity-90 blur-[2px]" />
                  ) : null}
                  <Icon
                    className={clsx(
                      "h-5 w-5 transition-transform duration-300",
                      active ? "scale-110 text-white drop-shadow" : "text-zinc-500 dark:text-zinc-500",
                    )}
                  />
                  <span className={clsx("relative z-[1]", active && "font-bold tracking-wide")}>
                    {it.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
