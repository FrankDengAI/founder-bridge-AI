"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { modePickerPath } from "@/lib/localePath";
import { getViewMode, safeNextPath } from "@/lib/viewMode";
import { useViewMode } from "@/components/view-mode/ViewModeProvider";
import { ViewModeLoading } from "@/components/view-mode/ViewModeLoading";

export function ViewModeGate({ children }: { children: React.ReactNode }) {
  const { ready, mode, setMode } = useViewMode();
  const router = useRouter();
  const pathname = usePathname() ?? "/home";
  const searchParams = useSearchParams();
  const t = useTranslations("viewMode");

  useEffect(() => {
    if (!ready) return;
    const stored = getViewMode();
    if (stored && !mode) {
      setMode(stored);
      return;
    }
    if (mode || stored) return;
    const qs = searchParams?.toString();
    const next = safeNextPath(qs ? `${pathname}?${qs}` : pathname);
    router.replace(modePickerPath(next));
  }, [ready, mode, pathname, searchParams, router, setMode]);

  if (!ready) {
    return <ViewModeLoading message={t("loadingMode")} />;
  }

  if (!mode && !getViewMode()) {
    return <ViewModeLoading message={t("redirectMode")} />;
  }

  return <>{children}</>;
}
