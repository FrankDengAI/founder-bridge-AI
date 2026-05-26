import { clearLocalUserId } from "@/lib/clientSession";
import { invalidateClientSession } from "@/lib/hooks/useClientUserId";
import { clearViewMode } from "@/lib/viewMode";

/**
 * 演示站统一退出：清 Cookie（API）+ 清本地用户 id + 回欢迎页。
 * 设置页、我的页、全局顶部账户菜单应共用此函数，避免漏清。
 */
export async function performLogout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    /* 仍执行本地清理 */
  } finally {
    clearLocalUserId();
    clearViewMode();
    invalidateClientSession();
    window.location.href = "/welcome";
  }
}
