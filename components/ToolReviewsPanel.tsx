"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { MessageSquarePlus, Star } from "lucide-react";

type Review = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  authorReply?: string;
  createdAt: string;
};

type Props = {
  toolId: string;
  initialReviews: Review[];
};

type SortMode = "new" | "rating";

export function ToolReviewsPanel({ toolId, initialReviews }: Props) {
  const router = useRouter();
  const t = useTranslations("toolReview");
  const locale = useLocale();
  const [reviews, setReviews] = useState(initialReviews);
  const [sort, setSort] = useState<SortMode>("new");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    setName(t("defaultName"));
  }, [t]);

  const sorted = useMemo(() => {
    const list = [...reviews];
    if (sort === "rating") {
      list.sort((a, b) => b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [reviews, sort]);

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews]);

  const submit = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/tools/${toolId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: name, rating, comment }),
      });
      if (!res.ok) throw new Error("submit failed");
      const now = new Date().toISOString();
      setReviews((prev) => [
        {
          id: `local_${Date.now()}`,
          userName: name.trim() || t("anonymous"),
          rating,
          comment: comment.trim(),
          createdAt: now,
        },
        ...prev,
      ]);
      setComment("");
      setMsg(t("submitSuccess"));
      router.refresh();
    } catch {
      setMsg(t("submitFailed"));
    } finally {
      setBusy(false);
      window.setTimeout(() => setMsg(null), 2000);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-900">{t("title")}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-xl bg-zinc-100/80 p-0.5 ring-1 ring-zinc-200/60">
            <button
              type="button"
              onClick={() => setSort("new")}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold ${
                sort === "new" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600"
              }`}
            >
              {t("sortNew")}
            </button>
            <button
              type="button"
              onClick={() => setSort("rating")}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold ${
                sort === "rating" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600"
              }`}
            >
              {t("sortRating")}
            </button>
          </div>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-200/70">
            {t("avg", { avg: avg.toFixed(1) })}
          </span>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
          <MessageSquarePlus className="h-4 w-4 text-brand-700" />
          {t("writeTitle")}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input
            className="rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("nickname")}
          />
          <select
            className="rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {t("starOption", { n })}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={busy}
            onClick={() => void submit()}
            className="rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
          >
            {busy ? t("submitBusy") : t("submit")}
          </button>
        </div>
        <textarea
          className="mt-2 min-h-[90px] w-full rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("placeholder")}
        />
        {msg ? <p className="mt-2 text-[11px] font-medium text-brand-900">{msg}</p> : null}
      </div>

      <ul className="space-y-2">
        {sorted.map((r) => (
          <li key={r.id} className="glass-panel rounded-2xl p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-950">{r.userName}</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-200/70">
                <Star className="h-3.5 w-3.5" />
                {r.rating}.0
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-700">{r.comment || t("noText")}</p>
            {r.authorReply ? (
              <p className="mt-2 rounded-xl bg-violet-50/80 px-2.5 py-2 text-[11px] text-violet-950 ring-1 ring-violet-200/50">
                <span className="font-semibold">{t("devReply")}</span>
                {r.authorReply}
              </p>
            ) : (
              <div className="mt-2 flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-zinc-200 px-2 py-1.5 text-[11px]"
                  placeholder={t("replyPlaceholder")}
                  value={replyDraft[r.id] ?? ""}
                  onChange={(e) =>
                    setReplyDraft((d) => ({ ...d, [r.id]: e.target.value }))
                  }
                />
                <button
                  type="button"
                  className="shrink-0 rounded-xl bg-zinc-900 px-2 py-1.5 text-[10px] font-semibold text-white"
                  onClick={async () => {
                    const text = (replyDraft[r.id] ?? "").trim();
                    if (!text) return;
                    const res = await fetch(`/api/tools/${toolId}/reviews`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ reviewId: r.id, authorReply: text }),
                    });
                    if (res.ok) {
                      setReviews((prev) =>
                        prev.map((x) =>
                          x.id === r.id ? { ...x, authorReply: text } : x,
                        ),
                      );
                    }
                  }}
                >
                  {t("reply")}
                </button>
              </div>
            )}
            <p className="mt-2 text-[10px] text-zinc-400">
              {new Date(r.createdAt).toLocaleString(locale)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
