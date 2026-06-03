"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronRight, Sparkles, Users } from "lucide-react";
import { HomeCommunityHub } from "@/components/home/HomeCommunityHub";
import {
  SearchTrendingBoard,
  type TrendingRailData,
} from "@/components/search/SearchTrendingBoard";

type RailData = TrendingRailData & {
  modelCount: number;
  reviewCount: number;
};

export function SearchDiscoverySections() {
  const tSearch = useTranslations("pages.search");
  const [data, setData] = useState<RailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/api/home/rail")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: RailData | null) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const hasTrending =
    data &&
    (data.hotPosts.length > 0 || data.hotTools.length > 0 || data.hotModels.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link
          href="/match"
          className="flex min-w-[9.5rem] shrink-0 items-center gap-2.5 rounded-2xl border border-cyan-200/70 bg-gradient-to-br from-sky-50 via-white to-cyan-50/50 p-3 shadow-sm transition hover:shadow-md active:scale-[0.98]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20">
            <Users className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <p className="text-xs font-bold text-zinc-950">{tSearch("findPartnerTitle")}</p>
            <p className="mt-0.5 line-clamp-1 text-[10px] text-zinc-600">{tSearch("findPartnerDesc")}</p>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-cyan-600/70" />
        </Link>
        <Link
          href="/models"
          className="flex min-w-[9.5rem] shrink-0 items-center gap-2.5 rounded-2xl border border-violet-200/70 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/50 p-3 shadow-sm transition hover:shadow-md active:scale-[0.98]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <p className="text-xs font-bold text-zinc-950">{tSearch("modelCtaTitle")}</p>
            <p className="mt-0.5 line-clamp-1 text-[10px] text-zinc-600">{tSearch("modelCtaDesc")}</p>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-violet-600/70" />
        </Link>
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-[1.35rem] bg-gradient-to-br from-orange-100 to-violet-100" />
      ) : hasTrending ? (
        <SearchTrendingBoard data={data} />
      ) : null}

      <HomeCommunityHub
        modelCount={data?.modelCount ?? 0}
        reviewCount={data?.reviewCount ?? 0}
      />
    </div>
  );
}
