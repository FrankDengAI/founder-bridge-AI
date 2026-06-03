import { FeedCard } from "@/components/FeedCard";
import { ContinueReading } from "@/components/home/ContinueReading";
import { DiscoveryAppChrome } from "@/components/home/DiscoveryAppChrome";
import { HomeCommunityHub } from "@/components/home/HomeCommunityHub";
import { HomeHotRanking } from "@/components/home/HomeHotRanking";
import { HomeFeedGrid } from "@/components/home/HomeFeedGrid";
import { HomeInfiniteFeed } from "@/components/home/HomeInfiniteFeed";
import { WebHomeBody } from "@/components/home/WebHomeBody";
import { AppOnly } from "@/components/view-mode/AppOnly";
import { WebOnly } from "@/components/view-mode/WebOnly";
import { LearnProgressCard } from "@/components/learn/LearnProgressCard";
import { ActivationJourney } from "@/components/retention/ActivationJourney";
import { FollowingActivityStrip } from "@/components/retention/FollowingActivityStrip";
import { PublishDraftBanner } from "@/components/retention/PublishDraftBanner";
import { SocialProofTicker } from "@/components/retention/SocialProofTicker";
import { StreakRiskBanner } from "@/components/retention/StreakRiskBanner";
import { WeekReviewCard } from "@/components/retention/WeekReviewCard";
import { HomeClearLanding } from "@/components/home/HomeClearLanding";
import { HomeDiscoveryMeta } from "@/components/home/HomeDiscoveryMeta";
import { HomeSavedFeed } from "@/components/home/HomeSavedFeed";
import { HomeToolbar } from "@/components/home/HomeToolbar";
import { PageHeader } from "@/components/PageHeader";
import { feedNextCursor, toFeedPostItem } from "@/lib/feedCursor";
import { loadHomeFeedPosts, loadHomeMetaCounts } from "@/lib/homeFeed";
import { getUserIdFromCookies } from "@/lib/session";
import { isPostType } from "@/lib/domain/postType";
import { getTranslations } from "next-intl/server";

const APP_TAKE = 20;
const WEB_TAKE = 40;

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { type?: string; sort?: string; view?: string };
}) {
  const tHome = await getTranslations("home");
  const tExtra = await getTranslations("pages.homeExtra");
  const view = searchParams?.view?.toLowerCase();
  const rawType = searchParams?.type;
  const type = rawType && isPostType(rawType) ? rawType : undefined;
  const sortRaw = searchParams?.sort?.toLowerCase();
  const sort: "new" | "hot" = sortRaw === "hot" ? "hot" : "new";

  const metaCounts = await loadHomeMetaCounts();

  const retentionBlocks = (
    <WebOnly>
      <>
        <HomeClearLanding />
        <details className="rounded-2xl border border-zinc-200/80 bg-white/80 px-4 py-3 text-sm shadow-sm">
          <summary className="cursor-pointer font-semibold text-zinc-800">
            {tExtra("moreModules")}
          </summary>
          <div className="mt-4 space-y-4">
            <HomeCommunityHub
              modelCount={metaCounts.models}
              reviewCount={metaCounts.reviews}
            />
            <StreakRiskBanner />
            <LearnProgressCard variant="compact" />
            <ActivationJourney />
            <WeekReviewCard />
            <PublishDraftBanner />
            <SocialProofTicker reviewCount={metaCounts.reviews} />
            <FollowingActivityStrip />
            <ContinueReading />
            <HomeHotRanking />
          </div>
        </details>
      </>
    </WebOnly>
  );

  const currentView =
    view === "for-you" ? "for-you" : view === "saved" ? "saved" : "default";

  if (view === "saved") {
    return (
      <div className="space-y-6 pb-4">
        <AppOnly>
          <div className="space-y-3 pb-4">
            <DiscoveryAppChrome currentType={type} sort={sort} view="saved" />
            <HomeSavedFeed />
          </div>
        </AppOnly>
        <WebOnly>
          <>
            <PageHeader
              title={tHome("title")}
              subtitle={tExtra("savedSubtitle")}
              right={<HomeToolbar />}
            />
            <HomeDiscoveryMeta
              currentType={type}
              sort={sort}
              currentView="saved"
              counts={metaCounts}
            />
            <WebHomeBody retention={retentionBlocks} feed={<HomeSavedFeed />} />
          </>
        </WebOnly>
      </div>
    );
  }

  const uid = await getUserIdFromCookies();
  const { app: posts, web: webPosts } = await loadHomeFeedPosts({
    view,
    type,
    sort,
    uid,
    appTake: APP_TAKE,
    webTake: WEB_TAKE,
  });

  const feedItems = posts.map(toFeedPostItem);
  const nextCursor = view === "for-you" ? null : feedNextCursor(posts, APP_TAKE);

  const webFeed = (
    <>
      <HomeFeedGrid>
        {webPosts.map((p) => (
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
      </HomeFeedGrid>
      {webPosts.length === 0 ? (
        <div className="glass-panel rounded-2xl p-6 text-center text-sm text-zinc-600 shadow-sm">
          {tExtra("empty")}
        </div>
      ) : null}
    </>
  );

  return (
    <div className="space-y-6 pb-4">
      <AppOnly>
        <div className="space-y-3 pb-4">
          <DiscoveryAppChrome
            currentType={type}
            sort={sort}
            view={view === "for-you" ? "for-you" : undefined}
          />
          <HomeInfiniteFeed
            initialPosts={feedItems}
            initialNextCursor={nextCursor}
            type={type}
            sort={sort}
            view={view === "for-you" ? "for-you" : undefined}
            emptyMessage={tExtra("empty")}
          />
        </div>
      </AppOnly>

      <WebOnly>
        <>
          <PageHeader
            title={tHome("title")}
            subtitle={
              view === "for-you"
                ? tExtra("forYouSubtitle")
                : tExtra("defaultSubtitle")
            }
            right={<HomeToolbar />}
          />
          <HomeDiscoveryMeta
            currentType={type}
            sort={sort}
            currentView={currentView}
            counts={metaCounts}
          />
          <WebHomeBody retention={retentionBlocks} feed={webFeed} />
        </>
      </WebOnly>
    </div>
  );
}
