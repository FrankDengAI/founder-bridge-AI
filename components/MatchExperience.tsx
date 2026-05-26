"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";
import { useClientUserId, useCurrentUser } from "@/lib/hooks/useClientUserId";
import type { Role } from "@/lib/domain/role";
import { ROLES, isRole } from "@/lib/domain/role";
import { getRoleLabel, getRoleMatchDesc } from "@/lib/labels";
import type { ScoreBreakdown } from "@/lib/matching/types";
import {
  MATCH_BREAKDOWN_LABELS,
  getDirectionPresets,
  getKeywordSuggestions,
  matchAnimDurationMs,
  readMatchAnimMode,
  type MatchAnimMode,
  writeMatchAnimMode,
} from "@/lib/matchUiCopy";
import { completeActivationStep } from "@/lib/activation";
import { completeMission, trackEvent } from "@/lib/retention";
import { startConversation } from "@/lib/chat/client";
import { PageHeader } from "@/components/PageHeader";
import { MatchProgress } from "./MatchProgress";

type ProfilePayload = {
  role: Role;
  budgetTier: number;
  intro: string;
  direction: string;
  skillKeywords: string[];
  desiredPartnerRoles: Role[];
};

type MatchCandidate = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
  score: number;
  breakdown: ScoreBreakdown;
  reasons: string[];
  introPreview?: string;
  direction?: string;
};

function scoreIndex(score: number) {
  const n = Math.round(Math.min(1, Math.max(0, score)) * 100);
  if (n >= 76) return { n, tierKey: "tierHigh" as const, className: "bg-emerald-50 text-emerald-900 ring-emerald-200/80" };
  if (n >= 58) return { n, tierKey: "tierMid" as const, className: "bg-amber-50 text-amber-950 ring-amber-200/80" };
  return { n, tierKey: "tierExplore" as const, className: "bg-zinc-100 text-zinc-700 ring-zinc-200/80" };
}

/** 维度配色（与品牌站雷达图色系一致） */
const DIM_COLOR: Record<keyof ScoreBreakdown, { bar: string; chip: string }> = {
  role: { bar: "from-violet-500 to-fuchsia-500", chip: "text-violet-700 bg-violet-100" },
  keywords: { bar: "from-fuchsia-500 to-rose-500", chip: "text-fuchsia-700 bg-fuchsia-100" },
  direction: { bar: "from-cyan-500 to-violet-500", chip: "text-cyan-700 bg-cyan-100" },
  interest: { bar: "from-amber-500 to-rose-500", chip: "text-amber-700 bg-amber-100" },
  reciprocity: { bar: "from-rose-500 to-pink-500", chip: "text-rose-700 bg-rose-100" },
  budget: { bar: "from-emerald-500 to-cyan-500", chip: "text-emerald-700 bg-emerald-100" },
  activity: { bar: "from-lime-500 to-emerald-500", chip: "text-lime-700 bg-lime-100" },
};

/** 候选 mini 雷达图（SVG） */
function CandidateRadar({ b }: { b: ScoreBreakdown }) {
  const keys = Object.keys(MATCH_BREAKDOWN_LABELS) as (keyof ScoreBreakdown)[];
  const cx = 70;
  const cy = 70;
  const max = 56;
  const step = (Math.PI * 2) / keys.length;
  const pts = keys
    .map((k, i) => {
      const a = -Math.PI / 2 + i * step;
      const r = Math.min(1, Math.max(0, b[k])) * max;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    })
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  return (
    <svg viewBox="0 0 140 140" className="h-32 w-32">
      <defs>
        <radialGradient id="cand-radar-fill" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(167,139,250,0.45)" />
          <stop offset="100%" stopColor="rgba(236,72,153,0.18)" />
        </radialGradient>
      </defs>
      {[0.33, 0.66, 1].map((r, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={max * r}
          fill="none"
          stroke="rgba(139,92,246,0.18)"
          strokeWidth="0.7"
        />
      ))}
      {keys.map((_, i) => {
        const a = -Math.PI / 2 + i * step;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * max}
            y2={cy + Math.sin(a) * max}
            stroke="rgba(139,92,246,0.15)"
            strokeWidth="0.7"
          />
        );
      })}
      <polygon
        points={pts}
        fill="url(#cand-radar-fill)"
        stroke="rgba(124,58,237,0.85)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {keys.map((k, i) => {
        const a = -Math.PI / 2 + i * step;
        const r = Math.min(1, Math.max(0, b[k])) * max;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        return <circle key={k} cx={x} cy={y} r="2" fill="#7c3aed" />;
      })}
    </svg>
  );
}

