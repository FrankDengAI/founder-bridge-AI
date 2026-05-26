"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bookmark, Heart } from "lucide-react";
import clsx from "clsx";
import { useClientUserId } from "@/lib/hooks/useClientUserId";

type Props = {
  postId: string;
  initialLikes: number;
  initialSaves: number;
  initiallyLiked?: boolean;
  initiallySaved?: boolean;
};

export function PostEngage({
  postId,
  initialLikes,
  initialSaves,
  initiallyLiked = false,
  initiallySaved = false,
}: Props) {
  const router = useRouter();
  const userId = useClientUserId();
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

  const disabled = useMemo(() => busy !== null || !userId, [busy, userId]);

  const react = async (action: "like" | "save") => {
    if (!userId) {
      router.push("/welcome/login");
      return;
    }
    const wasActive = action === "like" ? liked : saved;
    if (action === "like") {
      setLikes((n) => Math.max(0, n + (wasActive ? -1 : 1)));
      setLiked(!wasActive);
    } else {
      setSaves((n) => Math.max(0, n + (wasActive ? -1 : 1)));
      setSaved(!wasActive);
    }
    setBusy(action);
    setToast(null);
    try {
      const res = await fetch(`/api/posts/${postId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("操作失败");
      const data = (await res.json()) as {
        likes: number;
        saves: number;
        active: boolean;
      };
      setLikes(data.likes);
      setSaves(data.saves);
      if (action === "like") setLiked(data.active);
      if (action === "save") setSaved(data.active);
      setToast(
        action === "like"
          ? data.active
            ? "已点赞"
            : "已取消点赞"
          : data.active
            ? "已收藏"
            : "已取消收藏",
      );
    } catch {
      if (action === "like") {
        setLikes(initialLikes);
        setLiked(initiallyLiked);
      } else {
        setSaves(initialSaves);
        setSaved(initiallySaved);
      }
      setToast("操作失败，请稍后重试");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-2">
      {!userId ? (
        <p className="text-xs text-zinc-500">
          <Link href="/welcome/login" className="font-semibold text-violet-700 hover:underline">
            登录
          </Link>{" "}
          后可点赞与收藏
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => void react("like")}
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition",
            liked
              ? "bg-rose-50 text-rose-800 ring-rose-200"
              : "bg-white/80 text-zinc-700 ring-zinc-200 hover:bg-white",
            disabled && "opacity-50",
          )}
        >
          <Heart className={clsx("h-3.5 w-3.5", liked && "fill-current")} />
          {likes}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => void react("save")}
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition",
            saved
              ? "bg-amber-50 text-amber-900 ring-amber-200"
              : "bg-white/80 text-zinc-700 ring-zinc-200 hover:bg-white",
            disabled && "opacity-50",
          )}
        >
          <Bookmark className={clsx("h-3.5 w-3.5", saved && "fill-current")} />
          {saves}
        </button>
      </div>
      {toast ? <p className="text-[11px] font-medium text-brand-800">{toast}</p> : null}
    </div>
  );
}
