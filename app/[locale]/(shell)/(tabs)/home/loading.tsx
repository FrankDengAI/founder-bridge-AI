import { getTranslations } from "next-intl/server";
import { HomeCinematicHero } from "@/components/home/HomeCinematicHero";
import { PageHeader } from "@/components/PageHeader";
import { HomeFeedSkeleton } from "@/components/ui/PageListSkeleton";

export default async function HomeLoading() {
  const tHome = await getTranslations("home");
  const t = await getTranslations("pages.loading");

  return (
    <div className="space-y-3 pb-4">
      <PageHeader
        title={tHome("title")}
        subtitle={t("homeSubtitle")}
        right={<div className="h-10 w-[120px] rounded-2xl bg-white/60 ring-1 ring-zinc-200/60 motion-safe:animate-pulse" />}
      />
      <HomeCinematicHero
        stats={{ posts: 0, users: 0, tools: 0, projects: 0 }}
      />
      <div className="glass-panel rounded-2xl p-3 shadow-sm ring-1 ring-white/60">
        <div className="h-4 w-24 rounded-full bg-zinc-200/80 motion-safe:animate-pulse dark:bg-zinc-800" />
        <div className="mt-3 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-16 shrink-0 rounded-full bg-zinc-100 motion-safe:animate-pulse dark:bg-zinc-800"
            />
          ))}
        </div>
      </div>
      <HomeFeedSkeleton />
    </div>
  );
}
