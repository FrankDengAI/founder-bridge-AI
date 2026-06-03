"use client";

import { useViewModeOptional } from "@/components/view-mode/ViewModeProvider";
import { viewModeLabel } from "@/lib/viewMode";

/** App 模式下显示当前模式标签（Web 模式在 WebTopBar 已有） */
export function ViewModeBadge() {
  const ctx = useViewModeOptional();
  if (!ctx?.mode || ctx.isWeb) return null;
  return (
    <span className="max-w-[5rem] truncate rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
      {viewModeLabel(ctx.mode)}
    </span>
  );
}
