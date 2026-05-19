import type { Role } from "@/lib/domain/role";

export type ParsedProfile = {
  userId: string;
  role: Role;
  budgetTier: number;
  intro: string;
  direction: string;
  skillKeywords: string[];
  desiredPartnerRoles: Role[];
};

/**
 * 匹配评分 7 维加权（v2）：
 *  - role        角色互补矩阵
 *  - keywords    技能关键词向量相似（Jaccard + TF cosine + 期望意向）
 *  - direction   创业方向语义（token Jaccard + bigram 重叠）
 *  - interest    兴趣画像（关键词 + 方向 拼合后的兴趣向量相似）
 *  - reciprocity 双向意向（互为对方期望伙伴时的奖励）
 *  - budget      资金档位接近度
 *  - activity    活跃度（资料新鲜度 + 简介信息密度）
 */
export type ScoreBreakdown = {
  role: number;
  keywords: number;
  direction: number;
  interest: number;
  reciprocity: number;
  budget: number;
  activity: number;
};

export type RankedCandidate = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: Role;
  score: number;
  breakdown: ScoreBreakdown;
  reasons: string[];
  /** 对方简介截断，用于结果卡片 */
  introPreview: string;
  /** 对方创业方向，用于结果卡片 */
  direction: string;
};
