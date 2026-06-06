"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Compass, Sparkles, Wrench, BookOpen, Flame } from "lucide-react";
import { HomeCommunityHub } from "@/components/home/HomeCommunityHub";
import { HomeHotRanking } from "@/components/home/HomeHotRanking";
import { LearnProgressCard } from "@/components/learn/LearnProgressCard";
import { ActivationJourney } from "@/components/retention/ActivationJourney";
import { WeekReviewCard } from "@/components/retention/WeekReviewCard";
import { PublishDraftBanner } from "@/components/retention/PublishDraftBanner";
import { SocialProofTicker } from "@/components/retention/SocialProofTicker";
import { FollowingActivityStrip } from "@/components/retention/FollowingActivityStrip";
import { ContinueReading } from "@/components/home/ContinueReading";
import { StreakRiskBanner } from "@/components/retention/StreakRiskBanner";

type Props = {
  modelCount?: number;
  reviewCount?: number;
};

const QUICK_LINKS = [
  { href: "/tools", key: "tools", Icon: Wrench },
  { href: "/models", key: "models", Icon: Flame },
  { href: "/learn", key: "learn", Icon: BookOpen },
  { href: "/match", key: "match", Icon: Sparkles },
  { href: "/home?view=plaza", key: "plaza", Icon: Compass },
] as const;

export function HomePlazaSection({ modelCount = 0, reviewCount = 0 }: Props) {
  const t = useTranslations("pages.homeExtra");

  return (
    <section id="plaza" className="space-y-4 scroll-mt-20">
      <div>
        <h2 className="text-lg font-bold text-zinc-950">{t("plazaTitle")}</h2>
        <p className="mt-1 text-sm text-zinc-600">{t("plazaSubtitle")}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_LINKS.map(({ href, key, Icon }) => (
          <Link
            key={key}
            href={href}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-800 ring-1 ring-zinc-200/80 hover:bg-violet-50 hover:text-violet-900"
          >
            <Icon className="h-3.5 w-3.5" />
            {t(`plazaLinks.${key}`)}
          </Link>
        ))}
      </div>

      <HomeCommunityHub modelCount={modelCount} reviewCount={reviewCount} />
      <StreakRiskBanner />
      <LearnProgressCard variant="compact" />
      <ActivationJourney />
      <WeekReviewCard />
      <PublishDraftBanner />
      <SocialProofTicker reviewCount={reviewCount} />
      <FollowingActivityStrip />
      <ContinueReading />
      <HomeHotRanking />
    </section>
  );
}
