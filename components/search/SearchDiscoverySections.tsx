"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Cpu, Crown, Flame, Sparkles, Users } from "lucide-react";
import { HomeCommunityHub } from "@/components/home/HomeCommunityHub";

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
    reviewCount: number;
  }[];
};

const rankTone = ["text-amber-600", "text-zinc-500", "text-orange-500"] as const;

export function SearchDiscoverySections() {
  const t = useTranslations("homeUi.hotRanking");
  const tSearch = useTranslations("pages.search");
  const tw = useTranslations("webShell");
  const [data, setData] = useState<RailData | null>(null);

  useEffect(() => {
    void fetch("/api/home/rail")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: RailData | null) => setData(d))
      .catch(() => setData(null));
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <Link
          href="/match"
          className="flex items-center gap-3 rounded-2xl border border-cyan-200/80 bg-gradient-to-br from-sky-50 to-white p-3 ring-1 ring-cyan-100/80 transition hover:shadow-md"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-cyan-600 text-white">
            <Users className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-zinc-950">{tSearch("findPartnerTitle")}</p>
            <p className="text-[10px] text-zinc-600">{tSearch("findPartnerDesc")}</p>
          </div>
        </Link>
        <Link
          href="/models"
          className="flex items-center gap-3 rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-50 to-white p-3 ring-1 ring-violet-100/80 transition hover:shadow-md"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-zinc-950">{tSearch("modelCtaTitle")}</p>
            <p className="text-[10px] text-zinc-600">{tSearch("modelCtaDesc")}</p>
          </div>
        </Link>
      </div>

      <HomeCommunityHub
        modelCount={data?.modelCount ?? 0}
        reviewCount={data?.reviewCount ?? 0}
      />

      {data &&
      (data.hotPosts.length > 0 || data.hotTools.length > 0 || data.hotModels.length > 0) ? (
        <section className="space-y-2 rounded-2xl border border-zinc-200/80 bg-white/80 p-3 shadow-sm">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-700">
                {t("label")}
              </p>
              <h2 className="text-sm font-bold text-zinc-950">{t("title")}</h2>
            </div>
            <Link
              href="/models"
              className="text-[10px] font-semibold text-violet-700 hover:underline"
            >
              {t("fullModelRank")}
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-orange-50/80 p-2.5 ring-1 ring-orange-200/60">
              <p className="flex items-center gap-1 text-xs font-semibold text-zinc-900">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                {tw("hotPosts")}
              </p>
              <ul className="mt-1.5 space-y-1">
                {data.hotPosts.slice(0, 5).map((p, i) => (
                  <li key={p.id}>
                    <Link
                      href={`/post/${p.id}`}
                      className="flex items-center justify-between gap-1 text-[11px] text-zinc-700 hover:text-violet-800"
                    >
                      <span className="truncate">
                        <span className={`font-bold ${rankTone[i] ?? "text-zinc-400"}`}>
                          {i + 1}.{" "}
                        </span>
                        {p.title}
                      </span>
                      <span className="shrink-0 text-[10px] text-zinc-500">{p.likes}♥</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-rose-50/80 p-2.5 ring-1 ring-rose-200/60">
              <p className="flex items-center gap-1 text-xs font-semibold text-zinc-900">
                <Flame className="h-3.5 w-3.5 text-rose-500" />
                {tw("hotTools")}
              </p>
              <ul className="mt-1.5 space-y-1">
                {data.hotTools.slice(0, 5).map((tool, i) => (
                  <li key={tool.id}>
                    <Link
                      href={`/tools/${tool.id}`}
                      className="flex items-center justify-between gap-1 text-[11px] text-zinc-700 hover:text-violet-800"
                    >
                      <span className="truncate">
                        <span className={`font-bold ${rankTone[i] ?? "text-zinc-400"}`}>
                          {i + 1}.{" "}
                        </span>
                        {tool.name}
                      </span>
                      <span className="shrink-0 text-[10px] text-zinc-500">
                        {tool.avgRating.toFixed(1)}★
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-violet-50/80 p-2.5 ring-1 ring-violet-200/60 sm:col-span-1">
              <p className="flex items-center gap-1 text-xs font-semibold text-zinc-900">
                <Cpu className="h-3.5 w-3.5 text-violet-600" />
                {t("modelReputation")}
              </p>
              <ul className="mt-1.5 space-y-1">
                {data.hotModels.slice(0, 5).map((m, i) => (
                  <li key={m.id}>
                    <Link
                      href={`/models/${m.id}`}
                      className="flex items-center justify-between gap-1 text-[11px] text-zinc-700 hover:text-violet-800"
                    >
                      <span className="truncate">
                        {i === 0 ? (
                          <Crown className="mr-0.5 inline h-3 w-3 text-amber-500" />
                        ) : (
                          <span className={`font-bold ${rankTone[i] ?? "text-zinc-400"}`}>
                            {i + 1}.{" "}
                          </span>
                        )}
                        {m.name}
                      </span>
                      <span className="shrink-0 text-[10px] text-zinc-500">
                        {m.avgRating.toFixed(1)}★
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/models"
                className="mt-1.5 inline-flex text-[10px] font-semibold text-violet-700 hover:underline"
              >
                {t("reviewCta")}
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
