import type { LucideIcon } from "lucide-react";
import {
  Compass,
  GraduationCap,
  Heart,
  LayoutGrid,
  MessageCircle,
  PenSquare,
  Search,
  Settings,
  Sparkles,
  UserRound,
  Wrench,
  Zap,
  BadgeCheck,
  ShoppingBag,
} from "lucide-react";

export type CommandGroup = "导航" | "创作与连接" | "学习与工具" | "系统";

export type CommandItem = {
  id: string;
  group: CommandGroup;
  label: string;
  hint?: string;
  href: string;
  keywords: string[];
  Icon: LucideIcon;
};

export const COMMAND_ITEMS: CommandItem[] = [
  {
    id: "home",
    group: "导航",
    label: "发现首页",
    hint: "双列信息流",
    href: "/home",
    keywords: ["feed", "首页", "发现"],
    Icon: Compass,
  },
  {
    id: "me",
    group: "导航",
    label: "我的",
    hint: "账号与快捷入口",
    href: "/me",
    keywords: ["profile", "个人"],
    Icon: UserRound,
  },
  {
    id: "messages",
    group: "导航",
    label: "消息",
    hint: "本地会话演示",
    href: "/messages",
    keywords: ["chat", "im", "私信"],
    Icon: MessageCircle,
  },
  {
    id: "search",
    group: "导航",
    label: "全局搜索",
    hint: "标题检索",
    href: "/search",
    keywords: ["find", "检索"],
    Icon: Search,
  },
  {
    id: "publish",
    group: "创作与连接",
    label: "发布笔记",
    href: "/publish",
    keywords: ["写", "发帖", "note"],
    Icon: PenSquare,
  },
  {
    id: "creator",
    group: "创作与连接",
    label: "创作者中心",
    hint: "我的笔记与指标",
    href: "/creator",
    keywords: ["dashboard", "指标", "内容"],
    Icon: BadgeCheck,
  },
  {
    id: "orders",
    group: "学习与工具",
    label: "心愿单与演示订单",
    href: "/orders",
    keywords: ["wishlist", "订单", "商城"],
    Icon: ShoppingBag,
  },
  {
    id: "match",
    group: "创作与连接",
    label: "创业匹配",
    hint: "画像与推荐",
    href: "/match",
    keywords: ["伙伴", "cofounder", "组队"],
    Icon: Sparkles,
  },
  {
    id: "saved",
    group: "创作与连接",
    label: "我的收藏",
    hint: "已保存的笔记",
    href: "/home?view=saved",
    keywords: ["bookmark", "收藏", "稍后读"],
    Icon: Heart,
  },
  {
    id: "workspace",
    group: "系统",
    label: "工作台",
    hint: "数据看板与快捷能力",
    href: "/workspace",
    keywords: ["dashboard", "看板", "hub"],
    Icon: LayoutGrid,
  },
  {
    id: "learn",
    group: "学习与工具",
    label: "学习中心",
    href: "/learn",
    keywords: ["课程", "路线", "项目"],
    Icon: GraduationCap,
  },
  {
    id: "github",
    group: "学习与工具",
    label: "GitHub 绑定（演示）",
    href: "/learn/github",
    keywords: ["仓库", "git"],
    Icon: Zap,
  },
  {
    id: "tools",
    group: "学习与工具",
    label: "工具与商城",
    href: "/tools",
    keywords: ["导航", "评分", "模板"],
    Icon: Wrench,
  },
  {
    id: "settings",
    group: "系统",
    label: "设置",
    href: "/settings",
    keywords: ["主题", "退出", "偏好"],
    Icon: Settings,
  },
];
