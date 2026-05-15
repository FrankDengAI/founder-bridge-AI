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

export type ScoreBreakdown = {
  role: number;
  keywords: number;
  direction: number;
  budget: number;
  freshness: number;
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
