"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/CommandPalette";
import { MissionCompleteToast } from "@/components/retention/MissionCompleteToast";
import { recordRouteVisit } from "@/lib/appHub";
import { injectDemoRetentionState } from "@/lib/demoRetention";
import { bumpVisitCounter, recordGamifyEvent } from "@/lib/gamification";
import { trackEvent } from "@/lib/retention";

export function AppShell() {
  const pathname = usePathname();

  useEffect(() => {
    recordRouteVisit(pathname);
    if (pathname === "/home" || pathname.startsWith("/home/")) {
      recordGamifyEvent("visit_home");
    }
    if (pathname.startsWith("/workspace")) recordGamifyEvent("open_workspace");
    if (pathname.startsWith("/match")) {
      recordGamifyEvent("open_match");
      bumpVisitCounter("match", "match_3", 3);
    }
    trackEvent("page_view", { path: pathname });
  }, [pathname]);

  useEffect(() => {
    const onPalette = () => recordGamifyEvent("open_palette");
    window.addEventListener("vibe-command-palette-opened", onPalette);
    return () => window.removeEventListener("vibe-command-palette-opened", onPalette);
  }, []);

  useEffect(() => {
    injectDemoRetentionState();
  }, []);

  return (
    <>
      <CommandPalette />
      <MissionCompleteToast />
    </>
  );
}
