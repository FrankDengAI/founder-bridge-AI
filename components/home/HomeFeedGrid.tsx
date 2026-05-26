"use client";

import clsx from "clsx";
import { useViewModeOptional } from "@/components/view-mode/ViewModeProvider";

export function HomeFeedGrid({ children }: { children: React.ReactNode }) {
  const viewMode = useViewModeOptional();
  const isWeb = viewMode?.isWeb ?? false;

  return (
    <div
      className={clsx(
        "gap-2 space-y-2 [column-fill:_balance]",
        isWeb ? "columns-2 lg:columns-3" : "columns-2",
      )}
    >
      {children}
    </div>
  );
}
