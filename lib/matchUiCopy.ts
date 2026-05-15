import type { ScoreBreakdown } from "@/lib/matching/types";

/** 匹配页：一键添加的能力关键词建议 */
export const MATCH_KEYWORD_SUGGESTIONS = [
  "Next.js",
  "React",
  "产品设计",
  "增长黑客",
  "小红书运营",
  "出海",
  "LLM 应用",
  "PRD",
  "融资路演",
  "设计系统",
  "数据分析",
  "社群运营",
] as const;

/** 匹配页：创业方向快捷选项 */
export const MATCH_DIRECTION_PRESETS = [
  "AI 编程教育",
  "出海 SaaS",
  "开发者工具",
  "本地生活服务",
  "内容社区",
  "电商品牌",
  "企业数字化",
  "硬件 + 软件",
] as const;

export const MATCH_BREAKDOWN_LABELS = {
  role: { title: "角色互补", hint: "打野/辅助/射手在创业分工中的协同度" },
  keywords: { title: "能力与意向", hint: "关键词交集 + 是否符合你期望的伙伴类型" },
  direction: { title: "方向契合", hint: "创业方向文本相似度" },
  budget: { title: "资金档位", hint: "投入意愿是否接近" },
  freshness: { title: "资料新鲜度", hint: "对方画像最近是否更新" },
} as const satisfies Record<
  keyof ScoreBreakdown,
  { title: string; hint: string }
>;
