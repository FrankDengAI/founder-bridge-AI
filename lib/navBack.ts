import { stripLocalePrefix } from "@/lib/localePath";
import { resolveTab } from "@/lib/navConfig";

/**
 * 各子页默认返回目标（先逛后登：未登录用户统一可回到 /home）
 * 显式传入 PageHeader backHref 时优先使用显式值。
 */
export function getDefaultBackHref(pathname: string): string {
  const base = stripLocalePrefix((pathname.split("?")[0] || "/home").replace(/\/$/, "") || "/home");

  if (base.startsWith("/post/")) return "/home";
  if (base.startsWith("/user/")) return "/home";
  if (base.startsWith("/publish")) return "/home";
  if (base.startsWith("/search")) return "/home";
  if (base.startsWith("/templates")) return "/home";
  if (base.startsWith("/learn/github")) return "/home";
  if (base.startsWith("/learn/step/")) return "/home";
  if (base.startsWith("/learn")) return "/home";
  if (base.startsWith("/demo/")) return "/home";

  if (base.startsWith("/settings/profile")) return "/settings";
  if (base.startsWith("/settings")) return "/me";
  if (base.startsWith("/me/achievements")) return "/me";
  if (base.startsWith("/creator")) return "/me";
  if (base.startsWith("/orders")) return "/tools";

  if (base.startsWith("/market/")) return "/tools";
  if (base.startsWith("/tools/") && base !== "/tools") return "/tools";
  if (base.startsWith("/models/") && base !== "/models") return "/models";

  if (base.startsWith("/collab/")) {
    const projectId = base.split("/")[2];
    return projectId ? `/project/${projectId}` : "/home";
  }
  if (base.startsWith("/project/")) return "/home";

  if (base.startsWith("/admin/")) return "/workspace";
  if (base.startsWith("/workspace")) return "/home";

  if (base.startsWith("/welcome/forgot-password")) return "/welcome/login";
  if (base.startsWith("/welcome/login")) return "/home";
  if (base.startsWith("/welcome/register")) return "/home";
  if (base.startsWith("/welcome/guest")) return "/welcome";
  if (base.startsWith("/welcome/mode")) return "/home";
  if (base === "/welcome") return "/home";

  const tab = resolveTab(pathname);
  if (tab === "/match" || tab === "/messages" || tab === "/bounty") return "/home";
  if (tab === "/me" && base !== "/me") return "/me";

  return "/home";
}

/** 主 Tab / 枢纽页不展示返回钮（用底部导航）；子页与详情页自动展示 */
export function shouldAutoShowBack(pathname: string): boolean {
  const base = stripLocalePrefix((pathname.split("?")[0] || "/").replace(/\/$/, "") || "/");
  const hubExact = new Set([
    "/home",
    "/match",
    "/bounty",
    "/messages",
    "/me",
    "/tools",
    "/models",
    "/learn",
    "/workspace",
    "/welcome",
  ]);
  if (hubExact.has(base)) return false;
  return true;
}

/** 构建带 next 的登录/注册 URL 查询串 */
export function authFlowQuery(next?: string | null, extra?: Record<string, string>): string {
  const params = new URLSearchParams();
  if (next) params.set("next", next);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v) params.set(k, v);
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
