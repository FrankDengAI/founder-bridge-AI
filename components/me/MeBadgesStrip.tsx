"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Trophy } from "lucide-react";
import { getAllBadges, getUnlockedBadges, type BadgeDef } from "@/lib/gamification";

export function MeBadgesStrip() {
  const t = useTranslations("pages.me");
  const [unlocked, setUnlocked] = useState<BadgeDef[]>([]);

  useEffect(() => {
    const refresh = () => setUnlocked(getUnlockedBadges());
    refresh();
    window.addEventListener("vibe-badges-updated", refresh);
    return () => window.removeEventListener("vibe-badges-updated", refresh);
  }, []);

  const unlockedIds = new Set(unlocked.map((b) => b.id));
  const preview = getAllBadges().slice(0, 8);

  return (
    <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-600" />
          <div>
            <p className="text-xs font-semibold text-zinc-900">{t("badgesPreviewTitle")}</p>
            <p className="text-[10px] text-zinc-500">
              {t("badgesPreviewDesc", { count: unlocked.length })}
            </p>
          </div>
        </div>
        <Link
          href="/me/achievements"
          className="shrink-0 rounded-xl bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-900 ring-1 ring-amber-200/70"
        >
          {t("badgesPreviewCta")}
        </Link>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {preview.map((b) => {
          const on = unlockedIds.has(b.id);
          return (
            <span
              key={b.id}
              title={b.desc}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium ${
                on
                  ? "border-amber-200/80 bg-amber-50/90 text-amber-950"
                  : "border-zinc-200/80 bg-zinc-50/80 text-zinc-400"
              }`}
            >
              <span aria-hidden>{b.emoji}</span>
              {b.label}
            </span>
          );
        })}
      </div>
    </section>
  );
}
