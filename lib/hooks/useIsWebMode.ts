"use client";

import { useViewModeOptional } from "@/components/view-mode/ViewModeProvider";

export function useIsWebMode(): boolean {
  return useViewModeOptional()?.isWeb ?? false;
}
