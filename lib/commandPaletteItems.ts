import type { LucideIcon } from "lucide-react";
import {
  Compass,
  Cpu,
  GraduationCap,
  Heart,
  LayoutGrid,
  MessageCircle,
  PenSquare,
  Search,
  Settings,
  Sparkles,
  HandCoins,
  UserRound,
  Wrench,
  Zap,
  BadgeCheck,
  ShoppingBag,
} from "lucide-react";

export type CommandGroupKey = "nav" | "create" | "learn" | "system";

export type CommandItem = {
  id: string;
  groupKey: CommandGroupKey;
  labelKey: string;
  hintKey?: string;
  href: string;
  keywords: string[];
  Icon: LucideIcon;
};

type CommandT = (key: string) => string;

const COMMAND_ITEM_DEFS: CommandItem[] = [
  {
    id: "home",
    groupKey: "nav",
    labelKey: "home.label",
    hintKey: "home.hint",
    href: "/home",
    keywords: ["feed", "首页", "发现", "discover", "home"],
    Icon: Compass,
  },
  {
    id: "me",
    groupKey: "nav",
    labelKey: "me.label",
    hintKey: "me.hint",
    href: "/me",
    keywords: ["profile", "个人", "me"],
    Icon: UserRound,
  },
  {
    id: "messages",
    groupKey: "nav",
    labelKey: "messages.label",
    hintKey: "messages.hint",
    href: "/messages",
    keywords: ["chat", "im", "私信", "回复", "messages"],
    Icon: MessageCircle,
  },
  {
    id: "achievements",
    groupKey: "nav",
    labelKey: "achievements.label",
    hintKey: "achievements.hint",
    href: "/me/achievements",
    keywords: ["badge", "成就", "分享", "achievements"],
    Icon: BadgeCheck,
  },
  {
    id: "search",
    groupKey: "nav",
    labelKey: "search.label",
    hintKey: "search.hint",
    href: "/search",
    keywords: ["find", "检索", "search"],
    Icon: Search,
  },
  {
    id: "publish",
    groupKey: "create",
    labelKey: "publish.label",
    href: "/publish",
    keywords: ["写", "发帖", "note", "publish"],
    Icon: PenSquare,
  },
  {
    id: "creator",
    groupKey: "create",
    labelKey: "creator.label",
    hintKey: "creator.hint",
    href: "/creator",
    keywords: ["dashboard", "指标", "内容", "creator"],
    Icon: BadgeCheck,
  },
  {
    id: "orders",
    groupKey: "learn",
    labelKey: "orders.label",
    href: "/orders",
    keywords: ["wishlist", "订单", "商城", "orders"],
    Icon: ShoppingBag,
  },
  {
    id: "match",
    groupKey: "create",
    labelKey: "match.label",
    hintKey: "match.hint",
    href: "/match",
    keywords: ["伙伴", "cofounder", "组队", "match"],
    Icon: Sparkles,
  },
  {
    id: "bounty",
    groupKey: "create",
    labelKey: "bounty.label",
    hintKey: "bounty.hint",
    href: "/bounty",
    keywords: ["悬赏", "需求", "bounty", "need", "hire"],
    Icon: HandCoins,
  },
  {
    id: "saved",
    groupKey: "create",
    labelKey: "saved.label",
    hintKey: "saved.hint",
    href: "/home?view=saved",
    keywords: ["bookmark", "收藏", "稍后读", "saved"],
    Icon: Heart,
  },
  {
    id: "workspace",
    groupKey: "system",
    labelKey: "workspace.label",
    hintKey: "workspace.hint",
    href: "/workspace",
    keywords: ["dashboard", "看板", "hub", "workspace"],
    Icon: LayoutGrid,
  },
  {
    id: "learn",
    groupKey: "learn",
    labelKey: "learn.label",
    href: "/learn/step/1",
    keywords: ["课程", "路线", "项目", "learn"],
    Icon: GraduationCap,
  },
  {
    id: "github",
    groupKey: "learn",
    labelKey: "github.label",
    href: "/learn/github",
    keywords: ["仓库", "git", "github"],
    Icon: Zap,
  },
  {
    id: "models",
    groupKey: "learn",
    labelKey: "models.label",
    hintKey: "models.hint",
    href: "/models",
    keywords: ["LLM", "GPT", "Claude", "模型", "榜单", "评分", "models"],
    Icon: Cpu,
  },
  {
    id: "tools",
    groupKey: "learn",
    labelKey: "tools.label",
    href: "/tools",
    keywords: ["导航", "评分", "模板", "tools"],
    Icon: Wrench,
  },
  {
    id: "templates",
    groupKey: "learn",
    labelKey: "templates.label",
    href: "/templates",
    keywords: ["starter", "脚手架", "下载", "templates"],
    Icon: Wrench,
  },
  {
    id: "profile-edit",
    groupKey: "system",
    labelKey: "profileEdit.label",
    href: "/settings/profile",
    keywords: ["资料", "技能", "profile"],
    Icon: UserRound,
  },
  {
    id: "admin",
    groupKey: "system",
    labelKey: "admin.label",
    href: "/admin/demo",
    keywords: ["运营", "种子", "人设", "admin"],
    Icon: LayoutGrid,
  },
  {
    id: "settings",
    groupKey: "system",
    labelKey: "settings.label",
    href: "/settings",
    keywords: ["主题", "退出", "偏好", "settings"],
    Icon: Settings,
  },
];

export type ResolvedCommandItem = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  href: string;
  keywords: string[];
  Icon: LucideIcon;
};

export function getCommandItems(t: CommandT): ResolvedCommandItem[] {
  return COMMAND_ITEM_DEFS.map((item) => ({
    id: item.id,
    group: t(`groups.${item.groupKey}`),
    label: t(item.labelKey),
    hint: item.hintKey ? t(item.hintKey) : undefined,
    href: item.href,
    keywords: item.keywords,
    Icon: item.Icon,
  }));
}

/** @deprecated Use getCommandItems with useTranslations('command') */
export const COMMAND_ITEMS: ResolvedCommandItem[] = [];
