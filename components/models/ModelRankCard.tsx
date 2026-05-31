"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Crown, Flame, MessageSquare, Star } from "lucide-react";

export type ModelRankRow = {
  id: string;
  name: string;
  provider: string;
  description: string;
  logoUrl: string;
  avgRating: number;
  reviewCount: number;
  rankScore: number;
  scenarios: string[];
};

type Props = {
  model: ModelRankRow;
  rank: number;
};

function StarBar({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <span className="inline-flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-2.5 w-2.5 ${
            s <= filled ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"
          }`}
        />
      ))}
    </span>
  );
}

export function ModelRankCard({ model, rank }: Props) {
  const t = useTranslations("modelRank");
  const tScenario = useTranslations("modelRank.scenarios");
  const isHot = model.reviewCount >= 3 || model.avgRating >= 4.5;

  const scenarioLabel = (id: string) => tScenario.has(id as "coding") ? tScenario(id as "coding") : id;

  return (
    <Link
      href={`/models/${model.id}`}
      className="group flex items-start gap-3 rounded-2xl bg-white/90 p-3 ring-1 ring-zinc-200/70 transition hover:-translate-y-0.5 hover:ring-violet-300/60 hover:shadow-[0_16px_40px_-22px_rgba(139,92,246,0.35)]"
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
          rank === 1
            ? "bg-gradient-to-br from-amber-400 to-rose-500 text-white shadow-sm"
            : rank === 2
              ? "bg-gradient-to-br from-zinc-300 to-zinc-500 text-white"
              : rank === 3
                ? "bg-gradient-to-br from-orange-300 to-amber-500 text-white"
                : "bg-zinc-100 text-zinc-700"
        }`}
      >
        {rank <= 3 ? <Crown className="h-3.5 w-3.5" /> : rank}
      </span>
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-violet-100 ring-1 ring-violet-100">
        {model.logoUrl ? (
          <Image src={model.logoUrl} alt="" fill className="object-cover" unoptimized />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm font-bold text-violet-800">
            {model.name.slice(0, 1)}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-zinc-950 group-hover:text-violet-900">
              {model.name}
            </p>
            <p className="text-[10px] font-medium text-zinc-500">{model.provider}</p>
          </div>
          {isHot ? (
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 ring-1 ring-rose-200/70">
              <Flame className="h-2.5 w-2.5" />
              {t("hot")}
            </span>
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-zinc-600">
          {model.description}
        </p>
        {model.scenarios.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {model.scenarios.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-full bg-violet-50 px-1.5 py-0.5 text-[9px] font-medium text-violet-800 ring-1 ring-violet-100"
              >
                {scenarioLabel(s)}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-900 ring-1 ring-amber-200/70">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            {model.avgRating.toFixed(1)}
          </span>
          <StarBar rating={model.avgRating} />
          <span className="text-zinc-500">{t("reviewCount", { count: model.reviewCount })}</span>
          <span className="font-mono text-violet-700">
            {t("overall", { score: model.rankScore.toFixed(1) })}
          </span>
        </div>
      </div>
      <MessageSquare className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition group-hover:text-violet-600" />
    </Link>
  );
}
