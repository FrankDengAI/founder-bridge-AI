import Link from "next/link";
import { ArrowUpRight, BookOpen, FolderGit2, Rocket } from "lucide-react";
import { LearnHubStrip } from "@/components/learn/LearnHubStrip";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";

export const dynamic = "force-dynamic";

const STEPS = [
  "想法生成",
  "需求拆解",
  "提示词编写",
  "代码生成",
  "页面设计",
  "GitHub 管理",
  "部署上线",
  "用户反馈",
] as const;

export default async function LearnPage() {
  const uid = getUserIdFromCookies();
  const projects = uid
    ? await prisma.project.findMany({
        where: { userId: uid },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-4 pb-4">
      <PageHeader
        title="学习与项目"
        subtitle="把「路线 → 步骤 → 项目 → 发布」串成可点击的闭环；登录后学习进度写入 SQLite，并与成就同步。"
      />

      <LearnHubStrip />

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 ring-1 ring-violet-200/70">
            <Rocket className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">能力扩展区</h2>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
              将学习输出沉淀为笔记与项目卡片，再在「匹配」里寻找互补角色，形成闭环。
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/workspace"
                className="rounded-full bg-zinc-950 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-zinc-800"
              >
                打开工作台
              </Link>
              <Link
                href="/match"
                className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-800 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
              >
                去匹配
              </Link>
              <Link
                href="/tools"
                className="rounded-full bg-brand-50 px-3 py-1.5 text-[11px] font-semibold text-brand-900 ring-1 ring-brand-200/70 hover:bg-white"
              >
                工具导航
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">Vibe Coding 学习路线</h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
              每一步都可进入详情页，内含行动清单与扩展建议。
            </p>
          </div>
          <BookOpen className="mt-0.5 h-5 w-5 text-brand-700" />
        </div>
        <ol className="mt-4 space-y-2">
          {STEPS.map((s, i) => (
            <li key={s}>
              <Link
                href={`/learn/step/${i + 1}`}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-3 py-2.5 text-xs text-zinc-800 ring-1 ring-zinc-200/70 transition hover:bg-white hover:shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-fuchsia-600 text-[11px] font-bold text-white shadow-sm">
                    {i + 1}
                  </span>
                  <span className="font-semibold">{s}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link
            href="/learn/github"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            <FolderGit2 className="h-4 w-4" />
            绑定 GitHub（演示）
          </Link>
          <Link
            href="/publish"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
          >
            发布学习笔记
          </Link>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-950">我的项目展示</h2>
          <Link href="/demo/product" className="text-[11px] font-semibold text-brand-800 hover:underline">
            打开产品预览
          </Link>
        </div>
        {projects.length === 0 ? (
          <p className="glass-panel rounded-2xl p-4 text-xs text-zinc-600 shadow-sm">
            演示账号暂无项目记录。请先运行 <span className="font-mono">npm run db:seed</span>。
          </p>
        ) : (
          <ul className="space-y-2">
            {projects.map((p) => {
              let stack: string[] = [];
              try {
                stack = JSON.parse(p.stack) as string[];
                if (!Array.isArray(stack)) stack = [];
              } catch {
                stack = [];
              }
              return (
                <li
                  key={p.id}
                  className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70"
                >
                  <p className="text-sm font-semibold text-zinc-950">{p.name}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    {p.repoUrl ? (
                      <a
                        className="inline-flex items-center gap-1 rounded-xl bg-zinc-950 px-3 py-2 font-semibold text-white hover:bg-zinc-800"
                        href={p.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        打开仓库
                      </a>
                    ) : null}
                    {p.previewUrl ? (
                      <a
                        className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-2 font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
                        href={p.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        打开预览
                      </a>
                    ) : null}
                    <Link
                      href="/demo/product"
                      className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-2 font-semibold text-white shadow-glow"
                    >
                      App 内嵌预览
                    </Link>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-700 ring-1 ring-zinc-200/70"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
