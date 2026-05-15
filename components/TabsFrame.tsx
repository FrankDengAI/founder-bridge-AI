"use client";

import { AmbientLayer } from "@/components/AmbientLayer";
import { BottomNav } from "@/components/BottomNav";
import { TabsTopChrome } from "@/components/TabsTopChrome";

export function TabsFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mesh-bg mesh-bg-animate relative z-0 min-h-screen">
      <AmbientLayer />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,rgba(139,92,246,0.18),transparent)]" />
      <div className="relative z-[1] mx-auto min-h-screen max-w-lg px-3 pb-28 pt-3">
        <div className="relative rounded-[30px] p-[1.5px] shadow-[0_0_0_1px_rgba(167,139,250,0.35),0_28px_100px_-32px_rgba(139,92,246,0.5),0_0_100px_-24px_rgba(236,72,153,0.22)] motion-safe:animate-border-shine bg-gradient-to-br from-violet-400/95 via-fuchsia-500/80 to-cyan-400/80 dark:from-violet-600/55 dark:via-fuchsia-600/45 dark:to-sky-600/45">
          <div className="rounded-[28px] bg-white/82 p-2 shadow-inner backdrop-blur-2xl dark:bg-zinc-950/78">
            <TabsTopChrome />
            <div className="rounded-[22px] border border-white/60 bg-gradient-to-b from-white/95 via-violet-50/90 to-fuchsia-50/85 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-violet-200/50 backdrop-blur-xl dark:border-zinc-800/80 dark:from-zinc-950/92 dark:via-zinc-950/88 dark:to-zinc-950/82 dark:ring-zinc-800/80">
              {children}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
