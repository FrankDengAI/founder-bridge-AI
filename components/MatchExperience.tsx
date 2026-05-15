"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";
import { LS_USER_ID } from "@/lib/clientSession";
import { DEMO_USER_ID } from "@/lib/constants";
import type { Role } from "@/lib/domain/role";
import { ROLES, isRole } from "@/lib/domain/role";
import { ROLE_LABEL, ROLE_MATCH_DESC } from "@/lib/labels";
import type { ScoreBreakdown } from "@/lib/matching/types";
import {
  MATCH_BREAKDOWN_LABELS,
  MATCH_DIRECTION_PRESETS,
  MATCH_KEYWORD_SUGGESTIONS,
} from "@/lib/matchUiCopy";
import { upsertThread } from "@/lib/threads";
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
  if (n >= 76) return { n, tier: "高匹配", className: "bg-emerald-50 text-emerald-900 ring-emerald-200/80" };
  if (n >= 58) return { n, tier: "中匹配", className: "bg-amber-50 text-amber-950 ring-amber-200/80" };
  return { n, tier: "探索向", className: "bg-zinc-100 text-zinc-700 ring-zinc-200/80" };
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
    <div className="mt-3 space-y-2.5">
      {entries.map((row) => (
        <div key={row.key}>
          <div className="flex items-center justify-between gap-2 text-[10px] text-zinc-600">
            <span className="font-medium text-zinc-800">{row.title}</span>
            <span className="tabular-nums text-zinc-500">{Math.round(row.value * 100)}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
              style={{ width: `${Math.round(Math.min(1, row.value) * 100)}%` }}
            />
          </div>
          <p className="mt-0.5 text-[10px] leading-snug text-zinc-400">{row.hint}</p>
        </div>
      ))}
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

function loadUserId() {
  if (typeof window === "undefined") return DEMO_USER_ID;
  return localStorage.getItem(LS_USER_ID) || DEMO_USER_ID;
}

export function MatchExperience() {
  const router = useRouter();
  const userId = useMemo(() => loadUserId(), []);
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

  const refreshProfile = useCallback(async () => {
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
    setError(null);
    setResults(null);
    setPendingResult(null);
    try {
      const put = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, ...form }),
      });
      if (!put.ok) throw new Error("保存资料失败");
      setRunning(true);
      void fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, limit: 10 }),
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
        title="创业伙伴匹配"
        subtitle={`多维度互补评分 · 约 30 秒仪式感动效 · 当前会话：${userId}`}
        right={
          <Link
            href="/messages"
            className="rounded-2xl bg-white/80 px-3 py-2 text-[11px] font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-white"
          >
            消息
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
              <li>点击下方按钮会先保存当前表单，再进入约 30 秒的动效；真实计算在服务端毫秒级完成。</li>
            </ul>
          </div>
        </div>
      </section>

      {loadingProfile ? (
        <p className="text-sm text-zinc-500">加载资料中…</p>
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
                  <span className="block font-semibold">{ROLE_LABEL[r]}</span>
                  <span className="mt-1.5 block text-[10px] leading-relaxed text-zinc-600">
                    {ROLE_MATCH_DESC[r]}
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
              {MATCH_KEYWORD_SUGGESTIONS.map((s) => (
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
                className="rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
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
              {MATCH_DIRECTION_PRESETS.map((d) => (
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
                  {ROLE_LABEL[r]}
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

          <button
            type="button"
            disabled={running}
            onClick={() => void startMatch()}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-60"
          >
            保存画像并开始匹配（约 30 秒仪式感）
          </button>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
        </div>
      )}

      {results && results.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300/80 bg-white/60 p-6 text-center text-sm text-zinc-600">
          <p className="font-medium text-zinc-800">本轮暂无候选</p>
          <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
            请确认已执行 <span className="font-mono">npm run db:seed</span>；或放宽关键词 / 期望伙伴类型后再试。
          </p>
        </div>
      ) : null}

      {results && results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">为你生成的推荐</h2>
              <p className="mt-1 text-[11px] text-zinc-500">
                共 {results.length} 人 · 分数为综合加权，可展开查看各维度与完整理由
              </p>
            </div>
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
                              {isRole(c.role) ? ROLE_LABEL[c.role] : c.role}
                              {c.direction ? (
                                <span className="text-zinc-400">
                                  {" "}
                                  · {c.direction}
                                </span>
                              ) : null}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1">
                            <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white">
                              #{idx + 1}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${idxInfo.className}`}
                            >
                              {idxInfo.tier} · {idxInfo.n}
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
                        className="rounded-2xl bg-zinc-950 px-3 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800"
                        onClick={() => {
                          upsertThread({
                            peerId: c.userId,
                            peerName: c.displayName,
                            lastMessage: "通过匹配发起连接",
                            updatedAt: Date.now(),
                            source: "match",
                          });
                          router.push(`/messages?peer=${encodeURIComponent(c.userId)}`);
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
        onComplete={onProgressDone}
        onCancel={() => {
          setRunning(false);
          setPendingResult(null);
        }}
      />
    </div>
  );
}
