"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { appDemoReady, appShellHref, isExternalMiniapp } from "@/lib/miniappOrigin";

/** 对内：愿景 / 能力 / 路线图 */
const platformLinks = [
  { href: "#vision", label: "愿景" },
  { href: "#features", label: "能力" },
  { href: "#roadmap", label: "路线图" },
] as const;

/** 对用户：四大可体验模块（页内区块仍分开，仅导航合并） */
const productLinks = [
  { href: "#match", label: "匹配引擎", hint: "7 维加权 · 30s 仪式动效" },
  { href: "#pulse", label: "实时脉动", hint: "社区活跃与匹配动态" },
  { href: "#market", label: "工具商城", hint: "模板上架 · 心愿单 · 变现" },
  { href: "#stories", label: "用户故事", hint: "真实创业者的闭环案例" },
] as const;

export function WebNav() {
  const homeHref = appShellHref("/home");
  const external = isExternalMiniapp();
  const appReady = appDemoReady();
  const [productOpen, setProductOpen] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!productRef.current?.contains(e.target as Node)) setProductOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

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
          className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto whitespace-nowrap py-1 text-xs font-medium text-slate-400 [scrollbar-width:none] md:gap-2 md:py-0 md:text-sm [&::-webkit-scrollbar]:hidden"
        >
          {platformLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="shrink-0 rounded-full px-2.5 py-1 transition hover:bg-white/[0.06] hover:text-slate-200 md:px-3"
            >
              {l.label}
            </a>
          ))}

          <span
            aria-hidden
            className="mx-0.5 hidden h-4 w-px shrink-0 bg-white/15 sm:inline-block"
          />

          <div ref={productRef} className="relative shrink-0">
            <button
              type="button"
              aria-expanded={productOpen}
              aria-haspopup="true"
              onClick={() => setProductOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-full border border-violet-400/25 bg-violet-500/10 px-2.5 py-1 font-semibold text-violet-200 transition hover:border-violet-400/40 hover:bg-violet-500/15 md:px-3"
            >
              产品体验
              <ChevronDown
                className={`h-3.5 w-3.5 transition ${productOpen ? "rotate-180" : ""}`}
              />
            </button>
            {productOpen ? (
              <div
                role="menu"
                className="absolute left-1/2 top-[calc(100%+8px)] z-50 w-[min(92vw,17rem)] -translate-x-1/2 rounded-2xl border border-white/10 bg-ink-950/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
              >
                {productLinks.map((l) => (
                  <a
                    key={l.href}
                    role="menuitem"
                    href={l.href}
                    onClick={() => setProductOpen(false)}
                    className="block rounded-xl px-3 py-2.5 transition hover:bg-white/[0.08]"
                  >
                    <span className="block text-sm font-semibold text-white">{l.label}</span>
                    <span className="mt-0.5 block text-[10px] leading-snug text-slate-400">
                      {l.hint}
                    </span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>

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
