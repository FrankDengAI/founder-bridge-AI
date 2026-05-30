"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { LogIn, MessageSquarePlus, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { MODEL_SCENARIOS, SCENARIO_LABEL } from "@/lib/models/rank";
import { recordGamifyEvent } from "@/lib/gamification";

export type ModelReviewRow = {
  id: string;
  userName: string;
  rating: number;
  pros: string;
  cons: string;
  scenario: string;
  comment: string;
  createdAt: string;
};

type Props = {
  modelId: string;
  initialReviews: ModelReviewRow[];
};

type SortMode = "new" | "rating";

export function ModelReviewPanel({ modelId, initialReviews }: Props) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [sort, setSort] = useState<SortMode>("new");
  const [name, setName] = useState("我");
  const [rating, setRating] = useState(5);
  const [scenario, setScenario] = useState("coding");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    void fetch("/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then((j: { userId?: string | null }) => setLoggedIn(Boolean(j.userId)))
      .catch(() => setLoggedIn(false));
  }, []);

  const sorted = useMemo(() => {
    const list = [...reviews];
    if (sort === "rating") {
      list.sort(
        (a, b) =>
          b.rating - a.rating ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    return list;
  }, [reviews, sort]);

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews]);

  const canSubmit = Boolean(pros.trim() || cons.trim() || comment.trim());

  const submit = async () => {
    if (!canSubmit) {
      setMsg("请至少填写优点、槽点或真实体验评论。");
      window.setTimeout(() => setMsg(null), 2400);
      return;
    }

    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/models/${modelId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: name, rating, pros, cons, scenario, comment }),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("请先登录后再提交评价");
        throw new Error("提交失败");
      }
      const data = (await res.json()) as { review?: ModelReviewRow };
      if (data.review) {
        setReviews((prev) => [data.review as ModelReviewRow, ...prev]);
      }
      setComment("");
      setPros("");
      setCons("");
      recordGamifyEvent("model_review_first");
      setMsg("评价已入库，榜单综合分将刷新。");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "提交失败，请稍后再试。");
    } finally {
      setBusy(false);
      window.setTimeout(() => setMsg(null), 2400);
    }
  };

  const scenarioOptions = MODEL_SCENARIOS.filter((s) => s.id !== "all");

  return (
    <div className="space-y-3">
      {loggedIn === false ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-violet-50 px-3 py-2.5 ring-1 ring-violet-200/70">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-violet-900">
            <LogIn className="h-3.5 w-3.5" />
            登录后可提交短评，并解锁「模型观察员」徽章
          </p>
          <Link
            href="/welcome/login"
            className="rounded-full bg-violet-700 px-3 py-1 text-[10px] font-semibold text-white hover:bg-violet-800"
          >
            去登录
          </Link>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-900">真实体验短评</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-xl bg-zinc-100/80 p-0.5 ring-1 ring-zinc-200/60">
            <button
              type="button"
              onClick={() => setSort("new")}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold ${
                sort === "new" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600"
              }`}
            >
              最新
            </button>
            <button
              type="button"
              onClick={() => setSort("rating")}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold ${
                sort === "rating" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600"
              }`}
            >
              评分优先
            </button>
          </div>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-200/70">
            均值 {avg.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
          <MessageSquarePlus className="h-4 w-4 text-brand-700" />
          写一条短评（按使用场景）
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            className="rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="昵称"
          />
          <select
            className="rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
          >
            {scenarioOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[11px] font-medium text-zinc-600">星级</span>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              className="rounded-lg p-0.5 transition hover:scale-110"
              aria-label={`${s} 星`}
            >
              <Star
                className={`h-5 w-5 ${
                  s <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-300"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            className="rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm"
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            placeholder="优点（如：代码补全稳）"
          />
          <input
            className="rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm"
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            placeholder="槽点（如：贵 / 慢）"
          />
        </div>
        <textarea
          className="mt-2 min-h-[72px] w-full rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="真实体验：你在什么场景下用过？和竞品比如何？"
        />
        <button
          type="button"
          disabled={busy || !canSubmit || loggedIn === false}
          onClick={() => void submit()}
          className="mt-3 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2.5 text-sm font-semibold text-white shadow-glow disabled:opacity-60"
        >
          {busy ? "提交中…" : "提交评价"}
        </button>
        {msg ? <p className="mt-2 text-center text-[11px] text-zinc-600">{msg}</p> : null}
      </div>

      <ul className="space-y-2">
        {sorted.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-amber-200/70 bg-amber-50/50 p-4 text-center">
            <p className="text-xs font-semibold text-zinc-900">还没有短评</p>
            <p className="mt-1 text-[11px] text-zinc-600">
              写下你在编程、写作或原型场景下的真实体验，帮后来者避坑。
            </p>
          </li>
        ) : null}
        {sorted.map((r) => (
          <li
            key={r.id}
            className="rounded-2xl bg-white/85 p-3 ring-1 ring-zinc-200/70"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-zinc-900">{r.userName}</span>
              <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                <span className="rounded-full bg-violet-50 px-2 py-0.5 font-semibold text-violet-800 ring-1 ring-violet-200/60">
                  {SCENARIO_LABEL[r.scenario] ?? r.scenario}
                </span>
                <span className="inline-flex items-center gap-0.5 font-mono text-amber-800">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {r.rating}
                </span>
              </div>
            </div>
            {(r.pros || r.cons) && (
              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                {r.pros ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-900 ring-1 ring-emerald-200/60">
                    <ThumbsUp className="h-3 w-3" />
                    {r.pros}
                  </span>
                ) : null}
                {r.cons ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-rose-900 ring-1 ring-rose-200/60">
                    <ThumbsDown className="h-3 w-3" />
                    {r.cons}
                  </span>
                ) : null}
              </div>
            )}
            {r.comment ? (
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-700">{r.comment}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
