"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Target, Users } from "lucide-react";
import { useClientUserId, useCurrentUser } from "@/lib/hooks/useClientUserId";
import type { Role } from "@/lib/domain/role";
import { ROLES, isRole } from "@/lib/domain/role";
import { getRoleLabel, getRoleMatchDesc } from "@/lib/labels";
import {
  getDirectionKeys,
  getKeywordKeys,
  matchAnimDurationMs,
  readMatchAnimMode,
  readMatchIntentChosen,
  writeMatchIntentChosen,
  clearMatchIntentChosen,
  writeMatchAnimMode,
  type MatchAnimMode,
  type MatchIntent,
} from "@/lib/matchUiCopy";
import {
  clearMatchResultCache,
  readMatchResultCache,
  writeMatchResultCache,
  type CachedMatchCandidate,
  type ProfileFingerprint,
} from "@/lib/matchResultCache";
import { completeActivationStep } from "@/lib/activation";
import { completeMission, trackEvent } from "@/lib/retention";
import { PageHeader } from "@/components/PageHeader";
import { MatchProgress } from "./MatchProgress";
import { MatchIntentGate } from "@/components/match/MatchIntentGate";
import { MatchResultsModal } from "@/components/match/MatchResultsModal";

type ProfilePayload = {
  role: Role;
  budgetTier: number;
  intro: string;
  direction: string;
  skillKeywords: string[];
  desiredPartnerRoles: Role[];
  matchIntent: MatchIntent;
};

const BUDGET_TIERS = [0, 1, 2, 3, 4] as const;

