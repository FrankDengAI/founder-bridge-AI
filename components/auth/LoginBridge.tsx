"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import {
  appEntryHref,
  isExternalMiniapp,
  loginIframeSrc,
  miniappOrigin,
} from "@/lib/miniappOrigin";
import { VBC_AUTH_POST_MESSAGE } from "@/lib/constants";

export function LoginBridge() {
  const app = miniappOrigin();
  const external = isExternalMiniapp();
  const iframeSrc = loginIframeSrc();
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

  const homeHref = appEntryHref("/home");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg flex-col gap-6 px-4 pb-16 pt-8 sm:pt-12">
      <Link
        href="/"
        className="inline-flex w-fit text-sm font-medium text-zinc-500 transition hover:text-violet-700"
      >
        ← 返回首页
      </Link>

      <div className="text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          登录演示应用
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {external
            ? "在下方窗口完成登录（会话写入外站 App 域名）。完成后可进入 App 首页。"
            : "在下方窗口完成登录（会话写入本站服务端）。完成后可进入 App 首页。"}
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
            className="mt-5 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3.5 text-sm font-semibold text-white transition hover:opacity-95"
          >
            打开 App 首页
          </a>
          <p className="mt-3 text-center text-xs text-zinc-500">
            若页面未登录，请确认数据库已迁移并已执行演示种子（见仓库 .env.example）。
          </p>
        </AuthCard>
      ) : (
        <div className="mx-auto w-full max-w-sm space-y-4">
          <>
            <div className="rounded-[2rem] border border-violet-200/60 bg-white/90 p-2 shadow-[0_24px_60px_-24px_rgba(139,92,246,0.25)] backdrop-blur-md">
              <div className="overflow-hidden rounded-[1.65rem] bg-white ring-1 ring-zinc-200/80">
                <iframe
                  title="VibeCoding 演示登录"
                  src={iframeSrc}
                  className="h-[min(72vh,640px)] w-full min-h-[480px] border-0"
                  sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                />
              </div>
            </div>
            <details className="rounded-xl border border-violet-200/60 bg-violet-50/50 px-3 py-2 text-[11px] text-zinc-600">
              <summary className="cursor-pointer select-none font-medium text-zinc-800">
                内嵌仍为空白或 404？
              </summary>
              <ul className="mt-2 list-disc space-y-1 pl-4 leading-relaxed">
                <li>
                  确认已配置 <span className="font-mono">DATABASE_URL</span> 并成功{" "}
                  <span className="font-mono">prisma migrate deploy</span>。
                </li>
                <li>首次空库请在可连库环境执行一次 `npm run db:seed`。</li>
                {external ? (
                  <li>
                    分域时请检查 <span className="font-mono">NEXT_PUBLIC_MINIAPP_URL</span>{" "}
                    与 App 实际地址一致。
                  </li>
                ) : (
                  <li>
                    同源合并部署无需配置 <span className="font-mono">NEXT_PUBLIC_MINIAPP_URL</span>
                    ；若曾设置且仍异常，请删除该变量后重新部署。
                  </li>
                )}
              </ul>
            </details>
          </>

          <p className="text-center text-[11px] leading-relaxed text-slate-500">
            合并部署时登录与品牌站同源；数据库为 PostgreSQL（见 prisma 与 .env.example）。
          </p>
        </div>
      )}
    </div>
  );
}
