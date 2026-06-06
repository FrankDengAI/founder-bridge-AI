import { FeedCard } from "@/components/FeedCard";
import { HomeClearLanding } from "@/components/home/HomeClearLanding";
import { DiscoveryAppChrome } from "@/components/home/DiscoveryAppChrome";
import { HomePlazaSection } from "@/components/home/HomePlazaSection";
import { DiscoveryPlazaStrip } from "@/components/home/DiscoveryPlazaStrip";
import { HomeFeedGrid } from "@/components/home/HomeFeedGrid";
import { HomeInfiniteFeed } from "@/components/home/HomeInfiniteFeed";
import { WebHomeBody } from "@/components/home/WebHomeBody";
import { AppOnly } from "@/components/view-mode/AppOnly";
import { WebOnly } from "@/components/view-mode/WebOnly";
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
        {view !== "plaza" ? <HomeClearLanding /> : null}
        <HomePlazaSection
          modelCount={metaCounts.models}
          reviewCount={metaCounts.reviews}
        />
      </>
    </WebOnly>
  );

  const currentView =
    view === "for-you"
      ? "for-you"
      : view === "saved"
        ? "saved"
        : view === "plaza"
          ? "plaza"
          : "default";

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
          <DiscoveryPlazaStrip />
          {view === "plaza" ? (
            <HomePlazaSection
              modelCount={metaCounts.models}
              reviewCount={metaCounts.reviews}
            />
          ) : (
            <HomeInfiniteFeed
            initialPosts={feedItems}
            initialNextCursor={nextCursor}
            type={type}
            sort={sort}
            view={view === "for-you" ? "for-you" : undefined}
            emptyMessage={tExtra("empty")}
          />
          )}
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
            currentView={currentView === "plaza" ? "default" : currentView}
            counts={metaCounts}
          />
          <WebHomeBody retention={retentionBlocks} feed={webFeed} />
        </>
      </WebOnly>
    </div>
  );
}
