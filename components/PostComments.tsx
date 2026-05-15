"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { prependLocalNotif } from "@/lib/notificationsLocal";

type Author = { id: string; displayName: string; avatarUrl: string | null };

export type CommentRow = {
  id: string;
  body: string;
  createdAt: string;
  author: Author;
};

type Props = {
  postId: string;
  /** 未登录则为 null，仅可浏览 */
  viewerId: string | null;
};

export function PostComments({ postId, viewerId }: Props) {
  const [items, setItems] = useState<CommentRow[]>([]);
  const [nextSkip, setNextSkip] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [moreBusy, setMoreBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(
    async (append: boolean, skip: number) => {
      if (append) setMoreBusy(true);
      else setLoading(true);
      setErr(null);
      try {
        const u = new URL(`/api/posts/${postId}/comments`, window.location.origin);
        u.searchParams.set("take", "15");
        u.searchParams.set("skip", String(skip));
        const res = await fetch(u.toString(), { credentials: "include" });
        if (!res.ok) throw new Error("加载失败");
        const data = (await res.json()) as {
          comments: (Omit<CommentRow, "createdAt"> & { createdAt: Date | string })[];
          nextSkip: number | null;
        };
        const mapped: CommentRow[] = data.comments.map((c) => ({
          ...c,
          createdAt: typeof c.createdAt === "string" ? c.createdAt : c.createdAt.toISOString(),
        }));
        const chronological = [...mapped].reverse();
        setItems((prev) => (append ? [...chronological, ...prev] : chronological));
        setNextSkip(data.nextSkip);
      } catch {
        setErr("评论加载失败");
      } finally {
        setLoading(false);
        setMoreBusy(false);
      }
    },
    [postId],
  );

  useEffect(() => {
    void load(false, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const submit = async () => {
    const text = draft.trim();
    if (!text || !viewerId) return;
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ body: text }),
      });
      if (!res.ok) throw new Error("发送失败");
      const data = (await res.json()) as {
        comment: Omit<CommentRow, "createdAt"> & { createdAt: Date | string };
      };
      const c: CommentRow = {
        ...data.comment,
        createdAt:
          typeof data.comment.createdAt === "string"
            ? data.comment.createdAt
            : data.comment.createdAt.toISOString(),
      };
      setItems((prev) => [...prev, c]);
      setDraft("");
      prependLocalNotif({
        id: `cmt_${c.id}`,
        title: "你的评论已发布",
        body: "可在通知中心查看；作者与其他读者会在详情页看到。",
        at: "刚刚",
      });
    } catch {
      setErr("评论发送失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-3 rounded-3xl bg-white/90 p-4 ring-1 ring-zinc-200/70 dark:bg-zinc-950/80 dark:ring-zinc-800">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">评论</h2>
        {nextSkip !== null ? (
          <button
            type="button"
            disabled={moreBusy}
            onClick={() => void load(true, nextSkip)}
            className="text-[11px] font-semibold text-brand-800 hover:underline disabled:opacity-50"
          >
            {moreBusy ? "加载中…" : "更早评论"}
          </button>
        ) : null}
      </div>
      {loading ? (
        <p className="text-xs text-zinc-500">加载中…</p>
      ) : items.length === 0 ? (
        <p className="text-xs text-zinc-500">还没有评论，做第一个发言的人吧。</p>
      ) : (
        <ul className="space-y-3">
          {items.map((c) => (
            <li key={c.id} className="flex gap-2 rounded-2xl bg-zinc-50/80 p-2 ring-1 ring-zinc-200/60 dark:bg-zinc-900/50 dark:ring-zinc-800">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-zinc-200">
                {c.author.avatarUrl ? (
                  <Image src={c.author.avatarUrl} alt="" fill className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-zinc-500">
                    {c.author.displayName.slice(0, 1)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100">
                  {c.author.displayName}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                  {c.body}
                </p>
                <p className="mt-1 text-[10px] text-zinc-400">
                  {new Date(c.createdAt).toLocaleString("zh-CN")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {viewerId ? (
        <div className="space-y-2 border-t border-zinc-200/70 pt-3 dark:border-zinc-800">
          <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
            写评论
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder="友善交流，纯文本即可。"
              className="mt-1 w-full rounded-2xl border border-zinc-200/90 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-zinc-700 dark:bg-zinc-950"
            />
          </label>
          {err ? <p className="text-xs text-red-600">{err}</p> : null}
          <button
            type="button"
            disabled={submitting || !draft.trim()}
            onClick={() => void submit()}
            className="w-full rounded-2xl bg-zinc-950 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-40 dark:bg-white dark:text-zinc-950"
          >
            {submitting ? "发送中…" : "发布评论"}
          </button>
        </div>
      ) : (
        <p className="text-[11px] text-zinc-500">登录后可发表评论。</p>
      )}
    </section>
  );
}
