import type { Post, UserProfile } from "@prisma/client";

function parseJsonArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** 基于画像标签与技能关键词的规则打分（演示用，非 ML） */
export function scorePostForProfile(
  post: Pick<Post, "title" | "tags" | "excerpt">,
  profile: Pick<UserProfile, "interestTags" | "skillKeywords"> | null,
): number {
  if (!profile) return 0;
  const interests = parseJsonArray(profile.interestTags);
  const skills = parseJsonArray(profile.skillKeywords);
  const tags = parseJsonArray(post.tags);
  const hay = `${post.title}\n${post.excerpt}`.toLowerCase();

  let score = 0;
  for (const t of interests) {
    if (!t) continue;
    if (tags.some((x) => x.includes(t) || t.includes(x))) score += 3;
    if (hay.includes(t.toLowerCase())) score += 2;
  }
  for (const s of skills) {
    if (!s) continue;
    if (hay.includes(s.toLowerCase())) score += 2;
  }
  return score;
}
