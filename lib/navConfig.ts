import {
  Compass,
  HandCoins,
  MessageCircle,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { stripLocalePrefix } from "@/lib/localePath";

export type NavTab = "/home" | "/match" | "/bounty" | "/messages" | "/me";

/** next-intl nav.* 键名 */
export const NAV_I18N_KEY: Record<NavTab, string> = {
  "/home": "home",
  "/match": "match",
  "/bounty": "bounty",
  "/messages": "messages",
  "/me": "me",
};

export type NavItem = {
  href: string;
  labelKey: string;
  Icon: LucideIcon;
  tab: NavTab;
  unread?: boolean;
};

export const MAIN_NAV_ITEMS: NavItem[] = [
  { href: "/home", labelKey: "home", Icon: Compass, tab: "/home" },
  { href: "/match", labelKey: "match", Icon: Sparkles, tab: "/match" },
  { href: "/bounty", labelKey: "bounty", Icon: HandCoins, tab: "/bounty" },
  {
    href: "/messages",
    labelKey: "messages",
    Icon: MessageCircle,
    tab: "/messages",
    unread: true,
  },
  { href: "/me", labelKey: "me", Icon: UserRound, tab: "/me" },
];

export function resolveTab(pathname: string): NavTab {
  const p = stripLocalePrefix(pathname);
  if (p.startsWith("/messages")) return "/messages";
  if (p.startsWith("/bounty")) return "/bounty";
  if (p.startsWith("/match")) return "/match";
  if (
    p.startsWith("/me") ||
    p.startsWith("/settings") ||
    p.startsWith("/creator") ||
    p.startsWith("/orders")
  ) {
    return "/me";
  }
  if (
    p.startsWith("/workspace") ||
    p.startsWith("/demo") ||
    p.startsWith("/tools") ||
    p.startsWith("/market") ||
    p.startsWith("/models") ||
    p.startsWith("/learn") ||
    p.startsWith("/templates")
  ) {
    return "/home";
  }
  return "/home";
}

/** Tab 名（无 i18n 时的中文回退） */
export const TAB_LABELS: Record<NavTab, string> = {
  "/home": "发现",
  "/match": "匹配",
  "/bounty": "悬赏",
  "/messages": "消息",
  "/me": "我的",
};

const EXTRA_PATH_LABEL_KEYS: Record<string, string> = {
  "/search": "search",
  "/publish": "publish",
  "/settings": "settings",
  "/tools": "tools",
  "/workspace": "workspace",
  "/bounty": "bounty",
};

/** 供服务端组件使用；Client 请用 useTranslations('nav') */
export function tabLabelForPath(pathname: string): string {
  return TAB_LABELS[resolveTab(pathname)];
}

export function tabLabelKeyForPath(pathname: string): string {
  const base = stripLocalePrefix(pathname.split("?")[0] || "/home");
  return EXTRA_PATH_LABEL_KEYS[base] ?? NAV_I18N_KEY[resolveTab(pathname)];
}
