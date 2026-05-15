"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Heart } from "lucide-react";
import clsx from "clsx";
import { LS_USER_ID } from "@/lib/clientSession";
import { DEMO_USER_ID } from "@/lib/constants";

type Props = {
  postId: string;
  initialLikes: number;
  initialSaves: number;
  initiallyLiked?: boolean;
  initiallySaved?: boolean;
};

function resolveUserId(): string {
  if (typeof window === "undefined") return DEMO_USER_ID;
  return localStorage.getItem(LS_USER_ID) || DEMO_USER_ID;
}

export function PostEngage({
  postId,
  initialLikes,
  initialSaves,
  initiallyLiked = false,
  initiallySaved = false,
}: Props) {
  const router = useRouter();
  const [likes, setLikes] = useState(initialLikes);
  const [saves, setSaves] = useState(initialSaves);
  const [liked, setLiked] = useState(initiallyLiked);
  const [saved, setSaved] = useState(initiallySaved);
  const [busy, setBusy] = useState<"like" | "save" | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setLikes(initialLikes);
    setSaves(initialSaves);
    setLiked(initiallyLiked);
    setSaved(initiallySaved);
  }, [postId, initialLikes, initialSaves, initiallyLiked, initiallySaved]);

  const disabled = useMemo(() => busy !== null, [busy]);

  const react = async (action: "like" | "save") => {
    const userId = resolveUserId();
    const already = action === "like" ? liked : saved;
    if (!already) {
      if (action === "like") {
        setLikes((n) => n + 1);
        setLiked(true);
      } else {
        setSaves((n) => n + 1);
        setSaved(true);
      }
    }
    setBusy(action);
    setToast(null);
    try {
      const res = await fetch(`/api/posts/${postId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action, userId }),
      });
      if (!res.ok) throw new Error("操作失败");
      const data = (await res.json()) as { likes: number; saves: number };
      setLikes(data.likes);
      setSaves(data.saves);
      if (action === "like") setLiked(true);
      if (action === "save") setSaved(true);
      setToast(
        already
          ? action === "like"
            ? "你已赞过该笔记"
            : "你已收藏过该笔记"
          : action === "like"
            ? "已点赞（已写入数据库）"
            : "已收藏（已写入数据库）",
      );
      router.refresh();
    } catch {
      if (!already) {
        if (action === "like") {
          setLikes((n) => Math.max(0, n - 1));
          setLiked(false);
        } else {
          setSaves((n) => Math.max(0, n - 1));
          setSaved(false);
        }
      }
      setToast("网络异常，请稍后再试");
    } finally {
      setBusy(null);
      window.setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => void react("like")}
          aria-pressed={liked}
          aria-label={liked ? "已点赞" : "点赞"}
          className={clsx(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
            liked
              ? "bg-rose-100 text-rose-900 ring-rose-200/80"
              : "bg-gradient-to-r from-rose-500 to-orange-500 text-white ring-white/30 hover:brightness-105 disabled:opacity-60",
          )}
        >
          <Heart className={clsx("h-4 w-4", liked && "fill-current")} />
          点赞 {likes}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => void react("save")}
          aria-pressed={saved}
          aria-label={saved ? "已收藏" : "收藏"}
          className={clsx(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
            saved
              ? "bg-amber-50 text-amber-900 ring-amber-200/80"
              : "bg-white text-zinc-900 ring-zinc-200/80 hover:bg-zinc-50 disabled:opacity-60",
          )}
        >
          <Bookmark className={clsx("h-4 w-4", saved && "fill-current text-amber-700")} />
          收藏 {saves}
        </button>
      </div>
      {toast ? (
        <p className="text-center text-[11px] font-medium text-brand-800">{toast}</p>
      ) : null}
    </div>
  );
}
