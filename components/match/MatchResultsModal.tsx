"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { MatchBreakdownBars, matchScoreIndex } from "@/components/match/MatchBreakdownBars";
import { startConversation } from "@/lib/chat/client";
import { getRoleLabel } from "@/lib/labels";
import { isRole } from "@/lib/domain/role";
import type { CachedMatchCandidate } from "@/lib/matchResultCache";

type Props = {
  open: boolean;
  results: CachedMatchCandidate[] | null;
  running: boolean;
  onClose: () => void;
  onRematch: () => void;
};

export function MatchResultsModal({
  open,
  results,
  running,
  onClose,
  onRematch,
}: Props) {
  const t = useTranslations("match");
  const te = useTranslations("matchExtra");
  const tRoles = useTranslations("roles");
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-results-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl ring-1 ring-zinc-200/80 sm:max-w-2xl sm:rounded-3xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-100 px-4 py-4">
          <div>
            <h2 id="match-results-title" className="text-base font-bold text-zinc-950">
              {t("resultsTitle")}
            </h2>
            {results && results.length > 0 ? (
              <p className="mt-1 text-[11px] text-zinc-500">
                {t("resultsCount", { count: results.length })}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 gap-2">
            {results && results.length > 0 ? (
              <button
                type="button"
                disabled={running}
                onClick={onRematch}
                className="rounded-xl bg-violet-100 px-3 py-2 text-xs font-semibold text-violet-900 ring-1 ring-violet-200/80 hover:bg-violet-50 disabled:opacity-50"
              >
                {t("rematch")}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              aria-label={te("closeResults")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {results && results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300/80 bg-zinc-50 p-6 text-center text-sm text-zinc-600">
              <p className="font-medium text-zinc-800">{t("noCandidates")}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
                {t("noCandidatesHint")}
              </p>
            </div>
          ) : null}

          {results && results.length > 0 ? (
            <ul className="space-y-4">
              {results.map((c, idx) => {
                const idxInfo = matchScoreIndex(c.score);
                const openRow = expandedId === c.userId;
                return (
                  <li
                    key={c.userId}
                    className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-zinc-200/70"
                  >
                    <div className="p-4">
                      <div className="flex gap-3">
                        <UserAvatar
                          userId={c.userId}
                          displayName={c.displayName}
                          avatarUrl={c.avatarUrl}
                          size="md"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="truncate text-sm font-semibold text-zinc-900">
                                {c.displayName}
                              </p>
                              <p className="text-[11px] text-zinc-500">
                                {isRole(c.role) ? getRoleLabel(tRoles, c.role) : c.role}
                                {c.direction ? (
                                  <span className="text-zinc-400"> · {c.direction}</span>
                                ) : null}
                              </p>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-1">
                              <span className="rounded-full bg-violet-700 px-2 py-0.5 text-[10px] font-bold text-white">
                                #{idx + 1}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${idxInfo.className}`}
                              >
                                {t(idxInfo.tierKey)} · {idxInfo.n}
                              </span>
                            </div>
                          </div>
                          {c.introPreview ? (
                            <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-zinc-600">
                              「{c.introPreview}」
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <ul className="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
                        {(openRow ? c.reasons : c.reasons.slice(0, 2)).map((r, ri) => (
                          <li
                            key={`${c.userId}-r-${ri}`}
                            className="flex gap-2 text-[11px] leading-relaxed text-zinc-700"
                          >
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                      {c.reasons.length > 2 ? (
                        <button
                          type="button"
                          onClick={() => setExpandedId(openRow ? null : c.userId)}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 hover:text-violet-900"
                        >
                          {openRow ? (
                            <>
                              {te("collapseReasons")} <ChevronUp className="h-3.5 w-3.5" />
                            </>
                          ) : (
                            <>
                              {te("expandReasons", { count: c.reasons.length })}{" "}
                              <ChevronDown className="h-3.5 w-3.5" />
                            </>
                          )}
                        </button>
                      ) : null}

                      {openRow ? <MatchBreakdownBars b={c.breakdown} /> : null}

                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <button
                          type="button"
                          className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2.5 text-xs font-semibold text-white hover:opacity-95"
                          onClick={() => {
                            const intent = te("matchIntent", {
                              name: c.displayName,
                              role: isRole(c.role) ? getRoleLabel(tRoles, c.role) : c.role,
                            });
                            void startConversation(c.userId, {
                              source: "match",
                              contextTitle: te("matchContextTitle"),
                              draftMessage: intent,
                            }).then(() => {
                              router.push(
                                `/messages?peer=${encodeURIComponent(c.userId)}&intent=match`,
                              );
                            });
                          }}
                        >
                          {te("reachOut")}
                        </button>
                        <Link
                          href={`/user/${encodeURIComponent(c.userId)}?from=match`}
                          className="inline-flex items-center justify-center rounded-2xl bg-white px-3 py-2.5 text-xs font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
                        >
                          {te("viewProfile")}
                        </Link>
                        <Link
                          href="/tools"
                          className="inline-flex items-center justify-center rounded-2xl bg-brand-50 px-3 py-2.5 text-xs font-semibold text-brand-950 ring-1 ring-brand-200/70 hover:bg-white"
                        >
                          {te("shareTools")}
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
