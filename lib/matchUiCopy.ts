import type { Role } from "@/lib/domain/role";

/** i18n keys under matchDirections.* */
export const MATCH_DIRECTION_KEYS_ADC = [
  "aiCodingEdu",
  "globalSaas",
  "devTools",
  "agentWorkflow",
  "verticalCopilot",
  "enterpriseInternal",
] as const;

export const MATCH_DIRECTION_KEYS_SUPPORT = [
  "contentCommunity",
  "aiCodingEdu",
  "localLife",
  "eduGamification",
  "contentCollab",
  "enterpriseDigital",
] as const;

export const MATCH_DIRECTION_KEYS_JUNGLE = [
  "globalSaas",
  "ecommerceBrand",
  "localLife",
  "hardwareSoftware",
  "channelDistribution",
  "brandColdStart",
] as const;

export const MATCH_DIRECTION_KEYS_BY_ROLE: Record<
  Role,
  readonly string[]
> = {
  ADC: MATCH_DIRECTION_KEYS_ADC,
  SUPPORT: MATCH_DIRECTION_KEYS_SUPPORT,
  JUNGLE: MATCH_DIRECTION_KEYS_JUNGLE,
};

/** i18n keys under matchKeywords.* */
export const MATCH_KEYWORD_KEYS_ADC = [
  "nextjs",
  "react",
  "typescript",
  "fullstack",
  "python",
  "rust",
  "llmApp",
  "agentEng",
  "rag",
  "designSystem",
  "appStore",
  "payments",
] as const;

export const MATCH_KEYWORD_KEYS_SUPPORT = [
  "prd",
  "userResearch",
  "competitive",
  "abTest",
  "productDesign",
  "growthHacking",
  "communityOps",
  "contentCreation",
  "shortVideo",
  "xiaohongshu",
  "dataAnalysis",
  "fundraising",
] as const;

export const MATCH_KEYWORD_KEYS_JUNGLE = [
  "globalExpansion",
  "bd",
  "channelPartnership",
  "privateTraffic",
  "shortVideoAds",
  "brandCollab",
  "supplyChain",
  "fundingIntro",
  "govResources",
  "offlineEvents",
  "ecommerceOps",
  "kolPartnership",
] as const;

export const MATCH_KEYWORD_KEYS_BY_ROLE: Record<Role, readonly string[]> = {
  ADC: MATCH_KEYWORD_KEYS_ADC,
  SUPPORT: MATCH_KEYWORD_KEYS_SUPPORT,
  JUNGLE: MATCH_KEYWORD_KEYS_JUNGLE,
};

export function getDirectionKeys(role: Role): readonly string[] {
  return MATCH_DIRECTION_KEYS_BY_ROLE[role];
}

export function getKeywordKeys(role: Role): readonly string[] {
  return MATCH_KEYWORD_KEYS_BY_ROLE[role];
}

export const MATCH_INTENT_CHOSEN_KEY = "vibe_match_intent_chosen";

export function readMatchIntentChosen(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MATCH_INTENT_CHOSEN_KEY) === "1";
}

export function writeMatchIntentChosen(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MATCH_INTENT_CHOSEN_KEY, "1");
}

export function clearMatchIntentChosen(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(MATCH_INTENT_CHOSEN_KEY);
}

export const MATCH_ANIM_MODE_KEY = "vibe_match_anim_mode";
export type MatchAnimMode = "fast" | "normal" | "ritual";

export function readMatchAnimMode(): MatchAnimMode {
  if (typeof window === "undefined") return "fast";
  const v = localStorage.getItem(MATCH_ANIM_MODE_KEY);
  if (v === "normal" || v === "ritual" || v === "fast") return v;
  const first = localStorage.getItem("vibe_match_anim_first_done");
  return first ? "normal" : "fast";
}

export function writeMatchAnimMode(mode: MatchAnimMode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MATCH_ANIM_MODE_KEY, mode);
  if (mode !== "fast") {
    localStorage.setItem("vibe_match_anim_first_done", "1");
  }
}

export function matchAnimDurationMs(mode: MatchAnimMode): number {
  if (mode === "fast") return 3_000;
  if (mode === "normal") return 8_000;
  return 30_000;
}

export type MatchIntent = "PARTNER" | "RECRUIT";

export const MATCH_BREAKDOWN_LABEL_KEYS = {
  role: { title: "roleTitle", hint: "roleHint" },
  keywords: { title: "keywordsTitle", hint: "keywordsHint" },
  direction: { title: "directionTitle", hint: "directionHint" },
  interest: { title: "interestTitle", hint: "interestHint" },
  reciprocity: { title: "reciprocityTitle", hint: "reciprocityHint" },
  budget: { title: "budgetTitle", hint: "budgetHint" },
  activity: { title: "activityTitle", hint: "activityHint" },
} as const;

/** @deprecated use getKeywordKeys + i18n */
export function getKeywordSuggestions(role: Role): readonly string[] {
  return MATCH_KEYWORD_KEYS_BY_ROLE[role];
}

/** @deprecated use getDirectionKeys + i18n */
export function getDirectionPresets(role: Role): readonly string[] {
  return MATCH_DIRECTION_KEYS_BY_ROLE[role];
}