export function MatchExperience() {
  const t = useTranslations("match");
  const te = useTranslations("matchExtra");
  const td = useTranslations("matchDirections");
  const tk = useTranslations("matchKeywords");
  const tRoles = useTranslations("roles");
  const userId = useClientUserId();
  const { user: meUser } = useCurrentUser();
  const [kwInput, setKwInput] = useState("");
  const [form, setForm] = useState<ProfilePayload>({
    role: "ADC",
    budgetTier: 2,
    intro: "",
    direction: "",
    skillKeywords: [],
    desiredPartnerRoles: ["JUNGLE", "SUPPORT"],
    matchIntent: "PARTNER",
  });
  const [intentSelected, setIntentSelected] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [running, setRunning] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [results, setResults] = useState<CachedMatchCandidate[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingResult, setPendingResult] = useState<CachedMatchCandidate[] | null>(null);
  const [animMode, setAnimMode] = useState<MatchAnimMode>("fast");

  const isRecruit = form.matchIntent === "RECRUIT";

  useEffect(() => {
    setAnimMode(readMatchAnimMode());
  }, []);

  const keywordKeys = useMemo(() => getKeywordKeys(form.role), [form.role]);
  const directionKeys = useMemo(() => getDirectionKeys(form.role), [form.role]);

  const fingerprint = useMemo(
    (): ProfileFingerprint => ({
      role: form.role,
      budgetTier: form.budgetTier,
      intro: form.intro,
      direction: form.direction,
      skillKeywords: form.skillKeywords,
      desiredPartnerRoles: form.desiredPartnerRoles,
      matchIntent: form.matchIntent,
    }),
    [form],
  );

  const refreshProfile = useCallback(async () => {
    if (!userId) {
      setLoadingProfile(false);
      return;
    }
    setLoadingProfile(true);
    setError(null);
    try {
      const res = await fetch(`/api/profile?userId=${encodeURIComponent(userId)}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(te("profileLoadFail"));
      const data = (await res.json()) as {
        profile: {
          role: string;
          budgetTier: number;
          intro: string;
          direction: string;
          skillKeywords: string[];
          desiredPartnerRoles: string[];
          matchIntent?: string;
        };
      };
      const desired = data.profile.desiredPartnerRoles.filter(isRole);
      const matchIntent: MatchIntent =
        data.profile.matchIntent === "RECRUIT" ? "RECRUIT" : "PARTNER";
      const nextForm: ProfilePayload = {
        role: isRole(data.profile.role) ? data.profile.role : "ADC",
        budgetTier: data.profile.budgetTier,
        intro: data.profile.intro,
        direction: data.profile.direction,
        skillKeywords: data.profile.skillKeywords,
        desiredPartnerRoles: desired.length ? desired : ["JUNGLE"],
        matchIntent,
      };
      setForm(nextForm);
      setIntentSelected(readMatchIntentChosen());
      const cached = readMatchResultCache({ ...nextForm, matchIntent });
      if (cached && cached.length > 0) {
        setResults(cached);
        setResultsOpen(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : te("loadFail"));
    } finally {
      setLoadingProfile(false);
    }
  }, [userId, te]);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const selectIntent = async (intent: MatchIntent) => {
    setForm((f) => ({ ...f, matchIntent: intent }));
    writeMatchIntentChosen();
    setIntentSelected(true);
    if (userId) {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ matchIntent: intent }),
      });
    }
  };

  const toggleDesired = (r: Role) => {
    setForm((f) => {
      const has = f.desiredPartnerRoles.includes(r);
      const desiredPartnerRoles = has
        ? f.desiredPartnerRoles.filter((x) => x !== r)
        : [...f.desiredPartnerRoles, r];
      return { ...f, desiredPartnerRoles };
    });
  };

  const addKeyword = () => {
    const val = kwInput.trim();
    if (!val) return;
    setForm((f) =>
      f.skillKeywords.includes(val) ? f : { ...f, skillKeywords: [...f.skillKeywords, val] },
    );
    setKwInput("");
  };

  const startMatch = async () => {
    if (!userId) {
      setError(t("loginFirst"));
      return;
    }
    if (!intentSelected) {
      setError(te("intentRequired"));
      return;
    }
    if (isRecruit && form.desiredPartnerRoles.length === 0) {
      setError(te("stillNeedRolesRequired"));
      return;
    }
    setError(null);
    clearMatchResultCache();
    setResults(null);
    setPendingResult(null);
    setResultsOpen(false);
    try {
      const put = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form }),
      });
      if (!put.ok) {
        const errBody = (await put.json().catch(() => ({}))) as { error?: string };
        if (errBody.error === "profanity") {
          setError(te("profanityWarning"));
          return;
        }
        throw new Error(t("saveProfileFail"));
      }
      trackEvent("match_run");
      completeMission("match_run");
      completeActivationStep("first_match");
      setRunning(true);
      void fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ limit: 3 }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(te("matchRequestFail"));
          return (await res.json()) as { candidates: CachedMatchCandidate[] };
        })
        .then((data) => setPendingResult(data.candidates))
        .catch((e: unknown) => {
          setRunning(false);
          setError(e instanceof Error ? e.message : te("matchFail"));
        });
    } catch (e) {
      setRunning(false);
      setError(e instanceof Error ? e.message : te("matchFail"));
    }
  };

  const onProgressDone = () => {
    setRunning(false);
  };

  useEffect(() => {
    if (!running && pendingResult) {
      setResults(pendingResult);
      writeMatchResultCache(fingerprint, pendingResult);
      setResultsOpen(true);
    }
  }, [running, pendingResult, fingerprint]);

  const closeResults = () => setResultsOpen(false);

  const rematch = () => {
    clearMatchResultCache();
    setResultsOpen(false);
    void startMatch();
  };

  return (
    <div className="space-y-4 pb-28">
      <PageHeader
        title={t("title")}
        subtitle={
          meUser
            ? `${t("subtitle")}${t("subtitleUser", { name: meUser.displayName })}`
            : t("subtitle")
        }
      />

      {!intentSelected && !loadingProfile ? (
        <MatchIntentGate value={form.matchIntent} onSelect={(i) => void selectIntent(i)} />
      ) : null}

      {loadingProfile ? (
        <p className="text-sm text-zinc-500">{t("loadingProfile")}</p>
      ) : intentSelected ? (
        <div className="mx-auto max-w-xl space-y-5 rounded-3xl bg-white/80 p-4 shadow-soft ring-1 ring-white/70 backdrop-blur">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold text-violet-700">
              {isRecruit ? te("intentRecruitTitle") : te("intentPartnerTitle")}
            </p>
            <button
              type="button"
              onClick={() => {
                clearMatchIntentChosen();
                setIntentSelected(false);
              }}
              className="text-[11px] font-medium text-zinc-500 hover:text-violet-700"
            >
              {te("changeIntent")}
            </button>
          </div>

          {!isRecruit ? (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
                <Target className="h-3.5 w-3.5 text-violet-600" />
                {te("myRole")}
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-500">{te("myRoleHint")}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r }))}
                    className={`rounded-2xl border px-3 py-3 text-left text-xs transition ${
                      form.role === r
                        ? "border-violet-400 bg-violet-50 text-violet-950 shadow-sm ring-1 ring-violet-200/60"
                        : "border-zinc-200/90 bg-white/60 hover:border-violet-200 hover:bg-violet-50/30"
                    }`}
                  >
                    <span className="block font-semibold">{getRoleLabel(tRoles, r)}</span>
                    <span className="mt-1.5 block text-[10px] leading-relaxed text-zinc-600">
                      {getRoleMatchDesc(tRoles, r)}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
                <Users className="h-3.5 w-3.5 text-violet-600" />
                {te("stillNeedRoles")}
              </div>
              <p className="text-[11px] text-zinc-500">{te("stillNeedRolesHint")}</p>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleDesired(r)}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${
                      form.desiredPartnerRoles.includes(r)
                        ? "border-violet-400 bg-violet-50 text-violet-900 shadow-sm"
                        : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                    }`}
                  >
                    {getRoleLabel(tRoles, r)}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-2">
            <p className="text-xs font-semibold text-zinc-900">{te("budgetTier")}</p>
            <p className="text-[11px] text-zinc-500">{te("budgetTierHint")}</p>
            <select
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm"
              value={form.budgetTier}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  budgetTier: Number(e.target.value),
                }))
              }
            >
              {BUDGET_TIERS.map((tier) => (
                <option key={tier} value={tier}>
                  {te(`budgetTier${tier}` as "budgetTier0")}
                </option>
              ))}
            </select>
          </section>

          <section className="space-y-2">
            <p className="text-xs font-semibold text-zinc-900">{te("skillKeywords")}</p>
            <p className="text-[11px] text-zinc-500">{te("skillKeywordsHint")}</p>
            <div className="flex flex-wrap gap-1.5">
              {keywordKeys.map((key) => {
                const label = tk(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setForm((f) =>
                        f.skillKeywords.includes(label)
                          ? f
                          : { ...f, skillKeywords: [...f.skillKeywords, label] },
                      )
                    }
                    className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-medium text-zinc-700 ring-1 ring-zinc-200/80 hover:bg-violet-50 hover:text-violet-900 hover:ring-violet-200/80"
                  >
                    + {label}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                placeholder={te("kwPlaceholder")}
                value={kwInput}
                onChange={(e) => setKwInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKeyword()}
              />
              <button
                type="button"
                onClick={addKeyword}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2 text-xs font-semibold text-white hover:opacity-95"
              >
                {te("add")}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.skillKeywords.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      skillKeywords: f.skillKeywords.filter((x) => x !== k),
                    }))
                  }
                  className="rounded-full bg-violet-100/80 px-2.5 py-1 text-[11px] font-medium text-violet-900 ring-1 ring-violet-200/60"
                >
                  {k} ×
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs font-semibold text-zinc-900">{te("direction")}</p>
            <p className="text-[11px] text-zinc-500">{te("directionHint")}</p>
            <div className="flex flex-wrap gap-1.5">
              {directionKeys.map((key) => {
                const label = td(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, direction: label }))}
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition ${
                      form.direction === label
                        ? "border-violet-400 bg-violet-50 text-violet-900"
                        : "border-zinc-200/90 bg-white text-zinc-600 hover:border-violet-200"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <input
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              value={form.direction}
              onChange={(e) => setForm((f) => ({ ...f, direction: e.target.value }))}
              placeholder={te("directionPlaceholder")}
            />
          </section>

          {!isRecruit ? (
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
                <Users className="h-3.5 w-3.5 text-violet-600" />
                {te("desiredPartner")}
              </div>
              <p className="text-[11px] text-zinc-500">{te("desiredPartnerHint")}</p>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleDesired(r)}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${
                      form.desiredPartnerRoles.includes(r)
                        ? "border-violet-400 bg-violet-50 text-violet-900 shadow-sm"
                        : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                    }`}
                  >
                    {getRoleLabel(tRoles, r)}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          <section className="space-y-2">
            <p className="text-xs font-semibold text-zinc-900">{te("intro")}</p>
            <p className="text-[11px] text-zinc-500">{te("introHint")}</p>
            <textarea
              className="min-h-[96px] w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm leading-relaxed"
              value={form.intro}
              onChange={(e) => setForm((f) => ({ ...f, intro: e.target.value }))}
              placeholder={te("introPlaceholder")}
            />
          </section>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-600">
            <span>{te("animModeLabel")}</span>
            {(
              [
                ["fast", te("animFast")],
                ["normal", te("animNormal")],
                ["ritual", te("animRitual")],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  writeMatchAnimMode(m);
                  setAnimMode(m);
                }}
                className={`rounded-full border px-2.5 py-1 font-medium transition ${
                  animMode === m
                    ? "border-violet-400 bg-violet-50 text-violet-900"
                    : "border-zinc-200 bg-white text-zinc-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {results && results.length > 0 && !resultsOpen ? (
            <button
              type="button"
              onClick={() => setResultsOpen(true)}
              className="w-full rounded-2xl border border-violet-200 bg-violet-50 py-3 text-sm font-semibold text-violet-900 hover:bg-violet-100"
            >
              {te("viewLastResults", { count: results.length })}
            </button>
          ) : null}

          <button
            type="button"
            disabled={running}
            onClick={() => void startMatch()}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-60"
          >
            {t("startMatch")} (
            {animMode === "fast"
              ? t("durationFast")
              : animMode === "normal"
                ? t("durationNormal")
                : t("durationRitual")}
            )
          </button>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
        </div>
      ) : null}

      <MatchResultsModal
        open={resultsOpen}
        results={results}
        running={running}
        onClose={closeResults}
        onRematch={rematch}
      />

      <MatchProgress
        active={running}
        durationMs={matchAnimDurationMs(animMode)}
        onComplete={onProgressDone}
        onSkip={onProgressDone}
        onCancel={() => {
          setRunning(false);
          setPendingResult(null);
        }}
      />
    </div>
  );
}
