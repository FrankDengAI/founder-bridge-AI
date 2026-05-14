"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { isMiniappConfigured, miniappOrigin } from "@/lib/miniappOrigin";
import { VBC_AUTH_POST_MESSAGE } from "@/lib/vbcAuth";

export function LoginBridge() {
  const app = miniappOrigin();
  const configured = isMiniappConfigured();
  const iframeSrc = configured ? `${app}/welcome/login?embed=1` : "";
  const [done, setDone] = useState(false);
  const [sameOriginConflict, setSameOriginConflict] = useState(false);

  useEffect(() => {
    if (!app) {
      setSameOriginConflict(false);
      return;
    }
    let expected: string;
    try {
      expected = new URL(app).origin;
    } catch {
      return;
    }
    if (typeof window !== "undefined" && window.location.origin === expected) {
      setSameOriginConflict(true);
    } else {
      setSameOriginConflict(false);
    }
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type !== VBC_AUTH_POST_MESSAGE) return;
      if (e.origin !== expected) return;
      setDone(true);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [app]);

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
            ? "在下方窗口完成登录（会话写入 App 端）。完成后可打开首页。"
            : "公网部署需在平台环境变量中配置 App 壳地址后，才能嵌入演示登录。"}
        </p>
      </div>

      {done ? (
        <AuthCard>
          <p className="text-center text-sm font-medium text-zinc-700">
            检测到已在演示 App 中登录成功。
          </p>
          <a
            href={`${app}/home`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-full items-center justify-center rounded-full bg-zinc-900 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            打开 App 首页
          </a>
          <p className="mt-3 text-center text-xs text-zinc-500">
            若页面未登录，请确认 App 与网页配置的地址一致（环境变量{" "}
            <span className="font-mono">NEXT_PUBLIC_MINIAPP_URL</span>）。
          </p>
        </AuthCard>
      ) : (
        <div className="mx-auto w-full max-w-sm space-y-4">
          {!configured ? (
            <div
              role="status"
              className="rounded-2xl border border-cyan-500/35 bg-cyan-950/35 px-4 py-4 text-sm leading-relaxed text-cyan-50 shadow-[0_16px_48px_-20px_rgba(6,182,212,0.25)]"
            >
              <p className="font-semibold text-cyan-100">未配置 App 壳地址</p>
              <p className="mt-2 text-cyan-100/90">
                请在 Vercel（或其他托管平台）为本项目添加环境变量{" "}
                <span className="font-mono text-cyan-50">NEXT_PUBLIC_MINIAPP_URL</span>
                ，值为已部署的 App 壳站点 origin（
                <span className="font-mono text-cyan-50">https://</span>
                开头、无末尾斜杠）。保存后重新部署生效。
              </p>
            </div>
          ) : null}

          {configured && sameOriginConflict ? (
            <div
              role="alert"
              className="rounded-2xl border border-amber-500/40 bg-amber-950/40 px-4 py-4 text-sm leading-relaxed text-amber-100 shadow-[0_16px_48px_-20px_rgba(245,158,11,0.35)]"
            >
              <p className="font-semibold text-amber-50">当前网页与 App 地址相同，内嵌会加载本站并出现 404</p>
              <p className="mt-2 text-amber-100/90">
                登录页 iframe 需要加载 <span className="font-mono text-amber-50">code_demo</span>（含{" "}
                <span className="font-mono">/welcome/login</span>
                ），不能与品牌站同源。
              </p>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-amber-100/85">
                <li>
                  在仓库根目录另开终端启动 App 壳：<span className="font-mono">python main.py</span>
                  （端口以终端输出为准）。
                </li>
                <li>
                  网页端使用单独端口启动本目录 <span className="font-mono">python main.py</span>
                  ，或设置 <span className="font-mono">NEXT_PUBLIC_MINIAPP_URL</span> 为 App 实际访问地址。
                </li>
              </ol>
            </div>
          ) : null}

          {configured && !sameOriginConflict ? (
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
                    确认 App 已运行且与{" "}
                    <span className="font-mono">NEXT_PUBLIC_MINIAPP_URL</span> 一致。
                  </li>
                  <li>
                    检查 <span className="font-mono">code_demo</span> 是否已执行依赖与数据库初始化（见仓库根目录运行说明）。
                  </li>
                  <li>环境变量 URL 勿带非法字符；末尾斜杠可省略。</li>
                </ul>
              </details>
            </>
          ) : null}

          <p className="text-center text-[11px] leading-relaxed text-slate-500">
            首次使用请先在{" "}
            <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-slate-300">code_demo</code>{" "}
            目录执行依赖与数据库初始化。
          </p>
        </div>
      )}
    </div>
  );
}
