"use client";

import { useEffect, useState } from "react";
import { Cpu, Crown, Flame, GraduationCap, PenLine, Sparkles } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { HomeCommunityHub } from "@/components/home/HomeCommunityHub";
import { resolveTab } from "@/lib/navConfig";

const quickLinks = [
  { href: "/match", label: "开始匹配", icon: Sparkles, tone: "from-violet-600 to-fuchsia-600" },
  { href: "/publish", label: "发布笔记", icon: PenLine, tone: "from-sky-600 to-cyan-600" },
  { href: "/learn/step/1", label: "学习路线", icon: GraduationCap, tone: "from-emerald-600 to-teal-600" },
  { href: "/tools", label: "工具商城", icon: Cpu, tone: "from-amber-500 to-orange-600" },
] as const;

type RailData = {
  modelCount: number;
  reviewCount: number;
  hotPosts: { id: string; title: string; likes: number }[];
  hotTools: { id: string; name: string; avgRating: number }[];
  hotModels: {
    id: string;
    name: string;
    provider: string;
    avgRating: number;
    rankScore: number;
    reviewCount: number;
  }[];
};

export function WebRightRail({ pathname: pathnameProp }: { pathname?: string }) {
  const pathnameHook = usePathname() ?? "/home";
  const pathname = pathnameProp ?? pathnameHook;
  const isHome = resolveTab(pathname) === "/home";
  const [data, setData] = useState<RailData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setData(null);
      return;
    }
    setLoading(true);
    void fetch("/api/home/rail")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: RailData | null) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [isHome]);

  return (
    <aside className="hidden w-[260px] shrink-0 lg:block xl:w-[280px]">
      <div className="sticky top-[4.5rem] max-h-[calc(100vh-5.5rem)] space-y-4 overflow-y-auto pb-6 pr-1">
        {isHome ? (
          <>
            <HomeCommunityHub
              modelCount={data?.modelCount ?? 0}
              reviewCount={data?.reviewCount ?? 0}
            />
            {loading ? (
              <div className="glass-panel h-40 animate-pulse rounded-2xl" />
            ) : null}
            {data &&
            (data.hotPosts.length > 0 ||
              data.hotTools.length > 0 ||
              data.hotModels.length > 0) ? (
              <section className="glass-panel rounded-2xl p-4 shadow-sm ring-1 ring-white/70">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <p className="text-sm font-bold text-zinc-900">热榜</p>
                </div>
                {data.hotPosts.length > 0 ? (
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      热门笔记
                    </p>
                    <ul className="mt-2 space-y-2">
                      {data.hotPosts.map((p, i) => (
                        <li key={p.id}>
                          <Link
                            href={`/post/${p.id}`}
                            className="flex items-start gap-2 text-xs text-zinc-700 hover:text-violet-700"
                          >
                            <Crown
                              className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${i === 0 ? "text-amber-500" : "text-zinc-400"}`}
                            />
                            <span className="line-clamp-2">{p.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {data.hotTools.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      热门工具
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {data.hotTools.map((t) => (
                        <li key={t.id}>
                          <Link
                            href={`/tools/${t.id}`}
                            className="text-xs text-zinc-700 hover:text-violet-700"
                          >
                            {t.name}
                            <span className="ml-1 text-zinc-400">★ {t.avgRating.toFixed(1)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {data.hotModels.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      热门模型
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {data.hotModels.slice(0, 4).map((m) => (
                        <li key={m.id}>
                          <Link
                            href={`/models/${m.id}`}
                            className="text-xs text-zinc-700 hover:text-violet-700"
                          >
                            {m.name}
                            <span className="ml-1 text-zinc-400">★ {m.avgRating.toFixed(1)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>
            ) : null}
          </>
        ) : (
          <section className="glass-panel rounded-2xl p-4 shadow-sm ring-1 ring-white/70">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              快捷入口
            </p>
            <div className="mt-3 space-y-2">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-white/90 px-3 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-violet-300 hover:shadow-sm"
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${item.tone} text-white`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}
