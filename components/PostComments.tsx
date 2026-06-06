"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { UserAvatar } from "@/components/ui/UserAvatar";
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
  const t = useTranslations("comments");
  const locale = useLocale();
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
        if (!res.ok) throw new Error("load failed");
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
        setErr(t("loadError"));
      } finally {
        setLoading(false);
        setMoreBusy(false);
      }
    },
    [postId, t],
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
      if (!res.ok) throw new Error("submit failed");
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
        title: t("notifTitle"),
        body: t("notifBody"),
        at: t("justNow"),
      });
    } catch {
      setErr(t("submitFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-3 rounded-3xl bg-white/90 p-4 ring-1 ring-zinc-200/70 dark:bg-zinc-950/80 dark:ring-zinc-800">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{t("title")}</h2>
        {nextSkip !== null ? (
          <button
            type="button"
            disabled={moreBusy}
            onClick={() => void load(true, nextSkip)}
            className="text-[11px] font-semibold text-brand-800 hover:underline disabled:opacity-50"
          >
            {moreBusy ? t("loadingMore") : t("earlierComments")}
          </button>
        ) : null}
      </div>
      {loading ? (
        <p className="text-xs text-zinc-500">{t("loading")}</p>
      ) : items.length === 0 ? (
        <p className="text-xs text-zinc-500">{t("empty")}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((c) => (
            <li key={c.id} className="flex gap-2 rounded-2xl bg-zinc-50/80 p-2 ring-1 ring-zinc-200/60 dark:bg-zinc-900/50 dark:ring-zinc-800">
              <UserAvatar
                userId={c.author.id}
                displayName={c.author.displayName}
                avatarUrl={c.author.avatarUrl}
                size="xs"
                className="rounded-xl"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100">
                  {c.author.displayName}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                  {c.body}
                </p>
                <p className="mt-1 text-[10px] text-zinc-400">
                  {new Date(c.createdAt).toLocaleString(locale)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {viewerId ? (
        <div className="space-y-2 border-t border-zinc-200/70 pt-3 dark:border-zinc-800">
          <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
            {t("writeLabel")}
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder={t("placeholder")}
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
            {submitting ? t("submitBusy") : t("submit")}
          </button>
        </div>
      ) : (
        <p className="text-[11px] text-zinc-500">{t("loginHint")}</p>
      )}
    </section>
  );
}
