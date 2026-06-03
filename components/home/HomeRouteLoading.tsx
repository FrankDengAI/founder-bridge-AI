"use client";

import { useViewModeOptional } from "@/components/view-mode/ViewModeProvider";
import { HomeFeedSkeleton } from "@/components/ui/PageListSkeleton";

function DiscoveryChromeSkeleton() {
  return (
    <header className="sticky top-0 z-20 -mx-1 space-y-2 px-1 pb-2 pt-0">
      <div className="h-5 w-24 rounded-lg bg-zinc-200/90 motion-safe:animate-pulse" />
      <div className="flex items-center gap-2">
        <div className="h-8 min-w-0 flex-1 rounded-xl bg-zinc-100 motion-safe:animate-pulse" />
        <div className="h-8 w-20 shrink-0 rounded-xl bg-zinc-100 motion-safe:animate-pulse" />
      </div>
    </header>
  );
}

function WebHomeMetaSkeleton() {
  return (
    <div className="space-y-3">
      <div className="glass-panel rounded-shell p-3 shadow-panel ring-1 ring-white/60">
        <div className="h-3 w-16 rounded bg-zinc-200/80 motion-safe:animate-pulse" />
        <div className="mt-2 flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-16 rounded-full bg-zinc-100 motion-safe:animate-pulse"
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white/70 px-3 py-2 text-center ring-1 ring-zinc-200/60 motion-safe:animate-pulse"
          >
            <div className="mx-auto h-6 w-10 rounded bg-zinc-200/80" />
            <div className="mx-auto mt-1 h-2 w-12 rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function WebHeaderSkeleton() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0 space-y-2">
        <div className="h-7 w-32 rounded-lg bg-zinc-200/90 motion-safe:animate-pulse" />
        <div className="h-4 w-48 max-w-full rounded bg-zinc-100 motion-safe:animate-pulse" />
      </div>
      <div className="h-10 w-[120px] rounded-2xl bg-white/60 ring-1 ring-zinc-200/60 motion-safe:animate-pulse" />
    </div>
  );
}

/** 与正式 /home 布局对齐的 loading，避免闪出过时的 HomeCinematicHero */
export function HomeRouteLoading() {
  const viewMode = useViewModeOptional();
  const isWeb = viewMode?.ready && viewMode.mode === "web";

  if (isWeb) {
    return (
      <div className="space-y-6 pb-4" data-testid="home-route-loading">
        <WebHeaderSkeleton />
        <WebHomeMetaSkeleton />
        <HomeFeedSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-4" data-testid="home-route-loading">
      <DiscoveryChromeSkeleton />
      <HomeFeedSkeleton />
    </div>
  );
}
