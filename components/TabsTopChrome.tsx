"use client";

import { useEffect, useState } from "react";
import { AccountMenu } from "@/components/AccountMenu";
import { NotificationHub } from "@/components/NotificationHub";
import { ViewModeSwitchButton } from "@/components/view-mode/ViewModeSwitchButton";
import { ViewModeBadge } from "@/components/view-mode/ViewModeBadge";

export function TabsTopChrome() {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <ViewModeBadge />
      <div className="flex items-center gap-2">
        <ViewModeSwitchButton variant="compact" />
        <AccountMenu />
        <NotificationHub />
      </div>
    </div>
  );
}
