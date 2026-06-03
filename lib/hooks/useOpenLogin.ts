"use client";

import { useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  useAuthGateOptional,
  type OpenLoginOptions,
} from "@/components/auth/AuthGateProvider";
import { authFlowQuery } from "@/lib/navBack";

/** 打开登录弹窗；无 Provider 时回退到全屏登录页 */
export function useOpenLogin() {
  const gate = useAuthGateOptional();
  const router = useRouter();

  return useCallback(
    (opts?: OpenLoginOptions) => {
      if (gate) {
        gate.openLogin(opts);
        return;
      }
      router.push(
        `/welcome/login${authFlowQuery(opts?.next, opts?.reason ? { reason: opts.reason } : undefined)}`,
      );
    },
    [gate, router],
  );
}
