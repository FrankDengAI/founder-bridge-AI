import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Cpu,
  FolderGit2,
  Lightbulb,
  Rocket,
  Sparkles,
  Star,
  Wand2,
  Zap,
} from "lucide-react";
import { LearnHubStrip } from "@/components/learn/LearnHubStrip";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";

export const dynamic = "force-dynamic";

const STEPS = [
  { name: "想法生成", desc: "灵感卡 · 用户画像 · 价值假设", icon: Lightbulb },
  { name: "需求拆解", desc: "PRD · 核心流程 · MVP 边界", icon: BookOpen },
  { name: "提示词编写", desc: "Prompt 工程化 · 上下文工程", icon: Wand2 },
  { name: "代码生成", desc: "Cursor / Claude Code 协作", icon: Sparkles },
  { name: "页面设计", desc: "组件库 · 响应式 · 玻璃拟态", icon: Sparkles },
  { name: "GitHub 管理", desc: "分支 · PR · Code Review", icon: FolderGit2 },
  { name: "部署上线", desc: "Vercel · 数据库 · CI/CD", icon: Rocket },
  { name: "用户反馈", desc: "数据看板 · 复盘 · 迭代", icon: Zap },
] as const;

export default async function LearnPage() {
  const uid = getUserIdFromCookies();
  const [projects, topModel, modelCount, reviewCount] = await Promise.all([
    uid
      ? prisma.project.findMany({
          where: { userId: uid },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
    prisma.aiModel.findFirst({
      orderBy: { rankScore: "desc" },
      select: { id: true, name: true, avgRating: true, reviewCount: true },
    }),
    prisma.aiModel.count(),
    prisma.aiModelReview.count(),
  ]);

  return (
    <div className="space-y-4 pb-4">
      <PageHeader
        title="学习与项目"
        subtitle="把「路线 → 步骤 → 项目 → 发布」串成可点击的闭环；登录后学习进度写入 PostgreSQL，并与成就同步。"
      />

      <LearnHubStrip />

      <Link
        href="/models"
        className="group block overflow-hidden rounded-3xl border border-violet-200/70 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-700 p-[1px] shadow-soft transition hover:shadow-[0_20px_50px_-24px_rgba(109,40,217,0.55)]"
      >
        <div className="relative rounded-[22px] bg-zinc-950/92 px-4 py-4">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-fuchsia-400/25 blur-2xl"
          />
          <div className="relative flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-sm">
              <Cpu className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/90">
                选型必看
              </p>
              <p className="text-sm font-bold text-white">大模型口碑榜 · 真实短评社区</p>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                编程 / 写作 / 性价比场景下的真实体验，比参数表更贴近 VibeCoding 日常。
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                {modelCount > 0 ? (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 font-semibold text-violet-100 ring-1 ring-white/15">
                    {modelCount} 个模型
                  </span>
                ) : null}
                {reviewCount > 0 ? (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 font-semibold text-amber-100 ring-1 ring-white/15">
                    {reviewCount} 条短评
                  </span>
                ) : null}
                {topModel ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 font-semibold text-amber-100 ring-1 ring-amber-400/30">
                    <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                    榜首 {topModel.name} · {topModel.avgRating.toFixed(1)}
                  </span>
                ) : null}
              </div>
              <span className="relative mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-violet-200 group-hover:text-white">
                进入榜单，写第一条短评 →
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/learn"
          className="rounded-full bg-violet-100 px-3 py-1.5 text-[11px] font-semibold text-violet-900 ring-1 ring-violet-200/70"
        >
          入门路线（全 8 步）
        </Link>
        <Link
          href="/learn?level=advanced"
          className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 ring-1 ring-zinc-200/70"
        >
          进阶 · 开源与协作（5–8 步）
        </Link>
        <Link href="/templates" className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 ring-1 ring-zinc-200/70">
          模板市场
        </Link>
      </div>

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
              8 步法 · 每一步都可进入详情页，内含行动清单与扩展建议。
            </p>
          </div>
          <BookOpen className="mt-0.5 h-5 w-5 text-brand-700" />
        </div>

        {/* 顶部进度条 */}
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-violet-50 via-fuchsia-50 to-amber-50 p-3 ring-1 ring-violet-100/80">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-700">
            <span>整体进度</span>
            <span className="font-mono text-zinc-900 num-tab">3 / 8 步</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/80 ring-1 ring-zinc-200/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400"
              style={{ width: "37.5%" }}
            />
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-600">
            <Sparkles className="h-3 w-3 text-amber-500" />
            登录后会写入 PostgreSQL · 与「成就」字段同步
          </div>
        </div>

        {/* 时间线步骤 */}
        <ol className="relative mt-5 space-y-3 pl-4">
          <div
            aria-hidden
            className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-violet-300 via-fuchsia-200 to-transparent"
          />
          {STEPS.map((s, i) => {
            const done = i < 3;
            const current = i === 3;
            const Icon = s.icon;
            return (
              <li key={s.name} className="relative">
                <div
                  aria-hidden
                  className={`absolute -left-1.5 top-3 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white ${
                    done
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                      : current
                        ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 animate-pulse"
                        : "bg-white ring-4 ring-zinc-100"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  ) : current ? (
                    <Sparkles className="h-2.5 w-2.5 text-white" />
                  ) : (
                    <Circle className="h-2.5 w-2.5 text-zinc-400" />
                  )}
                </div>
                <Link
                  href={`/learn/step/${i + 1}`}
                  className={`ml-5 flex items-start justify-between gap-3 rounded-2xl px-3 py-2.5 ring-1 transition hover:bg-white hover:shadow-sm ${
                    done
                      ? "bg-emerald-50/60 ring-emerald-200/70"
                      : current
                        ? "bg-gradient-to-r from-violet-100/80 via-fuchsia-100/60 to-white ring-violet-200/80"
                        : "bg-white/70 ring-zinc-200/70"
                  }`}
                >
                  <span className="flex min-w-0 items-start gap-2.5">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${
                        done
                          ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                          : current
                            ? "bg-gradient-to-br from-violet-600 to-fuchsia-600"
                            : "bg-zinc-200 text-zinc-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        Step {i + 1}
                      </span>
                      <span className="block text-sm font-bold text-zinc-900">
                        {s.name}
                      </span>
                      <span className="block text-[11px] leading-relaxed text-zinc-600">
                        {s.desc}
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
                </Link>
              </li>
            );
          })}
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
