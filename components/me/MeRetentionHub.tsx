"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Flame, Sparkles, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import { getUnlockedBadges } from "@/lib/gamification";
import { readCheckIn, readMissionProgress } from "@/lib/retention";
import { useConversationStats } from "@/lib/hooks/useConversationStats";
import { useClientUserId } from "@/lib/hooks/useClientUserId";

export function MeRetentionHub() {
  const t = useTranslations("homeUi.meHub");
  const userId = useClientUserId();
  const [streak, setStreak] = useState(0);
  const [missions, setMissions] = useState(0);
  const [badges, setBadges] = useState(0);
  const { total: threads, unread: msgUnread } = useConversationStats(Boolean(userId));

  useEffect(() => {
    const refresh = () => {
      setStreak(readCheckIn().streak);
      setMissions(readMissionProgress().total);
      setBadges(getUnlockedBadges().length);
    };
    refresh();
    window.addEventListener("vibe-checkin-updated", refresh);
    window.addEventListener("vibe-missions-updated", refresh);
    window.addEventListener("vibe-badges-updated", refresh);
    return () => {
      window.removeEventListener("vibe-checkin-updated", refresh);
      window.removeEventListener("vibe-missions-updated", refresh);
      window.removeEventListener("vibe-badges-updated", refresh);
    };
  }, []);

  return (
    <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
      <p className="text-xs font-semibold text-zinc-900">{t("title")}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-2xl bg-orange-50 px-2 py-2.5 text-center ring-1 ring-orange-200/60">
          <Flame className="mx-auto h-4 w-4 text-orange-600" />
          <p className="mt-1 text-lg font-bold tabular-nums text-zinc-900">{streak}</p>
          <p className="text-[10px] text-zinc-600">{t("streak")}</p>
        </div>
        <div className="rounded-2xl bg-violet-50 px-2 py-2.5 text-center ring-1 ring-violet-200/60">
          <Sparkles className="mx-auto h-4 w-4 text-violet-600" />
          <p className="mt-1 text-lg font-bold tabular-nums text-zinc-900">{missions}</p>
          <p className="text-[10px] text-zinc-600">{t("missions")}</p>
        </div>
        <div className="rounded-2xl bg-amber-50 px-2 py-2.5 text-center ring-1 ring-amber-200/60">
          <Trophy className="mx-auto h-4 w-4 text-amber-600" />
          <p className="mt-1 text-lg font-bold tabular-nums text-zinc-900">{badges}</p>
          <p className="text-[10px] text-zinc-600">{t("badges")}</p>
        </div>
        <div className="rounded-2xl bg-cyan-50 px-2 py-2.5 text-center ring-1 ring-cyan-200/60">
          <p className="text-lg font-bold tabular-nums text-zinc-900">{threads}</p>
          <p className="text-[10px] text-zinc-600">{t("threads")}</p>
          {msgUnread > 0 ? (
            <p className="mt-0.5 text-[10px] font-semibold text-rose-600">
              {t("unread", { count: msgUnread })}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href="/home"
          className="rounded-xl bg-violet-100 px-3 py-1.5 text-[11px] font-semibold text-violet-900"
        >
          {t("goCheckIn")}
        </Link>
        <Link
          href="/messages"
          className="rounded-xl bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-800 ring-1 ring-zinc-200/80"
        >
          {t("messages")}
          {msgUnread > 0 ? ` (${msgUnread})` : ""}
        </Link>
        <Link
          href="/me/achievements"
          className="rounded-xl bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-800 ring-1 ring-zinc-200/80"
        >
          {t("achievements")}
        </Link>
      </div>
    </section>
  );
}
