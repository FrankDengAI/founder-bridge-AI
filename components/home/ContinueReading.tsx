"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { readRecentViews, type RecentView } from "@/lib/retention";

export function ContinueReading() {
  const t = useTranslations("homeUi.continueReading");
  const [items, setItems] = useState<RecentView[]>([]);

  useEffect(() => {
    const load = () => setItems(readRecentViews().slice(0, 3));
    load();
    window.addEventListener("vibe-recent-updated", load);
    return () => window.removeEventListener("vibe-recent-updated", load);
  }, []);

  if (items.length === 0) {
    return (
      <section className="space-y-2">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
          <BookOpen className="h-3.5 w-3.5 text-violet-600" />
          {t("newcomerTitle")}
        </p>
        <p className="text-[11px] text-zinc-600">{t("newcomerHint")}</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/home?sort=hot"
            className="rounded-2xl bg-white/90 px-3 py-2 text-[11px] font-semibold text-zinc-800 ring-1 ring-zinc-200/80"
          >
            {t("viewHotPosts")}
          </Link>
          <Link
            href="/match"
            className="rounded-2xl bg-violet-100 px-3 py-2 text-[11px] font-semibold text-violet-900 ring-1 ring-violet-200/70"
          >
            {t("goMatch")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
        <BookOpen className="h-3.5 w-3.5 text-violet-600" />
        {t("title")}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((it) => (
          <Link
            key={it.postId}
            href={`/post/${it.postId}`}
            className="shrink-0 rounded-2xl bg-white/90 px-3 py-2 text-[11px] font-semibold text-zinc-800 ring-1 ring-zinc-200/80 hover:ring-violet-300/80"
          >
            {it.title.slice(0, 24)}
            {it.title.length > 24 ? "…" : ""}
          </Link>
        ))}
      </div>
    </section>
  );
}
