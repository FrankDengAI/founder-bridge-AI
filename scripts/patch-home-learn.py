# -*- coding: utf-8 -*-
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT.parent / "code_demo" / "app" / "(tabs)" / "home" / "page.tsx"

EXTRA_IMPORTS = """import { ContinueReading } from "@/components/home/ContinueReading";
import { DailyMatchCard } from "@/components/home/DailyMatchCard";
import { HomeCommunityHub } from "@/components/home/HomeCommunityHub";
import { HomeHotRanking } from "@/components/home/HomeHotRanking";
import { TodayMissionStrip } from "@/components/home/TodayMissionStrip";
import { ActivationJourney } from "@/components/retention/ActivationJourney";
import { FollowingActivityStrip } from "@/components/retention/FollowingActivityStrip";
import { PublishDraftBanner } from "@/components/retention/PublishDraftBanner";
import { SocialProofTicker } from "@/components/retention/SocialProofTicker";
import { StreakRiskBanner } from "@/components/retention/StreakRiskBanner";
import { WeekReviewCard } from "@/components/retention/WeekReviewCard";
"""

RETENTION_BLOCK = """
      <HomeCommunityHub modelCount={modelCount} reviewCount={reviewCount} />
      <StreakRiskBanner />
      <TodayMissionStrip />
      <ActivationJourney />
      <DailyMatchCard />
      <WeekReviewCard />
      <PublishDraftBanner />
      <SocialProofTicker reviewCount={reviewCount} />
      <FollowingActivityStrip />
      <ContinueReading />
      <HomeHotRanking />
"""

SAVED_BLOCK = """
        <HomeCommunityHub modelCount={modelCount} reviewCount={reviewCount} />
        <StreakRiskBanner />
        <TodayMissionStrip />
        <PublishDraftBanner />
"""


def main() -> None:
    text = SRC.read_text(encoding="utf-8")
    text = text.replace(
        'import { HomeCinematicHero } from "@/components/home/HomeCinematicHero";',
        EXTRA_IMPORTS + 'import { HomeCinematicHero } from "@/components/home/HomeCinematicHero";',
    )
    text = text.replace(
        """  const [postCount, userCount, toolCount, projectCount] = await Promise.all([
    prisma.post.count(),
    prisma.user.count(),
    prisma.tool.count(),
    prisma.project.count(),
  ]);""",
        """  const [postCount, userCount, toolCount, projectCount, modelCount, reviewCount] =
    await Promise.all([
      prisma.post.count(),
      prisma.user.count(),
      prisma.tool.count(),
      prisma.project.count(),
      prisma.aiModel.count(),
      prisma.aiModelReview.count(),
    ]);""",
    )
    text = text.replace(
        "projects: projectCount,\n          }}",
        "projects: projectCount,\n            models: modelCount,\n            reviews: reviewCount,\n          }}",
    )
    text = text.replace(
        "        />\n        <HomeSavedFeed />",
        "        />" + SAVED_BLOCK + "\n        <HomeSavedFeed />",
    )
    text = text.replace("const uid = getUserIdFromCookies();", "const uid = await getUserIdFromCookies();")
    text = text.replace(
        "where: type ? { type } : {},",
        'where: { status: "published", ...(type ? { type } : {}) },',
    )
    text = text.replace(
        '            : "双列信息流 · 类型筛选 · 最新/热门 · 命令面板 · 收藏 · 通知中心与主题在右上角。"',
        '            : "笔记 · 工具 · 大模型口碑 · 匹配伙伴 —— 冷启动期也能先留下来。"',
    )
    text = text.replace(
        '      <motionlessDiv className="columns-2 gap-2 space-y-2 [column-fill:_balance]">',
        RETENTION_BLOCK + '\n      <div className="columns-2 gap-2 space-y-2 [column-fill:_balance]">',
    ).replace("motionlessDiv", "div")
    text = text.replace(
        """      <HomeCinematicHero
        stats={{
          posts: postCount,
          users: userCount,
          tools: toolCount,
          projects: projectCount,
        }}
      />""",
        """      <HomeCinematicHero
        stats={{
          posts: postCount,
          users: userCount,
          tools: toolCount,
          projects: projectCount,
          models: modelCount,
          reviews: reviewCount,
        }}
      />""",
    )
    out = ROOT / "app" / "(shell)" / "(tabs)" / "home" / "page.tsx"
    out.write_text(text, encoding="utf-8")
    print("wrote", out, len(text))


if __name__ == "__main__":
    main()
