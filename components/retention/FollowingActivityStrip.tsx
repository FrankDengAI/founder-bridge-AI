"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { UserAvatar } from "@/components/ui/UserAvatar";

type Item = {
  postId: string;
  title: string;
  authorId: string;
  authorName: string;
  avatarUrl: string | null;
};

export function FollowingActivityStrip() {
  const t = useTranslations("retention.following");
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    void fetch("/api/feed/following?limit=5", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((j: { items: Item[] }) => setItems(j.items ?? []))
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl bg-cyan-50/80 p-3 ring-1 ring-cyan-200/60">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-cyan-950">
        <Users className="h-3.5 w-3.5" />
        {t("title")}
      </p>
      <ul className="mt-2 space-y-2">
        {items.map((it) => (
          <li key={it.postId}>
            <Link
              href={`/post/${it.postId}`}
              className="flex items-center gap-2 rounded-xl bg-white/70 px-2 py-2 ring-1 ring-cyan-100/80 transition hover:bg-white"
            >
              <UserAvatar
                userId={it.authorId}
                displayName={it.authorName}
                avatarUrl={it.avatarUrl}
                size="xs"
                className="rounded-xl"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-zinc-900">{it.title}</p>
                <p className="text-[10px] text-zinc-500">{it.authorName}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
