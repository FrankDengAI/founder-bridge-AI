"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { AmbientLayer } from "@/components/AmbientLayer";
import { BottomNav } from "@/components/BottomNav";
import { WebRightRail } from "@/components/web-shell/WebRightRail";
import { WebSidebarNav } from "@/components/web-shell/WebSidebarNav";
import { WebTopBar } from "@/components/web-shell/WebTopBar";
import { pushRecentPath } from "@/components/web-shell/rail/RailRecentPaths";
import { tabLabelKeyForPath } from "@/lib/navConfig";

export function WebAppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/home";

  useEffect(() => {
    pushRecentPath(pathname);
  }, [pathname]);

  return (
    <div className="mesh-bg mesh-bg-animate relative z-0 min-h-screen">
      <AmbientLayer />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,rgba(139,92,246,0.12),transparent)]" />
      <div className="relative z-[1] mx-auto flex min-h-screen w-full max-w-screen-2xl gap-0 px-0 sm:px-4 lg:px-6 xl:px-10">
        <WebSidebarNav />
        <div className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-0">
          <WebTopBar pageLabelKey={tabLabelKeyForPath(pathname)} />
          <div className="flex flex-1 gap-4 py-4 lg:gap-6 lg:py-6">
            <main className="web-main web-main-enter min-w-0 flex-1 space-y-6 pb-8">{children}</main>
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
