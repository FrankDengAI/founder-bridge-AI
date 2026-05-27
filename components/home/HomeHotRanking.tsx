import { Link } from "@/i18n/navigation";
import { Cpu, Crown, Flame } from "lucide-react";
import { prisma } from "@/lib/prisma";

const rankTone = [
  "text-amber-600",
  "text-zinc-500",
  "text-orange-500",
] as const;

export async function HomeHotRanking() {
  const [hotPosts, hotTools, hotModels] = await Promise.all([
    prisma.post.findMany({
      where: { status: "published" },
      orderBy: [{ likes: "desc" }, { saves: "desc" }],
      take: 5,
      select: { id: true, title: true, likes: true },
    }),
    prisma.tool.findMany({
      orderBy: { avgRating: "desc" },
      take: 5,
      select: { id: true, name: true, avgRating: true },
    }),
    prisma.aiModel.findMany({
      orderBy: { rankScore: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        provider: true,
        avgRating: true,
        rankScore: true,
        reviewCount: true,
      },
    }),
  ]);

  if (hotPosts.length === 0 && hotTools.length === 0 && hotModels.length === 0) {
    return null;
  }

  return (
    <section className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-2 px-0.5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-700">
            本周热榜
          </p>
          <h2 className="text-sm font-bold text-zinc-950">大家都在看什么</h2>
        </div>
        <Link
          href="/models"
          className="text-[10px] font-semibold text-violet-700 hover:underline"
        >
          完整模型榜 →
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-orange-50/80 to-white p-3 ring-1 ring-orange-200/60">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            热门笔记
          </p>
          <ul className="mt-2 space-y-1.5">
            {hotPosts.map((p, i) => (
              <li key={p.id}>
                <Link
                  href={`/post/${p.id}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-1 py-0.5 text-[11px] text-zinc-700 transition hover:bg-white/80 hover:text-violet-800"
                >
                  <span className="flex min-w-0 items-center gap-1.5 truncate">
                    <span className={`shrink-0 font-bold ${rankTone[i] ?? "text-zinc-400"}`}>
                      {i + 1}
                    </span>
                    {p.title}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-zinc-500">{p.likes}♥</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-rose-50/80 to-white p-3 ring-1 ring-rose-200/60">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
            <Flame className="h-3.5 w-3.5 text-rose-500" />
            热门工具
          </p>
          <ul className="mt-2 space-y-1.5">
            {hotTools.map((t, i) => (
              <li key={t.id}>
                <Link
                  href={`/tools/${t.id}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-1 py-0.5 text-[11px] text-zinc-700 transition hover:bg-white/80 hover:text-violet-800"
                >
                  <span className="flex min-w-0 items-center gap-1.5 truncate">
                    <span className={`shrink-0 font-bold ${rankTone[i] ?? "text-zinc-400"}`}>
                      {i + 1}
                    </span>
                    {t.name}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-zinc-500">
                    {t.avgRating.toFixed(1)}★
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-violet-50/90 via-fuchsia-50/50 to-white p-3 ring-1 ring-violet-200/60 sm:col-span-2 lg:col-span-1">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
            <Cpu className="h-3.5 w-3.5 text-violet-600" />
            大模型口碑榜
          </p>
          <ul className="mt-2 space-y-1.5">
            {hotModels.map((m, i) => (
              <li key={m.id}>
                <Link
                  href={`/models/${m.id}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-1 py-0.5 text-[11px] text-zinc-700 transition hover:bg-white/80 hover:text-violet-800"
                >
                  <span className="flex min-w-0 items-center gap-1.5 truncate">
                    {i === 0 ? (
                      <Crown className="h-3 w-3 shrink-0 text-amber-500" />
                    ) : (
                      <span className={`shrink-0 font-bold ${rankTone[i] ?? "text-zinc-400"}`}>
                        {i + 1}
                      </span>
                    )}
                    <span className="truncate">
                      {m.name}
                      <span className="ml-1 text-[9px] text-zinc-400">{m.provider}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-right font-mono text-[10px] text-zinc-500">
                    {m.avgRating.toFixed(1)}★
                    <span className="ml-1 text-violet-600">{m.reviewCount}评</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/models"
            className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-violet-700 hover:underline"
          >
            去评分 / 写短评 →
          </Link>
        </div>
      </div>
    </section>
  );
}
