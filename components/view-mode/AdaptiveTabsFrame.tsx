"use client";

import { AppTabsFrame } from "@/components/AppTabsFrame";
import { WebAppFrame } from "@/components/web-shell/WebAppFrame";
import { ViewModeGate } from "@/components/view-mode/ViewModeGate";
import { useViewMode } from "@/components/view-mode/ViewModeProvider";

export function AdaptiveTabsFrame({ children }: { children: React.ReactNode }) {
  const { mode } = useViewMode();

  return (
    <ViewModeGate>
      <div key={mode ?? "pending"} className="motion-safe:animate-[vbcFadeIn_0.28s_ease-out]">
        {mode === "web" ? (
          <WebAppFrame>{children}</WebAppFrame>
        ) : (
          <AppTabsFrame>{children}</AppTabsFrame>
        )}
      </div>
    </ViewModeGate>
  );
}
