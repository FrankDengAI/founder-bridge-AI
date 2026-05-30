"use client";

import { useViewModeOptional } from "@/components/view-mode/ViewModeProvider";

/** 仅在 Web 模式下渲染子节点 */
export function WebOnly({ children }: { children: React.ReactNode }) {
  const viewMode = useViewModeOptional();
  if (!viewMode?.isWeb) return null;
  return <>{children}</>;
}
