"use client";

import { useTranslations } from "next-intl";
import { useIsWebMode } from "@/lib/hooks/useIsWebMode";
import { WebModuleSection } from "@/components/web-shell/WebModuleSection";
import { HomeRetentionStack } from "@/components/home/HomeRetentionStack";

type Props = {
  retention: React.ReactNode;
  feed: React.ReactNode;
};

/**
 * Web 首页双栏：左 Feed、右 Retention 动线。
 * App 模式保持「Retention 在上、Feed 在下」的垂直流。
 */
export function WebHomeBody({ retention, feed }: Props) {
  const isWeb = useIsWebMode();
  const t = useTranslations("pages.homeExtra");

  if (!isWeb) {
    return (
      <>
        {retention}
        {feed}
      </>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1.75fr)_minmax(280px,1fr)] lg:items-start lg:gap-8">
      <WebModuleSection
        title={t("feedTitle")}
        purpose={t("feedDesc")}
        delay={0.04}
        className="min-w-0"
      >
        {feed}
      </WebModuleSection>

      <div className="mt-6 space-y-4 lg:sticky lg:top-24 lg:mt-0">
        <WebModuleSection
          title={t("dailyPath")}
          purpose={t("dailyPathDesc")}
          compact
          delay={0.1}
        >
          <HomeRetentionStack variant="sidebar">{retention}</HomeRetentionStack>
        </WebModuleSection>
      </div>
    </div>
  );
}
