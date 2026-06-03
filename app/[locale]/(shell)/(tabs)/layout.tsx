import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { AuthGateProvider } from "@/components/auth/AuthGateProvider";
import { AuthGateUrlHandler } from "@/components/auth/AuthGateUrlHandler";
import { AdaptiveTabsFrame } from "@/components/view-mode/AdaptiveTabsFrame";
import { ViewModeProvider } from "@/components/view-mode/ViewModeProvider";

async function TabsLoadingFallback() {
  const t = await getTranslations("common");
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
      {t("loading")}
    </div>
  );
}

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewModeProvider>
      <AuthGateProvider>
        <Suspense fallback={<TabsLoadingFallback />}>
          <AuthGateUrlHandler />
          <AdaptiveTabsFrame>{children}</AdaptiveTabsFrame>
        </Suspense>
      </AuthGateProvider>
    </ViewModeProvider>
  );
}
