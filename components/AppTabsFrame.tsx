"use client";

import { AmbientLayer } from "@/components/AmbientLayer";
import { BottomNav } from "@/components/BottomNav";
import { TabsTopChrome } from "@/components/TabsTopChrome";

export function AppTabsFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mesh-bg mesh-bg-animate relative z-0 min-h-screen">
      <AmbientLayer />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,rgba(139,92,246,0.18),transparent)]" />
      <div className="relative z-[1] mx-auto min-h-screen max-w-lg px-3 pb-28 pt-3">
        <div className="relative rounded-[30px] p-[1.5px] shadow-[0_0_0_1px_rgba(167,139,250,0.35),0_28px_100px_-32px_rgba(139,92,246,0.5),0_0_100px_-24px_rgba(236,72,153,0.22)] motion-safe:animate-border-shine bg-gradient-to-br from-violet-400/95 via-fuchsia-500/80 to-cyan-400/80">
          <div className="rounded-[28px] bg-white/90 p-2 shadow-inner backdrop-blur-2xl">
            <TabsTopChrome />
            <div className="rounded-[22px] border border-violet-100/80 bg-gradient-to-b from-white via-violet-50/40 to-fuchsia-50/30 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-violet-200/40 backdrop-blur-xl">
              {children}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
