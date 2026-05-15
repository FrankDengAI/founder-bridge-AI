"use client";

import { motion } from "framer-motion";
import { appDemoReady, appShellHref, isExternalMiniapp } from "@/lib/miniappOrigin";

export function WebCta() {
  const homeHref = appShellHref("/home");
  const external = isExternalMiniapp();
  const appReady = appDemoReady();
  const demoLabel = homeHref.replace(/^https?:\/\//, "");
  return (
    <section id="cta" className="border-t border-white/[0.06] pb-24 pt-20 sm:pb-32 sm:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border border-violet-400/25 bg-gradient-to-br from-violet-950/90 via-ink-900 to-fuchsia-950/55 p-10 text-center web-card-glow sm:p-14"
        >
          <div className="pointer-events-none absolute inset-0 bg-conic-glow opacity-30 blur-3xl" />
          <h2 className="relative font-display text-3xl font-bold sm:text-4xl">
            <span className="text-gradient-anim">准备好接好下一棒了吗？</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-slate-300">
            在另一窗口启动 App 壳演示，与本页并排：一边走完整用户流，一边对外讲品牌故事。
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            {appReady ? (
              <a
                href={homeHref}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="inline-flex rounded-full bg-white px-8 py-3 text-sm font-bold text-ink-950 transition hover:bg-slate-100"
              >
                打开 App 演示（{demoLabel}）
              </a>
            ) : (
              <span
                title="在 Vercel 等项目环境变量中设置 NEXT_PUBLIC_MINIAPP_URL"
                className="inline-flex cursor-default rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-semibold text-slate-400"
              >
                App 演示（待配置 NEXT_PUBLIC_MINIAPP_URL）
              </span>
            )}
            <a
              href="#vision"
              className="inline-flex rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              回到顶部
            </a>
          </div>
        </motion.div>

        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-10 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} VibeCoding 演示工程 · 品牌与 App 同仓部署</p>
          <p className="font-mono text-xs text-slate-600">
            Next.js 14 · Prisma PostgreSQL
          </p>
        </footer>
      </div>
    </section>
  );
}
