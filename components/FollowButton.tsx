"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { completeActivationStep } from "@/lib/activation";
import { recordGamifyEvent } from "@/lib/gamification";
import { completeMission } from "@/lib/retention";

type Props = {
  targetUserId: string;
  viewerId: string | null;
  initialFollowing: boolean;
};

export function FollowButton({ targetUserId, viewerId, initialFollowing }: Props) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setFollowing(initialFollowing);
  }, [initialFollowing]);

  const toggle = useCallback(async () => {
    if (!viewerId) return;
    setBusy(true);
    try {
      const next = !following;
      setFollowing(next);
      const res = await fetch("/api/follow", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ followingId: targetUserId }),
      });
      if (!res.ok) {
        setFollowing(!next);
        return;
      }
      if (next) {
        recordGamifyEvent("follow_first");
        completeActivationStep("first_follow");
        completeMission("follow_one");
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }, [following, router, targetUserId, viewerId]);

  if (!viewerId) {
    return (
      <p className="text-[11px] text-zinc-500">登录后可关注该用户。</p>
    );
  }
  if (viewerId === targetUserId) {
    return null;
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => void toggle()}
      aria-pressed={following}
      className={clsx(
        "rounded-2xl px-4 py-2 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        following
          ? "bg-white text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
          : "bg-gradient-to-r from-brand-600 to-fuchsia-600 text-white shadow-glow hover:brightness-105",
      )}
    >
      {busy ? "…" : following ? "已关注" : "关注"}
    </button>
  );
}
