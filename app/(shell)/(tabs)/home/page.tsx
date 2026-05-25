import { FeedCard } from "@/components/FeedCard";
import { ReplyReturnBanner } from "@/components/home/ReplyReturnBanner";
import { ContinueReading } from "@/components/home/ContinueReading";
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
import { HomeCinematicHero } from "@/components/home/HomeCinematicHero";
import { HomeDiscoveryMeta } from "@/components/home/HomeDiscoveryMeta";
import { HomeSavedFeed } from "@/components/home/HomeSavedFeed";
import { HomeToolbar } from "@/components/home/HomeToolbar";
import { PageHeader } from "@/components/PageHeader";
import { scorePostForProfile } from "@/lib/forYou";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";
import { isPostType } from "@/lib/domain/postType";

type PostWithAuthor = Prisma.PostGetPayload<{
  include: { author: { select: { id: true; displayName: true } } };
}>;

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { type?: string; sort?: string; view?: string };
}) {
  const view = searchParams?.view?.toLowerCase();
  const rawType = searchParams?.type;
  const type = rawType && isPostType(rawType) ? rawType : undefined;
  const sortRaw = searchParams?.sort?.toLowerCase();
  const sort: "new" | "hot" = sortRaw === "hot" ? "hot" : "new";

  const orderBy =
    sort === "hot"
      ? [{ likes: "desc" as const }, { createdAt: "desc" as const }]
      : { createdAt: "desc" as const };

  const [postCount, userCount, toolCount, projectCount, modelCount, reviewCount] =
    await Promise.all([
      prisma.post.count(),
      prisma.user.count(),
      prisma.tool.count(),
      prisma.project.count(),
      prisma.aiModel.count(),
      prisma.aiModelReview.count(),
    ]);

  const heroStats = {
    posts: postCount,
    users: userCount,
    tools: toolCount,
    projects: projectCount,
    models: modelCount,
    reviews: reviewCount,
  };

  const metaCounts = {
    posts: postCount,
    users: userCount,
    tools: toolCount,
    projects: projectCount,
    models: modelCount,
    reviews: reviewCount,
  };

  const retentionBlocks = (
    <>
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
    </>
  );

  if (view === "saved") {
    return (
      <div className="space-y-3 pb-4">
        <PageHeader
          title="发现"
          subtitle="本地收藏视图：数据来自浏览器 localStorage，与卡片右上角书签联动。"
          right={<HomeToolbar />}
        />
        <HomeCinematicHero stats={heroStats} />
        <HomeDiscoveryMeta
          currentType={type}
          sort={sort}
          currentView="saved"
          counts={metaCounts}
        />
        {retentionBlocks}
        <HomeSavedFeed />
      </div>
    );
  }

  const uid = await getUserIdFromCookies();
  let posts: PostWithAuthor[];

  if (view === "for-you") {
    const profile = uid
      ? await prisma.userProfile.findUnique({ where: { userId: uid } })
      : null;
    const pool = await prisma.post.findMany({
      where: { status: "published", ...(type ? { type } : {}) },
      orderBy: { createdAt: "desc" },
      take: 120,
      include: { author: { select: { id: true, displayName: true } } },
    });
    const scored = pool
      .map((p) => ({ p, s: scorePostForProfile(p, profile) }))
      .sort((a, b) => {
        if (b.s !== a.s) return b.s - a.s;
        return b.p.createdAt.getTime() - a.p.createdAt.getTime();
      });
    posts = scored.slice(0, 40).map((x) => x.p);
    if (posts.length < 12) {
      const fallback = pool
        .filter((p) => !posts.some((x) => x.id === p.id))
        .slice(0, 40 - posts.length);
      posts = [...posts, ...fallback];
    }
  } else {
    posts = await prisma.post.findMany({
      where: { status: "published", ...(type ? { type } : {}) },
      orderBy,
      take: 40,
      include: { author: { select: { id: true, displayName: true } } },
    });
  }

  return (
    <div className="space-y-3 pb-4">
      <PageHeader
        title="发现"
        subtitle={
          view === "for-you"
            ? "为你推荐：按兴趣标签与技能关键词规则排序（演示级，无 ML）。"
            : "笔记 · 工具 · 大模型口碑 · 匹配伙伴 —— 冷启动期也能先留下来。"
        }
        right={<HomeToolbar />}
      />

      <HomeCinematicHero stats={heroStats} />

      <HomeDiscoveryMeta
        currentType={type}
        sort={sort}
        currentView={view === "for-you" ? "for-you" : "default"}
        counts={metaCounts}
      />

      {retentionBlocks}

      <div className="columns-2 gap-2 space-y-2 [column-fill:_balance]">
        {posts.map((p) => (
          <div key={p.id} className="mb-2 break-inside-avoid">
            <FeedCard
              id={p.id}
              authorId={p.author.id}
              type={p.type}
              title={p.title}
              excerpt={p.excerpt}
              coverUrl={p.coverUrl}
              authorName={p.author.displayName}
              likes={p.likes}
              saves={p.saves}
            />
          </div>
        ))}
      </div>
      {posts.length === 0 ? (
        <div className="glass-panel rounded-2xl p-6 text-center text-sm text-zinc-600 shadow-sm">
          暂无内容。请在项目目录运行{" "}
          <code className="rounded bg-white/70 px-1 ring-1 ring-zinc-200/70">
            npm run db:seed
          </code>
        </div>
      ) : null}
    </div>
  );
}
