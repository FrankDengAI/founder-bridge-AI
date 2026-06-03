"use client";

import { useViewModeOptional } from "@/components/view-mode/ViewModeProvider";

/** 仅在 App 模式下渲染子节点（Web 模式内容由右栏承担） */
export function AppOnly({ children }: { children: React.ReactNode }) {
  const viewMode = useViewModeOptional();
  if (!viewMode?.ready || !viewMode.mode) return null;
  if (viewMode.isWeb) return null;
  return <>{children}</>;
}
