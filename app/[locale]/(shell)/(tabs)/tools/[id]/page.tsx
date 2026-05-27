import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Wrench } from "lucide-react";
import { ToolReviewsPanel } from "@/components/ToolReviewsPanel";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

type Props = { params: { id: string } };

export const dynamic = "force-dynamic";

export default async function ToolDetailPage({ params }: Props) {
  const tool = await prisma.tool.findUnique({
    where: { id: params.id },
    include: { reviews: { orderBy: { createdAt: "desc" } } },
  });
  if (!tool) notFound();

  const reviews = tool.reviews.map((r) => ({
    id: r.id,
    userName: r.userName,
    rating: r.rating,
    comment: r.comment,
    authorReply: r.authorReply || undefined,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-4 pb-10">
      <PageHeader title={tool.name} subtitle={tool.category} backHref="/tools" />

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-fuchsia-600 text-white shadow-glow">
            <Wrench className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-brand-900">工具详情</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-700">{tool.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-200/70">
                评分 {tool.avgRating.toFixed(1)}
              </span>
              <Link
                href="/publish"
                className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
              >
                写一篇测评笔记
              </Link>
              <Link
                href="/match"
                className="rounded-full bg-zinc-950 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-zinc-800"
              >
                找伙伴一起落地
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ToolReviewsPanel toolId={tool.id} initialReviews={reviews} />
    </div>
  );
}
