"use client";

import { useTranslations } from "next-intl";
import { AccountMenu } from "@/components/AccountMenu";
import { AppQuickActions } from "@/components/AppQuickActions";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ViewModeSwitchButton } from "@/components/view-mode/ViewModeSwitchButton";
import { ViewModeBadge } from "@/components/view-mode/ViewModeBadge";

export function TabsTopChrome() {
  const t = useTranslations("navExtra");

  return (
    <div className="mb-2 flex items-center gap-1.5">
      <div className="shrink-0">
        <ViewModeBadge />
      </div>
      <div
        role="toolbar"
        data-testid="app-top-toolbar"
        aria-label={t("appToolbar")}
        className="flex min-w-0 flex-1 items-center justify-end gap-0.5 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-1 [&::-webkit-scrollbar]:hidden"
      >
        <LocaleSwitcher className="shrink-0" />
        <AppQuickActions className="shrink-0" />
        <ViewModeSwitchButton variant="compact" size="compact" />
        <AccountMenu size="compact" />
      </div>
    </div>
  );
}
