"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import {
  appShellHref,
  isExternalMiniapp,
  isMiniappConfigured,
  miniappOrigin,
} from "@/lib/miniappOrigin";
import { VBC_AUTH_POST_MESSAGE } from "@/lib/vbcAuth";

export function LoginBridge() {
  const app = miniappOrigin();
  const external = isExternalMiniapp();
  const configured = isMiniappConfigured();
  const iframeSrc = external
    ? configured
      ? `${app}/welcome/login?embed=1`
      : ""
    : "/welcome/login?embed=1";
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let expected: string;
    try {
      expected = external && app ? new URL(app).origin : window.location.origin;
    } catch {
      return;
    }
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type !== VBC_AUTH_POST_MESSAGE) return;
      if (e.origin !== expected) return;
      setDone(true);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [external, app]);

  const homeHref = appShellHref("/home");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg flex-col gap-6 px-4 pb-16 pt-8 sm:pt-12">
      <Link
        href="/"
        className="inline-flex w-fit text-sm font-medium text-slate-400 transition hover:text-white"
      >
        ← 返回首页
      </Link>

      <div className="text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          登录演示应用
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {configured
            ? "在下方窗口完成登录（会话写入服务端）。完成后可进入 App 首页。"
            : "请在部署环境配置环境变量 NEXT_PUBLIC_MINIAPP_URL（与品牌站不同域的 App 地址），保存后重新部署。"}
        </p>
      </div>

      {done ? (
        <AuthCard>
          <p className="text-center text-sm font-medium text-zinc-700">
            检测到已登录成功。
          </p>
          <a
            href={homeHref}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="mt-5 flex w-full items-center justify-center rounded-full bg-zinc-900 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            打开 App 首页
          </a>
          <p className="mt-3 text-center text-xs text-zinc-500">
            若页面未登录，请确认数据库已迁移并已执行演示种子（见仓库 .env.example）。
          </p>
        </AuthCard>
      ) : (
        <div className="mx-auto w-full max-w-sm space-y-4">
          {!configured ? (
            <div
              role="status"
              className="rounded-2xl border border-cyan-500/35 bg-cyan-950/35 px-4 py-4 text-sm leading-relaxed text-cyan-50 shadow-[0_16px_48px_-20px_rgba(6,182,212,0.25)]"
            >
              <p className="font-semibold text-cyan-100">未配置外站 App 地址</p>
              <p className="mt-2 text-cyan-100/90">
                分域部署时请在 Vercel 添加{" "}
                <span className="font-mono text-cyan-50">NEXT_PUBLIC_MINIAPP_URL</span>
                （https 开头、无末尾斜杠），保存后 Redeploy。
              </p>
            </div>
          ) : null}

          {configured && iframeSrc ? (
            <>
              <div className="rounded-[2rem] border border-white/15 bg-ink-900/60 p-2 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md">
                <div className="overflow-hidden rounded-[1.65rem] bg-white ring-1 ring-zinc-200/80">
                  <iframe
                    title="VibeCoding 演示登录"
                    src={iframeSrc}
                    className="h-[min(72vh,640px)] w-full min-h-[480px] border-0"
                    sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                  />
                </div>
              </div>
              <details className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-slate-400">
                <summary className="cursor-pointer select-none font-medium text-slate-300">
                  内嵌仍为空白或 404？
                </summary>
                <ul className="mt-2 list-disc space-y-1 pl-4 leading-relaxed">
                  <li>
                    确认已配置 <span className="font-mono">DATABASE_URL</span> 并成功{" "}
                    <span className="font-mono">prisma migrate deploy</span>。
                  </li>
                  <li>首次空库请在可连库环境执行一次 `npm run db:seed`。</li>
                  <li>分域时请检查 <span className="font-mono">NEXT_PUBLIC_MINIAPP_URL</span> 与 App 实际地址一致。</li>
                </ul>
              </details>
            </>
          ) : null}

          <p className="text-center text-[11px] leading-relaxed text-slate-500">
            合并部署时登录与品牌站同源；数据库为 PostgreSQL（见 prisma 与 .env.example）。
          </p>
        </div>
      )}
    </div>
  );
}
