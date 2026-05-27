import { Link } from "@/i18n/navigation";
import { Copy, Download } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { TemplateCopyButton } from "@/components/templates/TemplateCopyButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseStack(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default async function TemplatesPage() {
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4 pb-10">
      <PageHeader
        title="模板市场"
        subtitle="Starter Kit 与 Prompt 包 · 一键复制命令 · 演示 MVP"
        backHref="/home"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {templates.map((t) => {
          const stack = parseStack(t.stack);
          return (
            <article
              key={t.id}
              className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-700">
                {t.category}
              </p>
              <h2 className="mt-1 text-sm font-semibold text-zinc-950">{t.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600">{t.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <TemplateCopyButton cmd={t.copyCmd} />
                {t.downloadUrl ? (
                  <a
                    href={t.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl bg-zinc-950 px-3 py-2 text-[11px] font-semibold text-white"
                  >
                    <Download className="h-3.5 w-3.5" />
                    下载
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {templates.length === 0 ? (
        <p className="text-center text-sm text-zinc-600">
          暂无模板，请运行 <code className="rounded bg-white px-1">npm run db:seed</code>
        </p>
      ) : null}

      <p className="text-center text-[11px] text-zinc-500">
        从 <Link href="/publish" className="font-semibold text-violet-800 hover:underline">发布</Link>{" "}
        分享你的模板使用心得
      </p>
    </div>
  );
}
