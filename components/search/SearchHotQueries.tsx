"use client";

import { Clock, Flame, TrendingUp, X } from "lucide-react";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { SEARCH_HOT_WORDS } from "@/lib/searchHot";

type Props = {
  history: string[];
  onPick: (q: string) => void;
  onClearHistory?: () => void;
};

const HOT_BADGES = ["hot", "new", null, "hot", null, "new", "hot", null] as const;

export function SearchHotQueries({ history, onPick, onClearHistory }: Props) {
  const t = useTranslations("pages.search");

  if (history.length === 0 && SEARCH_HOT_WORDS.length === 0) return null;

  return (
    <div className="space-y-4">
      {history.length > 0 ? (
        <section>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              {t("history")}
            </h3>
            {onClearHistory ? (
              <button
                type="button"
                onClick={onClearHistory}
                className="inline-flex items-center gap-0.5 text-[11px] font-medium text-zinc-500 hover:text-zinc-800"
              >
                <X className="h-3 w-3" />
                {t("clearHistory")}
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => onPick(h)}
                className="rounded-full border border-zinc-200/90 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-900 active:scale-95"
              >
                {h}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {SEARCH_HOT_WORDS.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-100 bg-gradient-to-r from-amber-50 to-orange-50/80 px-3 py-2.5">
            <h3 className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              {t("hotSearchTitle")}
            </h3>
            <span className="text-[10px] font-medium text-orange-700/80">{t("hotSearchHint")}</span>
          </div>
          <ol className="divide-y divide-zinc-50">
            {SEARCH_HOT_WORDS.map((word, i) => {
              const badge = HOT_BADGES[i % HOT_BADGES.length];
              return (
                <li key={word}>
                  <button
                    type="button"
                    onClick={() => onPick(word)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-zinc-50 active:bg-violet-50/50"
                  >
                    <span
                      className={clsx(
                        "w-5 shrink-0 text-center text-sm font-black tabular-nums",
                        i === 0 && "text-red-500",
                        i === 1 && "text-orange-500",
                        i === 2 && "text-amber-600",
                        i > 2 && "text-zinc-400",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">
                      {word}
                    </span>
                    {badge === "hot" ? (
                      <span className="shrink-0 rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        {t("badgeHot")}
                      </span>
                    ) : badge === "new" ? (
                      <span className="shrink-0 rounded bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        {t("badgeNew")}
                      </span>
                    ) : (
                      <Flame
                        className={clsx(
                          "h-3.5 w-3.5 shrink-0",
                          i < 3 ? "text-orange-400" : "text-zinc-300",
                        )}
                        aria-hidden
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
