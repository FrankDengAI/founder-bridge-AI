import { stripLocalePrefix } from "@/lib/localePath";

/** 各模块的服务中心思想 —— 设计每一块的「为什么存在」 */
export type WebModuleMission = {
  /** 一句话宗旨，出现在 TopBar / 页头 */
  tagline: string;
  /** 稍长的人性化说明 */
  purpose: string;
};

const MISSIONS: Record<string, WebModuleMission> = {
  "/home": {
    tagline: "先留下来，再遇见对的人",
    purpose:
      "笔记、工具与讨论是冷启动期的主战场——你的每一次浏览与表达，都在帮匹配引擎读懂你。",
  },
  "/match": {
    tagline: "30 秒找到能开工的伙伴",
    purpose:
      "七维可解释加权：角色互补、技能重叠、方向一致——「为什么是他」看得见，聊完就能动手。",
  },
  "/tools": {
    tagline: "选对工具，少踩坑",
    purpose:
      "真实评分 + 场景分类，帮你在 Vibe Coding 全流程里快速找到趁手的 AI 与生产力工具。",
  },
  "/models": {
    tagline: "社区共建的真实体验榜",
    purpose:
      "官方评测看通用能力；这里记录编程、写作、性价比下的真实体感，帮你在创业路上选模型、聊观点、做决策。",
  },
  "/learn": {
    tagline: "17 步从 0 到上线",
    purpose:
      "结构化学习路线降低入门焦虑——每完成一步，你就离「能独立 ship 产品」更近一点。",
  },
  "/messages": {
    tagline: "匹配之后，一句话开工",
    purpose:
      "私聊是协作的起点：来自匹配的会话带标签，减少破冰成本，让对话直接落到项目上。",
  },
  "/search": {
    tagline: "用关键词打捞灵感",
    purpose:
      "标题检索 + 类型筛选，帮你在海量笔记里快速找到可复用的方案与可聊的同路人。",
  },
  "/workspace": {
    tagline: "你的创业指挥台",
    purpose:
      "数据总览、收藏与学习进度一屏尽览——把分散在各 Tab 的信号，收成可行动的仪表盘。",
  },
  "/publish": {
    tagline: "表达即信号",
    purpose:
      "每一篇笔记、每一条短评，都是喂给社区与匹配引擎的公开画像——先被看见，再被匹配。",
  },
  "/me": {
    tagline: "你的公开名片",
    purpose:
      "角色、技能与方向集中展示——让别人在 10 秒内判断「要不要和你聊」。",
  },
};

export function missionForPath(pathname: string): WebModuleMission | null {
  const p = stripLocalePrefix(pathname.split("?")[0] || "/home");
  if (MISSIONS[p]) return MISSIONS[p]!;
  if (p.startsWith("/tools") || p.startsWith("/market")) return MISSIONS["/tools"]!;
  if (p.startsWith("/models")) return MISSIONS["/models"]!;
  if (p.startsWith("/learn")) return MISSIONS["/learn"]!;
  if (p.startsWith("/messages")) return MISSIONS["/messages"]!;
  if (p.startsWith("/search")) return MISSIONS["/search"]!;
  if (p.startsWith("/workspace")) return MISSIONS["/workspace"]!;
  if (p.startsWith("/publish")) return MISSIONS["/publish"]!;
  if (p.startsWith("/match")) return MISSIONS["/match"]!;
  if (p.startsWith("/home")) return MISSIONS["/home"]!;
  if (p.startsWith("/me")) return MISSIONS["/me"]!;
  return null;
}

/** 右栏 Widget 的模块宗旨 */
export const RAIL_MISSIONS = {
  hotList: {
    title: "社区热榜",
    purpose: "此刻大家在讨论什么——跟上热度，更容易找到共鸣与协作契机。",
  },
  quickActions: {
    title: "快捷入口",
    purpose: "高频动作一键直达，减少在 Tab 间来回找的心智负担。",
  },
  todayMission: {
    title: "今日任务",
    purpose: "小目标驱动留存：完成一条，就离「真正在用这个平台创业」更近。",
  },
  learnProgress: {
    title: "学习进度",
    purpose: "可视化成长路径，让「我在进步」这件事看得见、摸得着。",
  },
  matchTips: {
    title: "匹配小贴士",
    purpose: "补全资料与选对角色，能显著提高互补匹配的通过率。",
  },
  roleDistribution: {
    title: "社区角色分布",
    purpose: "了解供需结构，帮你判断该补位还是找互补。",
  },
  recentPaths: {
    title: "最近浏览",
    purpose: "断点续看——创业探索往往被打断，这条帮你接上次的思路。",
  },
  explore: {
    title: "探索",
    purpose: "迷路时回到发现页，重新从社区信号里找灵感。",
  },
} as const;