function BreakdownBars({ b }: { b: ScoreBreakdown }) {
  const entries = (Object.keys(MATCH_BREAKDOWN_LABELS) as (keyof ScoreBreakdown)[]).map(
    (key) => ({
      key,
      value: b[key],
      ...MATCH_BREAKDOWN_LABELS[key],
    }),
  );
  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-[auto_1fr] sm:gap-4">
      {/* 左侧 mini 雷达 */}
      <div className="flex justify-center sm:block">
        <CandidateRadar b={b} />
      </div>
      {/* 右侧逐项 bar */}
      <div className="space-y-2.5">
        {entries.map((row) => {
          const c = DIM_COLOR[row.key];
          const pct = Math.round(Math.min(1, row.value) * 100);
          return (
            <div key={row.key}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-zinc-800">
                  {row.title}
                </span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono font-semibold tabular-nums ${c.chip}`}
                >
                  {pct}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${c.bar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-0.5 text-[10px] leading-snug text-zinc-500">
                {row.hint}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const BUDGET_OPTIONS = [
  { tier: 0, label: "暂不出资（先找伙伴）" },
  { tier: 1, label: "小额试水" },
  { tier: 2, label: "可投入中等预算" },
  { tier: 3, label: "较高预算" },
  { tier: 4, label: "资金充足" },
] as const;

export function MatchExperience() {
  const t = useTranslations("match");
  const tNav = useTranslations("nav");
  const tRoles = useTranslations("roles");
  const router = useRouter();
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
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<MatchCandidate[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingResult, setPendingResult] = useState<MatchCandidate[] | null>(
    null,
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [animMode, setAnimMode] = useState<MatchAnimMode>("fast");

  useEffect(() => {
    setAnimMode(readMatchAnimMode());
  }, []);

  const keywordSuggestions = useMemo(
    () => getKeywordSuggestions(form.role),
    [form.role],
  );
  const directionPresets = useMemo(
    () => getDirectionPresets(form.role),
    [form.role],
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
      if (!res.ok) throw new Error("资料加载失败");
      const data = (await res.json()) as {
        profile: {
          role: string;
          budgetTier: number;
          intro: string;
          direction: string;
          skillKeywords: string[];
          desiredPartnerRoles: string[];
        };
      };
      const desired = data.profile.desiredPartnerRoles.filter(isRole);
      setForm({
        role: isRole(data.profile.role) ? data.profile.role : "ADC",
        budgetTier: data.profile.budgetTier,
        intro: data.profile.intro,
        direction: data.profile.direction,
        skillKeywords: data.profile.skillKeywords,
        desiredPartnerRoles: desired.length ? desired : ["JUNGLE"],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    } finally {
      setLoadingProfile(false);
    }
  }, [userId]);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

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
    const t = kwInput.trim();
    if (!t) return;
    setForm((f) =>
      f.skillKeywords.includes(t)
        ? f
        : { ...f, skillKeywords: [...f.skillKeywords, t] },
    );
    setKwInput("");
  };

  const startMatch = async () => {
    if (!userId) {
      setError(t("loginFirst"));
      return;
    }
    setError(null);
    setResults(null);
    setPendingResult(null);
    try {
      const put = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form }),
      });
      if (!put.ok) throw new Error(t("saveProfileFail"));
      trackEvent("match_run");
      completeMission("match_run");
      completeActivationStep("first_match");
      setRunning(true);
      void fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ limit: 10 }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("匹配请求失败");
          return (await res.json()) as { candidates: MatchCandidate[] };
        })
        .then((data) => setPendingResult(data.candidates))
        .catch((e: unknown) => {
          setRunning(false);
          setError(e instanceof Error ? e.message : "匹配失败");
        });
    } catch (e) {
      setRunning(false);
      setError(e instanceof Error ? e.message : "匹配失败");
    }
  };

  const onProgressDone = () => {
    setRunning(false);
  };

  useEffect(() => {
    if (!running && pendingResult) {
      setResults(pendingResult);
    }
  }, [running, pendingResult]);

  return (
    <div className="space-y-4 pb-28">
      <PageHeader
        title={t("title")}
        subtitle={
          meUser
            ? `${t("subtitle")}${t("subtitleUser", { name: meUser.displayName })}`
            : t("subtitle")
        }
        right={
          <Link
            href="/messages"
            className="rounded-2xl bg-white/80 px-3 py-2 text-[11px] font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-white"
          >
            {tNav("messages")}
          </Link>
        }
      />

      <section className="rounded-3xl bg-gradient-to-br from-violet-600/10 via-white/80 to-fuchsia-600/10 p-4 shadow-soft ring-1 ring-white/80 backdrop-blur">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-violet-200/60">
            <Lightbulb className="h-5 w-5 text-violet-600" />
          </span>
          <div className="min-w-0 space-y-2 text-xs leading-relaxed text-zinc-700">
            <p className="font-semibold text-zinc-900">匹配在做什么？</p>
            <ul className="list-inside list-disc space-y-1 text-[11px] text-zinc-600">
              <li>用 MOBA 角色隐喻「增长 / 产品运营 / 技术交付」三类创业分工，计算与你互补的程度。</li>
              <li>结合能力关键词、创业方向、资金档位与资料新鲜度，输出可解释的分数与理由。</li>
              <li>点击下方按钮会先保存当前表单，再进入动效（默认快速 3 秒，可跳过）；真实计算在服务端毫秒级完成。</li>
            </ul>
          </div>
        </div>
      </section>

      {loadingProfile ? (
        <p className="text-sm text-zinc-500">{t("loadingProfile")}</p>
      ) : (
        <div className="space-y-5 rounded-3xl bg-white/80 p-4 shadow-soft ring-1 ring-white/70 backdrop-blur">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
              <Target className="h-3.5 w-3.5 text-violet-600" />
              我的创业角色
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-500">
              三选一即可，后续仍可在「我的」或本页随时修改；角色会进入匹配算法的「互补矩阵」。
            </p>
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

          <section className="space-y-2">
            <p className="text-xs font-semibold text-zinc-900">资金意愿档位</p>
            <p className="text-[11px] text-zinc-500">
              用于估算「投入节奏」是否接近；差一档仍可能匹配，差太多算法会适度降权。
            </p>
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
              {BUDGET_OPTIONS.map((o) => (
                <option key={o.tier} value={o.tier}>
                  {o.label}
                </option>
              ))}
            </select>
          </section>

          <section className="space-y-2">
            <p className="text-xs font-semibold text-zinc-900">能力关键词</p>
            <p className="text-[11px] text-zinc-500">
              写你「能交付什么」：与首页/笔记里的技能标签越一致，与种子用户的 Jaccard 重叠越高。
            </p>
            <div className="flex flex-wrap gap-1.5">
              {keywordSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    setForm((f) =>
                      f.skillKeywords.includes(s)
                        ? f
                        : { ...f, skillKeywords: [...f.skillKeywords, s] },
                    )
                  }
                  className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-medium text-zinc-700 ring-1 ring-zinc-200/80 hover:bg-violet-50 hover:text-violet-900 hover:ring-violet-200/80"
                >
                  + {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                placeholder="自定义，例如：Rust / 投放策略"
                value={kwInput}
                onChange={(e) => setKwInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKeyword()}
              />
              <button
                type="button"
                onClick={addKeyword}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2 text-xs font-semibold text-white hover:opacity-95"
              >
                添加
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
            <p className="text-xs font-semibold text-zinc-900">创业方向</p>
            <p className="text-[11px] text-zinc-500">一句话描述赛道或场景，可点选下方快捷短语再微调。</p>
            <div className="flex flex-wrap gap-1.5">
              {directionPresets.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, direction: d }))}
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition ${
                    form.direction === d
                      ? "border-violet-400 bg-violet-50 text-violet-900"
                      : "border-zinc-200/90 bg-white text-zinc-600 hover:border-violet-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <input
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              value={form.direction}
              onChange={(e) =>
                setForm((f) => ({ ...f, direction: e.target.value }))
              }
              placeholder="例如：AI 编程教育 / 出海 SaaS / 垂直行业 Copilot"
            />
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
              <Users className="h-3.5 w-3.5 text-violet-600" />
              希望匹配的伙伴类型
            </div>
            <p className="text-[11px] text-zinc-500">
              可多选。会进入「意向加成」：若对方角色在你勾选列表中，匹配分更高。
            </p>
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

          <section className="space-y-2">
            <p className="text-xs font-semibold text-zinc-900">自我介绍</p>
            <p className="text-[11px] text-zinc-500">
              演示版暂不纳入打分，但会展示在对方看你主页时；建议写清「阶段、资源、时间」。
            </p>
            <textarea
              className="min-h-[96px] w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm leading-relaxed"
              value={form.intro}
              onChange={(e) => setForm((f) => ({ ...f, intro: e.target.value }))}
              placeholder="例：独立开发者，有 Next.js 全栈经验，寻找增长与运营合伙人一起做出海工具…"
            />
          </section>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-600">
            <span>动效模式：</span>
            {(
              [
                ["fast", "快速 3s"],
                ["normal", "标准 8s"],
                ["ritual", "仪式感 30s"],
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
      )}

      {results && results.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300/80 bg-white/60 p-6 text-center text-sm text-zinc-600">
          <p className="font-medium text-zinc-800">{t("noCandidates")}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">{t("noCandidatesHint")}</p>
        </div>
      ) : null}

      {results && results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">{t("resultsTitle")}</h2>
              <p className="mt-1 text-[11px] text-zinc-500">
                {t("resultsCount", { count: results.length })}
              </p>
            </div>
            <button
              type="button"
              disabled={running}
              onClick={() => void startMatch()}
              className="rounded-2xl bg-violet-100 px-3 py-2 text-xs font-semibold text-violet-900 ring-1 ring-violet-200/80 hover:bg-violet-50 disabled:opacity-50"
            >
              {t("rematch")}
            </button>
          </div>
          <ul className="space-y-4">
            {results.map((c, idx) => {
              const idxInfo = scoreIndex(c.score);
              const open = expandedId === c.userId;
              return (
                <li
                  key={c.userId}
                  className="overflow-hidden rounded-3xl bg-white/90 shadow-soft ring-1 ring-white/80 backdrop-blur"
                >
                  <div className="p-4">
                    <div className="flex gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-200 to-fuchsia-200 ring-1 ring-white">
                        {c.avatarUrl ? (
                          <Image
                            src={c.avatarUrl}
                            alt=""
                            width={56}
                            height={56}
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-lg font-bold text-violet-800">
                            {c.displayName.slice(0, 1)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="truncate text-sm font-semibold text-zinc-900">
                              {c.displayName}
                            </p>
                            <p className="text-[11px] text-zinc-500">
                              {isRole(c.role) ? getRoleLabel(tRoles, c.role) : c.role}
                              {c.direction ? (
                                <span className="text-zinc-400">
                                  {" "}
                                  · {c.direction}
                                </span>
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
                      {(open ? c.reasons : c.reasons.slice(0, 2)).map((r, ri) => (
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
                        onClick={() =>
                          setExpandedId(open ? null : c.userId)
                        }
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 hover:text-violet-900"
                      >
                        {open ? (
                          <>
                            收起理由 <ChevronUp className="h-3.5 w-3.5" />
                          </>
                        ) : (
                          <>
                            展开全部 {c.reasons.length} 条 <ChevronDown className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    ) : null}

                    {open ? <BreakdownBars b={c.breakdown} /> : null}

                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <button
                        type="button"
                        className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2.5 text-xs font-semibold text-white hover:opacity-95"
                        onClick={() => {
                          const intent = `你好 ${c.displayName}，我在 VibeHub 匹配里看到你的资料（${isRole(c.role) ? getRoleLabel(tRoles, c.role) : c.role}），想聊聊合作可能性。`;
                          void startConversation(c.userId, {
                            source: "match",
                            contextTitle: "创业伙伴匹配",
                            draftMessage: intent,
                          }).then(() => {
                            router.push(
                              `/messages?peer=${encodeURIComponent(c.userId)}&intent=match`,
                            );
                          });
                        }}
                      >
                        发起沟通
                      </button>
                      <Link
                        href={`/user/${encodeURIComponent(c.userId)}`}
                        className="inline-flex items-center justify-center rounded-2xl bg-white px-3 py-2.5 text-xs font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
                      >
                        看主页
                      </Link>
                      <Link
                        href="/tools"
                        className="inline-flex items-center justify-center rounded-2xl bg-brand-50 px-3 py-2.5 text-xs font-semibold text-brand-950 ring-1 ring-brand-200/70 hover:bg-white"
                      >
                        分享工具
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <MatchProgress
        active={running}
        animMode={animMode}
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
