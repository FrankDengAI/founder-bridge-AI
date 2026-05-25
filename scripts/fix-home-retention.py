# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "app" / "(shell)" / "(tabs)" / "home" / "page.tsx"
t = p.read_text(encoding="utf-8")

RETENTION = """
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

if "HomeHotRanking" not in t:
    marker = '      <div className="columns-2 gap-2 space-y-2 [column-fill:_balance]">'
    t = t.replace(marker, RETENTION + "\n" + marker, 1)

old_counts = """        counts={{
          posts: postCount,
          users: userCount,
          tools: toolCount,
          projects: projectCount,
        }}
      />

      <div className="columns-2"""
new_counts = """        counts={{
          posts: postCount,
          users: userCount,
          tools: toolCount,
          projects: projectCount,
          models: modelCount,
          reviews: reviewCount,
        }}
      />
"""
if "models: modelCount" not in t.split("currentView")[1][:500]:
    t = t.replace(old_counts, new_counts + RETENTION + '\n      <div className="columns-2', 1)

p.write_text(t, encoding="utf-8")
print("fixed home retention", "HomeHotRanking" in t)
