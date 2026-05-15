"use client";

import { usePathname } from "next/navigation";
import clsx from "clsx";

const COMPACT_PREFIXES = ["/welcome/login", "/welcome/register", "/welcome/guest"] as const;

function isCompactWelcomePath(pathname: string) {
  const base = pathname.replace(/\/$/, "") || "/";
  return COMPACT_PREFIXES.some((p) => base === p);
}

export function WelcomeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const compact = isCompactWelcomePath(pathname);

  return (
    <div
      className={clsx(
        "welcome-aurora min-h-screen overflow-x-hidden",
        compact ? "welcome-aurora--soft scheme-light" : "scheme-dark",
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-[18%] top-[8%] h-[min(88vw,440px)] w-[min(88vw,440px)] rounded-full bg-violet-500/30 blur-[110px] motion-safe:animate-float-a" />
        <div className="absolute -right-[12%] top-[35%] h-[min(75vw,380px)] w-[min(75vw,380px)] rounded-full bg-fuchsia-500/25 blur-[100px] motion-safe:animate-float-b" />
        <div className="absolute bottom-[5%] left-[20%] h-[min(70vw,320px)] w-[min(70vw,320px)] rounded-full bg-cyan-400/15 blur-[90px] motion-safe:animate-float-c" />
      </div>
      <div className="welcome-starfield absolute inset-0 z-[1]" />
      <div className="welcome-noise absolute inset-0 z-[1] opacity-[0.035]" />
      <div className="welcome-vignette absolute inset-0 z-[1]" />
      <div className="welcome-shoot absolute left-0 top-[19%] z-[1] motion-reduce:hidden" />
      <div
        className={clsx(
          "relative z-[2] mx-auto flex min-h-screen max-w-lg flex-col px-4",
          compact ? "py-6 sm:py-10" : "py-10",
        )}
      >
        {!compact ? (
          <div className="mb-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-violet-200/95 drop-shadow-[0_0_12px_rgba(167,139,250,0.5)]">
              VibeCoding
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white drop-shadow-[0_0_40px_rgba(139,92,246,0.45)] sm:text-4xl">
              <span className="text-holo">欢迎登舰</span>
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
              登录 / 注册 / 先选兴趣，解锁底部 Tab、命令面板与极光工作台体验。
            </p>
          </div>
        ) : (
          <div className="mb-6 text-center sm:mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-600/90 dark:text-violet-300/90">
              VibeCoding
            </p>
          </div>
        )}
        <div className={clsx("flex-1", compact && "flex min-h-0 flex-col")}>{children}</div>
      </div>
    </div>
  );
}
