import type { ParsedProfile } from "@/lib/matching/types";

function parseJsonArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[\s,，、/|]+/)
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  a.forEach((x) => {
    if (b.has(x)) inter++;
  });
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

export type BountyMatchUser = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
  score: number;
  skillKeywords: string[];
  intro: string;
};

export function rankUsersByKeywords(
  query: string,
  profiles: ParsedProfile[],
  users: Map<string, { displayName: string; avatarUrl: string | null }>,
  limit = 10,
): BountyMatchUser[] {
  const qTokens = tokenize(query);
  if (qTokens.size === 0) return [];

  const out: BountyMatchUser[] = [];
  for (const p of profiles) {
    const kwTokens = tokenize(p.skillKeywords.join(" "));
    const dirTokens = tokenize(p.direction);
    const introTokens = tokenize(p.intro);
    const all = new Set([
      ...Array.from(kwTokens),
      ...Array.from(dirTokens),
      ...Array.from(introTokens),
    ]);
    const score = jaccard(qTokens, all);
    const user = users.get(p.userId);
    if (!user || score <= 0) continue;
    out.push({
      userId: p.userId,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: p.role,
      score,
      skillKeywords: p.skillKeywords,
      intro: p.intro.slice(0, 120),
    });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function rankBountiesByKeywords(
  query: string,
  bounties: {
    id: string;
    title: string;
    description: string;
    keywords: string[];
    budgetLabel: string;
    authorId: string;
    createdAt: Date;
  }[],
  limit = 20,
): Array<{
  id: string;
  title: string;
  description: string;
  keywords: string[];
  budgetLabel: string;
  authorId: string;
  createdAt: Date;
  score: number;
}> {
  const qTokens = tokenize(query);
  if (qTokens.size === 0) {
    return bounties.slice(0, limit).map((b) => ({ ...b, score: 0 }));
  }

  return bounties
    .map((b) => {
      const text = [b.title, b.description, ...b.keywords, b.budgetLabel].join(" ");
      const score = jaccard(qTokens, tokenize(text));
      return { ...b, score };
    })
    .filter((b) => b.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export { parseJsonArray };
