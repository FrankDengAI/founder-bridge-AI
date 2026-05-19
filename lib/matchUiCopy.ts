import type { ScoreBreakdown } from "@/lib/matching/types";

/** 匹配页：一键添加的能力关键词建议（含中文与英文混合） */
export const MATCH_KEYWORD_SUGGESTIONS = [
  "Next.js",
  "React",
  "TypeScript",
  "全栈",
  "产品设计",
  "增长黑客",
  "小红书运营",
  "出海",
  "LLM 应用",
  "Agent 工程",
  "RAG",
  "PRD",
  "融资路演",
  "设计系统",
  "数据分析",
  "社群运营",
  "短视频投放",
  "私域裂变",
  "App 上架",
  "支付接入",
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
  "Agent 工作流平台",
  "教育 + 游戏化",
  "AI Copilot 垂直行业",
] as const;

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
