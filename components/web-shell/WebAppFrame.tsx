"use client";

import { usePathname } from "@/i18n/navigation";
import { AmbientLayer } from "@/components/AmbientLayer";
import { BottomNav } from "@/components/BottomNav";
import { WebRightRail } from "@/components/web-shell/WebRightRail";
import { WebSidebarNav } from "@/components/web-shell/WebSidebarNav";
import { WebTopBar } from "@/components/web-shell/WebTopBar";
import { tabLabelKeyForPath } from "@/lib/navConfig";

export function WebAppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/home";

  return (
    <div className="mesh-bg mesh-bg-animate relative z-0 min-h-screen">
      <AmbientLayer />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,rgba(139,92,246,0.12),transparent)]" />
      <div className="relative z-[1] mx-auto flex min-h-screen max-w-[1400px] gap-0 px-0 lg:px-4">
        <WebSidebarNav />
        <div className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-0">
          <WebTopBar pageLabelKey={tabLabelKeyForPath(pathname)} />
          <div className="flex flex-1 gap-3 px-2 py-3 sm:gap-4 sm:px-3 lg:px-4 lg:py-4">
            <main className="min-w-0 flex-1">
              <div className="mx-auto max-w-3xl rounded-2xl border border-violet-200/50 bg-white/92 p-3 shadow-sm ring-1 ring-violet-100/60 backdrop-blur-xl sm:p-4 lg:max-w-none xl:max-w-4xl">
                {children}
              </div>
            </main>
            <WebRightRail pathname={pathname} />
          </div>
        </div>
      </div>
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
