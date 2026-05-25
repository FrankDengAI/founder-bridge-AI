"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, X } from "lucide-react";
import {
  dismissPendingReply,
  readPendingReply,
  type PendingReply,
} from "@/lib/retention";

export function ReplyReturnBanner() {
  const [pending, setPending] = useState<PendingReply | null>(null);

  const refresh = () => setPending(readPendingReply());

  useEffect(() => {
    refresh();
    window.addEventListener("vibe-reply-pending", refresh);
    window.addEventListener("vibe-threads-updated", refresh);
    return () => {
      window.removeEventListener("vibe-reply-pending", refresh);
      window.removeEventListener("vibe-threads-updated", refresh);
    };
  }, []);

  if (!pending) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-3 text-white shadow-lg shadow-fuchsia-500/25">
      <button
        type="button"
        aria-label="关闭"
        onClick={() => {
          dismissPendingReply();
          refresh();
        }}
        className="absolute right-2 top-2 rounded-lg bg-white/15 p-1 hover:bg-white/25"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20">
          <MessageCircle className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold">有人回复你了</p>
          <p className="mt-0.5 text-sm font-semibold">{pending.peerName}</p>
          <p className="mt-1 line-clamp-2 text-[11px] text-white/85">
            {pending.preview}
          </p>
          <Link
            href={`/messages?peer=${encodeURIComponent(pending.peerId)}`}
            onClick={() => {
              dismissPendingReply();
            }}
            className="mt-2 inline-flex rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold text-violet-900"
          >
            查看回复
          </Link>
        </div>
      </div>
    </section>
  );
}
