"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, Mail, MessageCircle, Twitter } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { appDemoReady, isExternalMiniapp } from "@/lib/miniappOrigin";
import { useAppEntryHref } from "@/lib/hooks/useAppEntryHref";

export function WebCta() {
  const appEntry = useAppEntryHref();
  const homeHref = appEntry("/home");
  const external = isExternalMiniapp();
  const appReady = appDemoReady();
  const demoLabel = homeHref.replace(/^https?:\/\//, "");
  return (
    <section
      id="cta"
      className="border-t border-violet-200/50 pb-24 pt-20 sm:pb-32 sm:pt-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border border-violet-200/60 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-10 text-center shadow-[0_24px_80px_-32px_rgba(139,92,246,0.35)] sm:p-16"
        >
          {/* 多层装饰 */}
          <div className="pointer-events-none absolute inset-0 bg-conic-glow opacity-30 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-30 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,black,transparent)]" />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-violet-400/15 spin-slow"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-fuchsia-400/15 spin-slow"
            style={{ animationDirection: "reverse" }}
          />

          <div className="relative">
            <p className="chip mx-auto inline-flex">
              <span className="pulse-dot text-emerald-400" />
              ready · for · take-off
            </p>
            <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
              <span className="text-gradient-anim">准备好接好下一棒了吗？</span>
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-zinc-600 sm:text-base">
              在另一窗口启动 App 壳演示，与本页并排：
              一边走完整用户流，一边对外讲品牌故事。
            </p>
            <div className="relative mt-9 flex flex-wrap justify-center gap-3">
              {appReady ? (
                <a
                  href={homeHref}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-95"
                >
                  打开 App 演示
                  <span className="font-mono text-[11px] text-slate-500">
                    {demoLabel}
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ) : (
                <span
                  title="在 Vercel 等项目环境变量中设置 NEXT_PUBLIC_MINIAPP_URL"
                  className="inline-flex cursor-default rounded-full border border-violet-200 bg-violet-50/80 px-8 py-3.5 text-sm font-semibold text-zinc-500"
                >
                  App 演示（待配置 NEXT_PUBLIC_MINIAPP_URL）
                </span>
              )}
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-violet-300/60 bg-white px-8 py-3.5 text-sm font-semibold text-violet-800 transition hover:bg-violet-50"
              >
                登录演示账号
              </Link>
            </div>

            {/* 三栏要点 */}
            <div className="relative mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { v: "30 秒", k: "找到伙伴" },
                { v: "7 维", k: "可解释匹配" },
                { v: "1 个", k: "平台闭环" },
              ].map((it) => (
                <div
                  key={it.k}
                  className="rounded-2xl border border-violet-200/60 bg-white/80 p-4 backdrop-blur"
                >
                  <p className="font-display text-2xl font-bold text-gradient num-tab">
                    {it.v}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">{it.k}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <footer className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-violet-200/50 pt-10 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="font-display text-base font-bold text-gradient-anim">
              VibeCoding
            </span>
            <span>·</span>
            <p>© {new Date().getFullYear()} 演示工程</p>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span className="inline-flex" title="演示工程，社交链接暂未配置" aria-hidden>
              <Github className="h-4 w-4" />
            </span>
            <span className="inline-flex" aria-hidden>
              <Twitter className="h-4 w-4" />
            </span>
            <span className="inline-flex" aria-hidden>
              <MessageCircle className="h-4 w-4" />
            </span>
            <span className="inline-flex" aria-hidden>
              <Mail className="h-4 w-4" />
            </span>
          </div>
          <p className="font-mono text-xs text-zinc-400">
            Next.js 14 · Prisma · PostgreSQL · Edge
          </p>
        </footer>
      </div>
    </section>
  );
}
