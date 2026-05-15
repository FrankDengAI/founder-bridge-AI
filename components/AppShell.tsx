"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/CommandPalette";
import { recordRouteVisit } from "@/lib/appHub";
import { recordGamifyEvent } from "@/lib/gamification";

export function AppShell() {
  const pathname = usePathname();

  useEffect(() => {
    recordRouteVisit(pathname);
    if (pathname === "/home" || pathname.startsWith("/home/")) {
      recordGamifyEvent("visit_home");
    }
    if (pathname.startsWith("/workspace")) recordGamifyEvent("open_workspace");
    if (pathname.startsWith("/match")) recordGamifyEvent("open_match");
  }, [pathname]);

  useEffect(() => {
    const onPalette = () => recordGamifyEvent("open_palette");
    window.addEventListener("vibe-command-palette-opened", onPalette);
    return () => window.removeEventListener("vibe-command-palette-opened", onPalette);
  }, []);

  return <CommandPalette />;
}
