# -*- coding: utf-8 -*-
from pathlib import Path

CONTENT = r'''import Link from "next/link";
import { ArrowUpRight, BookOpen, FolderGit2, Rocket } from "lucide-react";
import { LearnHubStrip } from "@/components/learn/LearnHubStrip";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";

export const dynamic = "force-dynamic";

const STEPS = [
  "\u60f3\u6cd5\u751f\u6210",
  "\u9700\u6c42\u62c6\u89e3",
  "\u63d0\u793a\u8bcd\u7f16\u5199",
  "\u4ee3\u7801\u751f\u6210",
  "\u9875\u9762\u8bbe\u8ba1",
  "GitHub \u7ba1\u7406",
  "\u90e8\u7f72\u4e0a\u7ebf",
  "\u7528\u6237\u53cd\u9988",
] as const;

export default async function LearnPage() {
  const uid = await getUserIdFromCookies();
  const projects = uid
    ? await prisma.project.findMany({
        where: { userId: uid },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-4 pb-4">
      <PageHeader
        title="\u5b66\u4e60\u4e0e\u9879\u76ee"
        subtitle="\u628a\u300c\u8def\u7ebf \u2192 \u6b65\u9aa4 \u2192 \u9879\u76ee \u2192 \u53d1\u5e03\u300d\u4e32\u6210\u53ef\u70b9\u51fb\u7684\u95ed\u73af\uff1b\u767b\u5f55\u540e\u5b66\u4e60\u8fdb\u5ea6\u5199\u5165 PostgreSQL\uff0c\u5e76\u4e0e\u6210\u5c31\u540c\u6b65\u3002"
      />

      <LearnHubStrip />

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <motionlessDiv className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 ring-1 ring-violet-200/70">
            <Rocket className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">\u80fd\u529b\u6269\u5c55\u533a</h2>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
              \u5c06\u5b66\u4e60\u8f93\u51fa\u6c89\u6dc0\u4e3a\u7b14\u8bb0\u4e0e\u9879\u76ee\u5361\u7247\uff0c\u518d\u5728\u300c\u5339\u914d\u300d\u91cc\u5bfb\u627e\u4e92\u8865\u89d2\u8272\uff0c\u5f62\u6210\u95ed\u73af\u3002
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/workspace" className="rounded-full bg-zinc-950 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-zinc-800">\u6253\u5f00\u5de5\u4f5c\u53f0</Link>
              <Link href="/match" className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-800 ring-1 ring-zinc-200/80 hover:bg-zinc-50">\u53bb\u5339\u914d</Link>
              <Link href="/tools" className="rounded-full bg-brand-50 px-3 py-1.5 text-[11px] font-semibold text-brand-900 ring-1 ring-brand-200/70 hover:bg-white">\u5de5\u5177\u5bfc\u822a</Link>
            </div>
          </div>
        </motionlessDiv>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">Vibe Coding \u5b66\u4e60\u8def\u7ebf</h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">\u6bcf\u4e00\u6b65\u90fd\u53ef\u8fdb\u5165\u8be6\u60c5\u9875\uff0c\u5185\u542b\u884c\u52a8\u6e05\u5355\u4e0e\u6269\u5c55\u5efa\u8bae\u3002</p>
          </div>
          <BookOpen className="mt-0.5 h-5 w-5 text-brand-700" />
        </div>
        <ol className="mt-4 space-y-2">
          {STEPS.map((s, i) => (
            <li key={s}>
              <Link href={`/learn/step/${i + 1}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-3 py-2.5 text-xs text-zinc-800 ring-1 ring-zinc-200/70 transition hover:bg-white hover:shadow-sm">
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-fuchsia-600 text-[11px] font-bold text-white shadow-sm">{i + 1}</span>
                  <span className="font-semibold">{s}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link href="/learn/github" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
            <FolderGit2 className="h-4 w-4" />\u7ed1\u5b9a GitHub\uff08\u6f14\u793a\uff09
          </Link>
          <Link href="/publish" className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50">\u53d1\u5e03\u5b66\u4e60\u7b14\u8bb0</Link>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-950">\u6211\u7684\u9879\u76ee\u5c55\u793a</h2>
          <Link href="/demo/product" className="text-[11px] font-semibold text-brand-800 hover:underline">\u6253\u5f00\u4ea7\u54c1\u9884\u89c8</Link>
        </motionlessDiv>
        {projects.length === 0 ? (
          <p className="glass-panel rounded-2xl p-4 text-xs text-zinc-600 shadow-sm">\u6f14\u793a\u8d26\u53f7\u6682\u65e0\u9879\u76ee\u8bb0\u5f55\u3002\u8bf7\u5148\u8fd0\u884c <span className="font-mono">npm run db:seed</span>\u3002</p>
        ) : (
          <ul className="space-y-2">
            {projects.map((p) => {
              let stack: string[] = [];
              try { stack = JSON.parse(p.stack) as string[]; if (!Array.isArray(stack)) stack = []; } catch { stack = []; }
              return (
                <li key={p.id} className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
                  <p className="text-sm font-semibold text-zinc-950">{p.name}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    {p.repoUrl ? <a className="inline-flex items-center gap-1 rounded-xl bg-zinc-950 px-3 py-2 font-semibold text-white hover:bg-zinc-800" href={p.repoUrl} target="_blank" rel="noreferrer">\u6253\u5f00\u4ed3\u5e93</a> : null}
                    {p.previewUrl ? <a className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-2 font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50" href={p.previewUrl} target="_blank" rel="noreferrer">\u6253\u5f00\u9884\u89c8</a> : null}
                    <Link href="/demo/product" className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-2 font-semibold text-white shadow-glow">App \u5185\u5d4c\u9884\u89c8</Link>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {stack.map((s) => (<span key={s} className="rounded-full bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-700 ring-1 ring-zinc-200/70">{s}</span>))}
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
'''

out = Path(__file__).resolve().parents[1] / "app" / "(shell)" / "(tabs)" / "learn" / "page.tsx"
text = CONTENT.replace("motionlessDiv", "div")
out.write_text(text, encoding="utf-8")
print("wrote learn", out)
