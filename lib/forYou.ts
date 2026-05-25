import type { Post, UserProfile } from "@prisma/client";

function parseJsonArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** 时间衰减因子：半衰期约 7 天，越新权重越高 */
function timeDecay(createdAt: Date): number {
  const ageHours = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
  return 1 / (1 + ageHours / 168);
}

/** 热度加成：likes + saves 对数压缩，防止头部内容垄断 */
function popularityBoost(likes: number, saves: number): number {
  return Math.log1p(likes + saves * 2) / 10;
}

/** 基于画像标签、技能关键词、时间衰减与热度的规则打分 */
export function scorePostForProfile(
  post: Pick<Post, "title" | "tags" | "excerpt" | "likes" | "saves" | "createdAt">,
  profile: Pick<UserProfile, "interestTags" | "skillKeywords"> | null,
): number {
  const tags = parseJsonArray(post.tags);
  const hay = `${post.title}\n${post.excerpt}`.toLowerCase();
  const decay = timeDecay(post.createdAt);
  const boost = popularityBoost(post.likes, post.saves);

  // 无画像时：新用户冷启动，按时间+热度兜底，确保有内容可看
  if (!profile) return (decay + boost) * 2;

  const interests = parseJsonArray(profile.interestTags);
  const skills = parseJsonArray(profile.skillKeywords);

  let relevance = 0;
  for (const t of interests) {
    if (!t) continue;
    if (tags.some((x) => x.includes(t) || t.includes(x))) relevance += 3;
    if (hay.includes(t.toLowerCase())) relevance += 2;
  }
  for (const s of skills) {
    if (!s) continue;
    if (hay.includes(s.toLowerCase())) relevance += 2;
  }

  return relevance * decay + boost;
}
