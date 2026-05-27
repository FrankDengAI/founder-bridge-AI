"use client";

import { Link } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { appDemoReady, isExternalMiniapp } from "@/lib/miniappOrigin";
import { useAppEntryHref } from "@/lib/hooks/useAppEntryHref";

/** 对内：愿景 / 能力 / 路线图 */
const platformLinks = [
  { href: "#vision", label: "愿景" },
  { href: "#features", label: "能力" },
  { href: "#roadmap", label: "路线图" },
] as const;

export function WebNav() {
  const appEntry = useAppEntryHref();
  const homeHref = appEntry("/home");
  const external = isExternalMiniapp();
  const appReady = appDemoReady();

  const scrollToShowcase = () => {
    const el = document.getElementById("showcase");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.hash = "showcase";
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 overflow-visible border-b border-zinc-200/80 bg-white/85 shadow-sm backdrop-blur-2xl backdrop-saturate-150">
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
          className="flex min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap py-1 text-xs font-medium text-zinc-600 md:gap-2 md:py-0 md:text-sm"
        >
          <div className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] md:gap-2 [&::-webkit-scrollbar]:hidden">
            {platformLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="shrink-0 rounded-full px-2.5 py-1 transition hover:bg-violet-50 hover:text-violet-900 md:px-3"
              >
                {l.label}
              </a>
            ))}
          </div>

          <span
            aria-hidden
            className="mx-0.5 hidden h-4 w-px shrink-0 bg-zinc-200 sm:inline-block"
          />

          <a
            href="#showcase"
            onClick={(e) => {
              e.preventDefault();
              scrollToShowcase();
            }}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-violet-300/60 bg-violet-50 px-2.5 py-1 font-semibold text-violet-800 transition hover:border-violet-400 hover:bg-violet-100 md:px-3"
          >
            产品体验
            <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden />
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LocaleSwitcher />
          <Link
            href="/login"
            className="rounded-full border border-zinc-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 transition hover:border-violet-300 hover:bg-violet-50 sm:px-4 sm:text-sm"
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
              className="cursor-default rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-500 sm:px-4 sm:text-sm"
            >
              App 演示（待配置）
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
