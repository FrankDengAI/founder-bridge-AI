/**
 * App / Web 双模式约定：
 * - 新功能只写 tabs 路由 page + 共享 components
 * - 导航改动只改 lib/navConfig.ts
 * - 布局差异只改 AppTabsFrame / WebAppFrame，禁止复制整页
 */

export type ViewMode = "app" | "web";

export const SS_VIEW_MODE = "vbc_view_mode";

export function isViewMode(v: string | null | undefined): v is ViewMode {
  return v === "app" || v === "web";
}

export function getViewMode(): ViewMode | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SS_VIEW_MODE);
    return isViewMode(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function setViewMode(mode: ViewMode): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SS_VIEW_MODE, mode);
  } catch {
    /* ignore */
  }
}

export function clearViewMode(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SS_VIEW_MODE);
  } catch {
    /* ignore */
  }
}

/** 防止 open redirect：仅允许站内相对路径 */
export function safeNextPath(raw: string | null | undefined, fallback = "/home"): string {
  const v = (raw ?? fallback).trim();
  if (!v.startsWith("/") || v.startsWith("//")) return fallback;
  if (v.includes("://") || v.includes("\\") || v.includes("@")) return fallback;
  const clean = v.split("#")[0];
  return clean || fallback;
}

/** 进入 App 区前的模式选择页（默认 locale；Client 请用 lib/localePath + useLocale） */
export { modePickerHref } from "@/lib/localePath";

export function viewModeLabel(mode: ViewMode): string {
  return mode === "app" ? "App 模式" : "网页模式";
}

export function viewModeShortLabel(mode: ViewMode): string {
  return mode === "app" ? "App" : "网页";
}

export function viewModeDescription(mode: ViewMode): string {
  return mode === "app"
    ? "手机尺寸壳层 + 底部 Tab，适合移动端与单手操作。"
    : "左栏导航 + 宽屏内容 + 右栏推荐，适合桌面深度浏览。";
}

const NEXT_PATH_LABELS: Record<string, string> = {
  "/home": "发现首页",
  "/learn": "学习路线",
  "/learn/step/1": "学习路线",
  "/match": "伙伴匹配",
  "/messages": "消息中心",
  "/me": "我的主页",
  "/search": "搜索",
  "/publish": "发布笔记",
  "/tools": "工具商城",
  "/workspace": "工作台",
  "/settings": "设置",
};

/** 模式选择页友好展示跳转目标 */
export function formatNextPathLabel(path: string): string {
  const base = path.split("?")[0] || "/home";
  const label = NEXT_PATH_LABELS[base];
  if (label) {
    const qs = path.includes("?") ? path.slice(path.indexOf("?")) : "";
    return qs ? `${label}${qs}` : label;
  }
  return path;
}
