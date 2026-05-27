"use client";

import { usePathname } from "@/i18n/navigation";
import clsx from "clsx";
import { WelcomeSessionReset } from "@/components/view-mode/WelcomeSessionReset";
import { stripLocalePrefix } from "@/lib/localePath";

const COMPACT_PREFIXES = [
  "/welcome/login",
  "/welcome/register",
  "/welcome/guest",
  "/welcome/mode",
  "/welcome/forgot-password",
] as const;

function isCompactWelcomePath(pathname: string) {
  const base = stripLocalePrefix(pathname).replace(/\/$/, "") || "/";
  if (base === "/welcome/mode") return false;
  return COMPACT_PREFIXES.some((p) => base === p);
}

export function WelcomeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const base = stripLocalePrefix(pathname).replace(/\/$/, "") || "/";
  const isModePage = base === "/welcome/mode";
  const compact = isCompactWelcomePath(pathname);

  return (
    <div className="welcome-aurora welcome-aurora--soft min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-[18%] top-[8%] h-[min(88vw,440px)] w-[min(88vw,440px)] rounded-full bg-violet-500/30 blur-[110px] motion-safe:animate-float-a" />
        <div className="absolute -right-[12%] top-[35%] h-[min(75vw,380px)] w-[min(75vw,380px)] rounded-full bg-fuchsia-500/25 blur-[100px] motion-safe:animate-float-b" />
        <div className="absolute bottom-[5%] left-[20%] h-[min(70vw,320px)] w-[min(70vw,320px)] rounded-full bg-cyan-400/15 blur-[90px] motion-safe:animate-float-c" />
      </div>
      <div className="welcome-starfield absolute inset-0 z-[1]" />
      <div className="welcome-noise absolute inset-0 z-[1] opacity-[0.035]" />
      <div className="welcome-vignette absolute inset-0 z-[1]" />
      <WelcomeSessionReset />
      <div className="welcome-shoot absolute left-0 top-[19%] z-[1] motion-reduce:hidden" />
      <div
        className={clsx(
          "relative z-[2] mx-auto flex min-h-screen flex-col px-4",
          isModePage ? "max-w-2xl" : "max-w-lg",
          compact ? "py-6 sm:py-10" : "py-10",
        )}
      >
        {isModePage ? (
          <div className="mb-2 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-violet-600/90">
              VibeCoding
            </p>
          </div>
        ) : !compact ? (
          <div className="mb-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-violet-600/90">
              VibeCoding
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              <span className="text-holo">欢迎登舰</span>
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-600">
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
