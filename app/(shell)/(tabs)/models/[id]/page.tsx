import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Sparkles } from "lucide-react";
import { ModelDiscussionList } from "@/components/models/ModelDiscussionList";
import { ModelReviewPanel } from "@/components/models/ModelReviewPanel";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { parseJsonArray, SCENARIO_LABEL } from "@/lib/models/rank";

type Props = { params: { id: string } };

export const dynamic = "force-dynamic";

function topMentions(values: string[], take = 3) {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = value.trim();
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
    .slice(0, take)
    .map(([label, count]) => ({ label, count }));
}

export default async function ModelDetailPage({ params }: Props) {
  const model = await prisma.aiModel.findUnique({
    where: { id: params.id },
    include: {
      reviews: { orderBy: { createdAt: "desc" } },
      posts: {
        where: { status: "published", type: "MODEL_DISCUSSION" },
        orderBy: { createdAt: "desc" },
        take: 12,
      },
    },
  });
  if (!model) notFound();

  const strengths = parseJsonArray(model.strengths);
  const scenarios = parseJsonArray(model.scenarios);

  const reviews = model.reviews.map((r) => ({
    id: r.id,
    userName: r.userName,
    rating: r.rating,
    pros: r.pros,
    cons: r.cons,
    scenario: r.scenario,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
  }));

  const discussions = model.posts.map((p) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    likes: p.likes,
    createdAt: p.createdAt.toISOString(),
  }));
  const prosSummary = topMentions(model.reviews.map((r) => r.pros));
  const consSummary = topMentions(model.reviews.map((r) => r.cons));

  return (
    <div className="space-y-4 pb-10">
      <PageHeader title={model.name} subtitle={model.provider} backHref="/models" />

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <div className="flex items-start gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-violet-100 ring-1 ring-violet-200/60">
            {model.logoUrl ? (
              <Image src={model.logoUrl} alt="" fill className="object-cover" unoptimized />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-lg font-bold text-violet-800">
                {model.name.slice(0, 1)}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-violet-800">大模型详情</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-700">{model.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-900 ring-1 ring-amber-200/70">
                评分 {model.avgRating.toFixed(1)} · {model.reviewCount} 条
              </span>
              <span className="rounded-full bg-violet-50 px-2.5 py-1 font-semibold text-violet-900 ring-1 ring-violet-200/70">
                综合 {model.rankScore.toFixed(1)}
              </span>
              {model.websiteUrl ? (
                <a
                  href={model.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 font-semibold text-zinc-800 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
                >
                  官网
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
              <Link
                href={`/publish?type=MODEL_DISCUSSION&modelId=${model.id}`}
                className="inline-flex items-center gap-1 rounded-full bg-zinc-950 px-2.5 py-1 font-semibold text-white hover:bg-zinc-800"
              >
                <Sparkles className="h-3 w-3" />
                发起讨论
              </Link>
            </div>
            {scenarios.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1">
                {scenarios.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-700 ring-1 ring-zinc-200/70"
                  >
                    {SCENARIO_LABEL[s] ?? s}
                  </span>
                ))}
              </div>
            ) : null}
            {strengths.length > 0 ? (
              <p className="mt-2 text-[11px] text-zinc-600">
                <span className="font-semibold text-zinc-800">擅长：</span>
                {strengths.join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {(prosSummary.length > 0 || consSummary.length > 0) ? (
        <section className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-emerald-50/80 p-3 ring-1 ring-emerald-200/70">
            <p className="text-xs font-semibold text-emerald-950">优点摘要</p>
            {prosSummary.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {prosSummary.map((p) => (
                  <span
                    key={p.label}
                    className="rounded-full bg-white/80 px-2 py-1 text-[11px] font-medium text-emerald-900 ring-1 ring-emerald-200/70"
                  >
                    {p.label}
                    {p.count > 1 ? ` ×${p.count}` : ""}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[11px] text-emerald-900/70">暂无集中提到的优点。</p>
            )}
          </div>
          <div className="rounded-2xl bg-rose-50/80 p-3 ring-1 ring-rose-200/70">
            <p className="text-xs font-semibold text-rose-950">槽点摘要</p>
            {consSummary.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {consSummary.map((p) => (
                  <span
                    key={p.label}
                    className="rounded-full bg-white/80 px-2 py-1 text-[11px] font-medium text-rose-900 ring-1 ring-rose-200/70"
                  >
                    {p.label}
                    {p.count > 1 ? ` ×${p.count}` : ""}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[11px] text-rose-900/70">暂无集中提到的槽点。</p>
            )}
          </div>
        </section>
      ) : null}

      <ModelReviewPanel modelId={model.id} initialReviews={reviews} />

      <ModelDiscussionList
        modelId={model.id}
        modelName={model.name}
        posts={discussions}
      />
    </div>
  );
}
