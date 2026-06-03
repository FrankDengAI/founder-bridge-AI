import { clearLocalUserId } from "@/lib/clientSession";
import { refreshClientSession } from "@/lib/hooks/useClientUserId";
import { currentBrowserLocale, localizedPath } from "@/lib/localePath";

/**
 * 演示站统一退出：清 Cookie（API）+ 清本地用户 id + 回发现页（先逛后登）。
 * 设置页、我的页、全局顶部账户菜单应共用此函数，避免漏清。
 */
export async function performLogout(): Promise<void> {
  let apiOk = false;
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    apiOk = res.ok;
    if (!res.ok) {
      const retry = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      apiOk = retry.ok;
    }
  } catch {
    /* 仍执行本地清理 */
  } finally {
    clearLocalUserId();
    await refreshClientSession();
    if (!apiOk) {
      console.warn("[performLogout] API logout may have failed; session cookie might persist.");
    }
    window.location.href = localizedPath("/home", currentBrowserLocale());
  }
}
