import type { ScoreBreakdown } from "@/lib/matching/types";

export type CachedMatchCandidate = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
  score: number;
  breakdown: ScoreBreakdown;
  reasons: string[];
  introPreview?: string;
  direction?: string;
};

export type ProfileFingerprint = {
  role: string;
  budgetTier: number;
  intro: string;
  direction: string;
  skillKeywords: string[];
  desiredPartnerRoles: string[];
  matchIntent?: string;
};

type CachePayload = {
  profileHash: string;
  candidates: CachedMatchCandidate[];
  cachedAt: number;
};

const CACHE_KEY = "vibe_match_results_v1";

export function profileHash(p: ProfileFingerprint): string {
  const payload = {
    role: p.role,
    budgetTier: p.budgetTier,
    intro: p.intro.trim(),
    direction: p.direction.trim(),
    skillKeywords: [...p.skillKeywords].sort(),
    desiredPartnerRoles: [...p.desiredPartnerRoles].sort(),
    matchIntent: p.matchIntent ?? "PARTNER",
  };
  return JSON.stringify(payload);
}

export function writeMatchResultCache(
  fp: ProfileFingerprint,
  candidates: CachedMatchCandidate[],
): void {
  if (typeof window === "undefined") return;
  const payload: CachePayload = {
    profileHash: profileHash(fp),
    candidates,
    cachedAt: Date.now(),
  };
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    /* quota */
  }
}

export function readMatchResultCache(
  fp: ProfileFingerprint,
): CachedMatchCandidate[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachePayload;
    if (parsed.profileHash !== profileHash(fp)) return null;
    return parsed.candidates;
  } catch {
    return null;
  }
}

export function clearMatchResultCache(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CACHE_KEY);
}
