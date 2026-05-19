"use client";

import { useEffect, useState } from "react";
import { DEMO_USER_ID } from "@/lib/constants";
import { LS_USER_ID } from "@/lib/clientSession";

/** SSR / 首屏与服务器一致；挂载后再读 localStorage，避免 hydration 不一致 */
export function useClientUserId(fallback = DEMO_USER_ID): string {
  const [userId, setUserId] = useState(fallback);
  useEffect(() => {
    try {
      setUserId(localStorage.getItem(LS_USER_ID) || fallback);
    } catch {
      setUserId(fallback);
    }
  }, [fallback]);
  return userId;
}
