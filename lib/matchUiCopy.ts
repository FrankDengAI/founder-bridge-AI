import type { Role } from "@/lib/domain/role";
import type { ScoreBreakdown } from "@/lib/matching/types";

/** 射手 · 技术交付 */
export const MATCH_KEYWORD_SUGGESTIONS_ADC = [
  "Next.js",
  "React",
  "TypeScript",
  "全栈",
  "Python",
  "Rust",
  "LLM 应用",
  "Agent 工程",
  "RAG",
  "设计系统",
  "App 上架",
  "支付接入",
] as const;

/** 辅助 · 产品/运营/内容 */
export const MATCH_KEYWORD_SUGGESTIONS_SUPPORT = [
  "PRD",
  "用户研究",
  "竞品分析",
  "AB 测试",
  "产品设计",
  "增长黑客",
  "社群运营",
  "内容创作",
  "短视频脚本",
  "小红书运营",
  "数据分析",
  "融资路演",
] as const;

/** 打野 · 增长/资源 */
export const MATCH_KEYWORD_SUGGESTIONS_JUNGLE = [
  "出海",
  "BD",
  "渠道合作",
  "私域裂变",
  "短视频投放",
  "品牌联名",
  "供应链",
  "融资对接",
  "政府资源",
  "线下活动",
  "电商运营",
  "KOL 合作",
] as const;

export const MATCH_KEYWORD_SUGGESTIONS_BY_ROLE: Record<
  Role,
  readonly string[]
> = {
  ADC: MATCH_KEYWORD_SUGGESTIONS_ADC,
  SUPPORT: MATCH_KEYWORD_SUGGESTIONS_SUPPORT,
  JUNGLE: MATCH_KEYWORD_SUGGESTIONS_JUNGLE,
};

/** @deprecated 使用 MATCH_KEYWORD_SUGGESTIONS_BY_ROLE[role] */
export const MATCH_KEYWORD_SUGGESTIONS = [
  ...MATCH_KEYWORD_SUGGESTIONS_ADC,
  ...MATCH_KEYWORD_SUGGESTIONS_SUPPORT.slice(0, 4),
] as const;

export const MATCH_DIRECTION_PRESETS_ADC = [
  "AI 编程教育",
  "出海 SaaS",
  "开发者工具",
  "Agent 工作流平台",
  "AI Copilot 垂直行业",
  "企业内部管理系统",
] as const;

export const MATCH_DIRECTION_PRESETS_SUPPORT = [
  "内容社区",
  "AI 编程教育",
  "本地生活服务",
  "教育 + 游戏化",
  "内容合作 / 访谈",
  "企业数字化",
] as const;

export const MATCH_DIRECTION_PRESETS_JUNGLE = [
  "出海 SaaS",
  "电商品牌",
  "本地生活服务",
  "硬件 + 软件",
  "渠道分销",
  "品牌冷启动",
] as const;

export const MATCH_DIRECTION_PRESETS_BY_ROLE: Record<
  Role,
  readonly string[]
> = {
  ADC: MATCH_DIRECTION_PRESETS_ADC,
  SUPPORT: MATCH_DIRECTION_PRESETS_SUPPORT,
  JUNGLE: MATCH_DIRECTION_PRESETS_JUNGLE,
};

/** @deprecated 使用 MATCH_DIRECTION_PRESETS_BY_ROLE[role] */
export const MATCH_DIRECTION_PRESETS = [
  ...MATCH_DIRECTION_PRESETS_ADC,
  "内容社区",
  "电商品牌",
] as const;

export function getKeywordSuggestions(role: Role): readonly string[] {
  return MATCH_KEYWORD_SUGGESTIONS_BY_ROLE[role];
}

export function getDirectionPresets(role: Role): readonly string[] {
  return MATCH_DIRECTION_PRESETS_BY_ROLE[role];
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

export const MATCH_BREAKDOWN_LABELS = {
  role: {
    title: "角色互补",
    hint: "打野/辅助/射手在创业分工中的协同度（演示用 MOBA 角色隐喻）",
  },
  keywords: {
    title: "能力关键词",
    hint: "Jaccard 重叠 + TF-cosine 向量 + 期望伙伴类型加成",
  },
  direction: {
    title: "方向语义",
    hint: "创业方向 token 切分 Jaccard 与字符 bigram 加权",
  },
  interest: {
    title: "兴趣画像",
    hint: "关键词 + 方向 + 简介整体兴趣向量（cosine + Jaccard）",
  },
  reciprocity: {
    title: "双向意向",
    hint: "你们是否互为对方勾选的「期望伙伴类型」",
  },
  budget: {
    title: "资金档位",
    hint: "投入意愿差几档（差 1 档 0.82 / 2 档 0.58 …）",
  },
  activity: {
    title: "活跃度",
    hint: "资料更新新鲜度 + 简介信息密度 + 方向/关键词丰富度",
  },
} as const satisfies Record<
  keyof ScoreBreakdown,
  { title: string; hint: string }
>;
