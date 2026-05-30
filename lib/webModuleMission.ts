import { stripLocalePrefix } from "@/lib/localePath";

export type MissionKey =
  | "home"
  | "match"
  | "tools"
  | "models"
  | "learn"
  | "messages"
  | "search"
  | "workspace"
  | "publish"
  | "me";

export type RailMissionKey =
  | "hotList"
  | "quickActions"
  | "todayMission"
  | "learnProgress"
  | "matchTips"
  | "roleDistribution"
  | "recentPaths"
  | "explore";

const PATH_TO_MISSION: Record<string, MissionKey> = {
  "/home": "home",
  "/match": "match",
  "/tools": "tools",
  "/models": "models",
  "/learn": "learn",
  "/messages": "messages",
  "/search": "search",
  "/workspace": "workspace",
  "/publish": "publish",
  "/me": "me",
};

export function missionKeyForPath(pathname: string): MissionKey | null {
  const p = stripLocalePrefix(pathname.split("?")[0] || "/home");
  if (PATH_TO_MISSION[p]) return PATH_TO_MISSION[p]!;
  if (p.startsWith("/tools") || p.startsWith("/market")) return "tools";
  if (p.startsWith("/models")) return "models";
  if (p.startsWith("/learn")) return "learn";
  if (p.startsWith("/messages")) return "messages";
  if (p.startsWith("/search")) return "search";
  if (p.startsWith("/workspace")) return "workspace";
  if (p.startsWith("/publish")) return "publish";
  if (p.startsWith("/match")) return "match";
  if (p.startsWith("/home")) return "home";
  if (p.startsWith("/me")) return "me";
  return null;
}

/** @deprecated Use missionKeyForPath + useTranslations('missions') */
export function missionForPath(pathname: string): { tagline: string; purpose: string } | null {
  const key = missionKeyForPath(pathname);
  if (!key) return null;
  return { tagline: key, purpose: key };
}

export const RAIL_MISSION_KEYS = {
  hotList: "hotList",
  quickActions: "quickActions",
  todayMission: "todayMission",
  learnProgress: "learnProgress",
  matchTips: "matchTips",
  roleDistribution: "roleDistribution",
  recentPaths: "recentPaths",
  explore: "explore",
} as const satisfies Record<RailMissionKey, RailMissionKey>;
