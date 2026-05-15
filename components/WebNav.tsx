import Link from "next/link";
import { appDemoReady, appShellHref, isExternalMiniapp } from "@/lib/miniappOrigin";

const links = [
  { href: "#vision", label: "愿景" },
  { href: "#features", label: "能力" },
  { href: "#pulse", label: "实时脉动" },
  { href: "#cta", label: "开始" },
] as const;

export function WebNav() {
  const homeHref = appShellHref("/home");
  const external = isExternalMiniapp();
  const appReady = appDemoReady();
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-ink-950/55 shadow-[0_12px_48px_-16px_rgba(0,0,0,0.55)] backdrop-blur-2xl backdrop-saturate-150">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:h-16 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="shrink-0 font-display text-base font-bold tracking-tight text-gradient-anim sm:text-xl"
        >
          VibeCoding
        </Link>
        <nav
          aria-label="页面内导航"
          className="flex min-w-0 flex-1 justify-center gap-3 overflow-x-auto whitespace-nowrap py-1 text-xs font-medium text-slate-400 [scrollbar-width:none] md:gap-8 md:py-0 md:text-sm [&::-webkit-scrollbar]:hidden"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="shrink-0 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/10 sm:px-4 sm:text-sm"
          >
            登录
          </Link>
          {appReady ? (
            <a
              href={homeHref}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="rounded-full border border-violet-400/30 bg-gradient-to-r from-violet-600/90 to-fuchsia-600/90 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_0_24px_-4px_rgba(167,139,250,0.7)] transition hover:brightness-110 sm:px-4 sm:text-sm"
            >
              打开 App 演示
            </a>
          ) : (
            <span
              title="在部署环境设置 NEXT_PUBLIC_MINIAPP_URL 后可用"
              className="cursor-default rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-500 sm:px-4 sm:text-sm"
            >
              App 演示（待配置）
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
