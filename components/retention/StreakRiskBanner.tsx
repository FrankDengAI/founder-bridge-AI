"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Flame } from "lucide-react";
import { useTranslations } from "next-intl";
import { canCheckInToday, isEveningStreakRisk, readCheckIn } from "@/lib/retention";

export function StreakRiskBanner() {
  const t = useTranslations("retention.streak");
  const [show, setShow] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setShow(isEveningStreakRisk());
      setStreak(readCheckIn().streak);
    };
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener("vibe-checkin-updated", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("vibe-checkin-updated", refresh);
    };
  }, []);

  if (!show || !canCheckInToday()) return null;

  return (
    <section className="flex items-center gap-2 rounded-2xl bg-amber-950/90 px-3 py-2 text-white ring-1 ring-amber-500/40">
      <Flame className="h-4 w-4 shrink-0 text-amber-300" />
      <p className="min-w-0 flex-1 text-[11px] leading-snug">{t("risk", { days: streak })}</p>
      <Link
        href="/home"
        className="shrink-0 rounded-lg bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-amber-950"
      >
        {t("checkIn")}
      </Link>
    </section>
  );
}
