"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Award, Crown, Info, PenLine, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ModelRankCard, type ModelRankRow } from "@/components/models/ModelRankCard";
import { ModelScenarioFilter } from "@/components/models/ModelScenarioFilter";
import { SCENARIO_LABEL } from "@/lib/models/rank";
import { useIsWebMode } from "@/lib/hooks/useIsWebMode";
import clsx from "clsx";

type SortMode = "rank" | "rating" | "reviews" | "new";

type Props = {
  initialModels: ModelRankRow[];
  totalReviews?: number;
};

export function ModelsClient({ initialModels, totalReviews = 0 }: Props) {
  const isWeb = useIsWebMode();
  const t = useTranslations("pages.models");
  const tCommon = useTranslations("common");
  const [scenario, setScenario] = useState("all");
  const [sort, setSort] = useState<SortMode>("rank");
  const [models, setModels] = useState(initialModels);
  const [loading, setLoading] = useState(false);
  const skipFirstFetch = useRef(true);

  useEffect(() => {
    if (skipFirstFetch.current && scenario === "all" && sort === "rank") {
      skipFirstFetch.current = false;
      return;
    }
    skipFirstFetch.current = false;

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const qs = new URLSearchParams({ scenario, sort });
        const res = await fetch(`/api/models?${qs.toString()}`);
        if (!res.ok) return;
        const data = (await res.json()) as { models: ModelRankRow[] };
        if (!cancelled) setModels(data.models ?? []);
      } catch {
        /* keep current */
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [scenario, sort]);

  const list = models;
  const champion = list[0];
  const showTopThree = scenario === "all" && sort === "rank";
  const mainList = showTopThree ? list.slice(3) : list;

  const sortOptions = useMemo(
    () =>
      [
        { id: "rank" as const, label: t("sortOverall") },
        { id: "rating" as const, label: t("sortUserRating") },
        { id: "reviews" as const, label: t("sortReviews") },
        { id: "new" as const, label: t("sortNewest") },
      ] as const,
    [t],
  );

  return (
    <div className={clsx("space-y-4 pb-4", isWeb && "space-y-6")}>
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        right={
          <Link
            href="/home"
            className="rounded-2xl bg-white/80 px-3 py-2 text-[11px] font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-white"
          >
            {t("backDiscover")}
          </Link>
        }
      />

      <section className="relative overflow-hidden rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500 p-[1px] shadow-soft">
        <div className="relative rounded-[22px] bg-zinc-950/92 px-4 py-4">
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-fuchsia-400/30 blur-3xl" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/90">
            {t("communityBuilt")}
          </p>
          <h2 className="mt-1 text-lg font-black text-white">{t("discussBeforeMatch")}</h2>
          <p className="mt-2 max-w-xl text-[11px] leading-relaxed text-zinc-400">
            {t("engageDesc")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={champion ? `/models/${champion.id}` : "/models"}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-zinc-900 hover:bg-zinc-100"
            >
              <PenLine className="h-3.5 w-3.5 text-violet-700" />
              {t("writeReview")}
            </Link>
            <Link
              href={
                champion
                  ? `/publish?type=MODEL_DISCUSSION&modelId=${champion.id}`
                  : "/publish?type=MODEL_DISCUSSION"
              }
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white ring-1 ring-white/20 hover:bg-white/15"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              {t("startDiscussion")}
            </Link>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-200 ring-1 ring-emerald-400/30">
              <Award className="h-3 w-3" />
              {t("firstReviewBadge")}
            </span>
          </div>
          {totalReviews > 0 ? (
            <p className="mt-3 text-[10px] text-zinc-500">
              {t("reviewCount", { count: totalReviews })}
            </p>
          ) : null}
        </div>
      </section>

      {champion ? (
        <section className="rounded-2xl bg-gradient-to-r from-amber-50 via-white to-violet-50 p-3 ring-1 ring-amber-200/60">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
            <Crown className="h-4 w-4" />
            {t("weeklyChampion", { name: champion.name })}
          </p>
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-zinc-700">
            {champion.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {champion.scenarios.slice(0, 4).map((s) => (
              <span
                key={s}
                className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-violet-800 ring-1 ring-violet-200/70"
              >
                {SCENARIO_LABEL[s] ?? s}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-3xl border border-violet-200/40 bg-white/80 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Info className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-zinc-900">{t("whyUserRatings")}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
              {t("whyUserRatingsDesc")}
            </p>
          </div>
        </div>
      </section>

      <div
        className={clsx(
          isWeb && showTopThree && list.length > 0
            ? "xl:grid xl:grid-cols-[minmax(280px,360px)_1fr] xl:gap-6 xl:items-start"
            : "space-y-4",
        )}
      >
        {showTopThree && list.length > 0 ? (
          <section className="rounded-2xl bg-white/80 p-3 ring-1 ring-amber-200/50">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              {t("top3")}
            </p>
            <ol className="mt-2 space-y-2">
              {list.slice(0, 3).map((m, i) => (
                <ModelRankCard key={m.id} model={m} rank={i + 1} />
              ))}
            </ol>
          </section>
        ) : null}

        <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
          <ModelScenarioFilter value={scenario} onChange={setScenario} />
          <div className="mt-3 flex flex-wrap gap-1 rounded-xl bg-zinc-100/80 p-0.5 ring-1 ring-zinc-200/60">
            {sortOptions.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setSort(x.id)}
                className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${
                  sort === x.id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600"
                }`}
              >
                {x.label}
              </button>
            ))}
          </div>
          {loading ? (
            <p className="mt-4 text-center text-xs text-zinc-500">{tCommon("loading")}</p>
          ) : (
            <ul
              className={clsx(
                "mt-4",
                isWeb && !showTopThree ? "grid gap-3 lg:grid-cols-2" : "space-y-2",
              )}
            >
              {mainList.map((m, i) => (
                <li key={m.id}>
                  <ModelRankCard model={m} rank={showTopThree ? i + 4 : i + 1} />
                </li>
              ))}
            </ul>
          )}
          {!loading && mainList.length === 0 ? (
            <p className="mt-4 text-center text-xs text-zinc-600">{t("noModels")}</p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
