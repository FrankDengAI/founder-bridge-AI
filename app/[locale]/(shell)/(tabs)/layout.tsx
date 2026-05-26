import { Suspense } from "react";
import { AdaptiveTabsFrame } from "@/components/view-mode/AdaptiveTabsFrame";
import { ViewModeProvider } from "@/components/view-mode/ViewModeProvider";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewModeProvider>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
            加载中…
          </div>
        }
      >
        <AdaptiveTabsFrame>{children}</AdaptiveTabsFrame>
      </Suspense>
    </ViewModeProvider>
  );
}
