import type { ParsedProfile, RankedCandidate } from "./types";
import { toRanked } from "./score";

export type CandidateInput = ParsedProfile & {
  updatedAt: Date;
  displayName: string;
  avatarUrl: string | null;
};

export function rankCandidates(
  me: ParsedProfile,
  pool: CandidateInput[],
  limit = 10,
): RankedCandidate[] {
  const scored = pool
    .filter((c) => c.userId !== me.userId)
    .map((c) =>
      toRanked(
        c.userId,
        c.displayName,
        c.avatarUrl,
        {
          userId: c.userId,
          role: c.role,
          budgetTier: c.budgetTier,
          intro: c.intro,
          direction: c.direction,
          skillKeywords: c.skillKeywords,
          desiredPartnerRoles: c.desiredPartnerRoles,
          updatedAt: c.updatedAt,
        },
        me,
      ),
    );
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}
