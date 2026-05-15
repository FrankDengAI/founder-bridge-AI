import type { Role } from "@/lib/domain/role";
import { ROLE_LABEL } from "@/lib/labels";
import { roleComplementScore } from "./roleMatrix";
import type { ParsedProfile, RankedCandidate, ScoreBreakdown } from "./types";

const W_ROLE = 0.35;
const W_KW = 0.25;
const W_DIR = 0.2;
const W_BUDGET = 0.15;
const W_FRESH = 0.05;

function normalizeText(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, "");
}

function jaccard(a: string[], b: string[]): number {
  const A = new Set(a.map((x) => x.trim().toLowerCase()).filter(Boolean));
  const B = new Set(b.map((x) => x.trim().toLowerCase()).filter(Boolean));
  if (A.size === 0 && B.size === 0) return 0.5;
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  A.forEach((x) => {
    if (B.has(x)) inter += 1;
  });
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

function bigramOverlap(a: string, b: string): number {
  const A = normalizeText(a);
  const B = normalizeText(b);
  if (A.length < 2 || B.length < 2) return 0;
  const bags = (s: string) => {
    const m = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const g = s.slice(i, i + 2);
      m.set(g, (m.get(g) ?? 0) + 1);
    }
    return m;
  };
  const Ma = bags(A);
  const Mb = bags(B);
  let inter = 0;
  let union = 0;
  const keys = new Set([
    ...Array.from(Ma.keys()),
    ...Array.from(Mb.keys()),
  ]);
  keys.forEach((k) => {
    const ca = Ma.get(k) ?? 0;
    const cb = Mb.get(k) ?? 0;
    inter += Math.min(ca, cb);
    union += Math.max(ca, cb);
  });
  return union === 0 ? 0 : inter / union;
}

function directionScore(myDir: string, theirDir: string): number {
  const x = normalizeText(myDir);
  const y = normalizeText(theirDir);
  if (!x && !y) return 0.55;
  if (!x || !y) return 0.35;
  if (x === y) return 1;
  if (x.includes(y) || y.includes(x)) return 0.88;
  return bigramOverlap(myDir, theirDir);
}

function budgetScore(a: number, b: number): number {
  const d = Math.abs(a - b);
  if (d === 0) return 1;
  if (d === 1) return 0.82;
  if (d === 2) return 0.58;
  if (d === 3) return 0.35;
  return 0.15;
}

function freshnessScore(updatedAt: Date): number {
  const days = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
  if (days <= 7) return 1;
  if (days <= 30) return 0.85;
  if (days <= 90) return 0.65;
  return 0.45;
}

function desiredRoleBonus(
  desired: Role[],
  theirRole: Role,
): number {
  if (!desired.length) return 0.55;
  return desired.includes(theirRole) ? 1 : 0.25;
}

function sharedKeywords(a: string[], b: string[]): string[] {
  const B = new Set(
    b.map((x) => x.trim().toLowerCase()).filter(Boolean),
  );
  const out: string[] = [];
  for (const k of a) {
    const n = k.trim().toLowerCase();
    if (n && B.has(n)) out.push(k.trim());
  }
  return Array.from(new Set(out)).slice(0, 4);
}

function rolePairNarrative(myRole: Role, theirRole: Role, sRole: number): string {
  if (sRole >= 0.9) {
    return `你与 TA 的「${ROLE_LABEL[myRole]} × ${ROLE_LABEL[theirRole]}」组合互补度很高，适合一起推进从 0 到 1。`;
  }
  if (sRole >= 0.72) {
    return `「${ROLE_LABEL[myRole]}」与「${ROLE_LABEL[theirRole]}」在协作上较协调，可优先尝试轻量共创。`;
  }
  return `角色组合为「${ROLE_LABEL[myRole]} × ${ROLE_LABEL[theirRole]}」——若方向契合，仍值得一次深度沟通。`;
}

export function scorePair(
  me: ParsedProfile,
  them: ParsedProfile & { updatedAt: Date },
): { score: number; breakdown: ScoreBreakdown; reasons: string[] } {
  const sRole = roleComplementScore(me.role, them.role);
  const kwBase = jaccard(me.skillKeywords, them.skillKeywords);
  const desiredBoost = desiredRoleBonus(me.desiredPartnerRoles, them.role);
  const sKw = Math.min(1, 0.55 * kwBase + 0.45 * desiredBoost);
  const sDir = directionScore(me.direction, them.direction);
  const sBudget = budgetScore(me.budgetTier, them.budgetTier);
  const sFresh = freshnessScore(them.updatedAt);

  const score =
    W_ROLE * sRole +
    W_KW * sKw +
    W_DIR * sDir +
    W_BUDGET * sBudget +
    W_FRESH * sFresh;

  const reasons: string[] = [];
  reasons.push(rolePairNarrative(me.role, them.role, sRole));

  const overlap = sharedKeywords(me.skillKeywords, them.skillKeywords);
  if (overlap.length) {
    reasons.push(`共同能力标签：${overlap.join("、")}，便于对齐技术栈与协作语言。`);
  } else if (kwBase >= 0.35) {
    reasons.push("能力关键词有部分语义接近，协作时可从具体交付物倒推分工。");
  }

  if (desiredBoost >= 0.95) {
    reasons.push(`符合你勾选的期望伙伴类型（${ROLE_LABEL[them.role]}）。`);
  }

  if (them.desiredPartnerRoles.includes(me.role)) {
    reasons.push(
      `双向意向：对方也在寻找「${ROLE_LABEL[me.role]}」类伙伴，与你当前定位一致。`,
    );
  }

  if (sDir >= 0.85) {
    reasons.push("创业方向表述接近，立项与复盘时更容易对齐北极星指标。");
  } else if (sDir >= 0.55 && sDir < 0.85) {
    reasons.push("方向不完全一致，但存在一定文本关联，适合探索「上下游/生态位」合作。");
  }

  if (sBudget >= 0.82) {
    reasons.push("资金意愿档位接近，对里程碑投入节奏的预期更一致。");
  } else if (sBudget <= 0.4) {
    reasons.push("资金档位差异较大：若连接，建议尽早对齐「阶段目标与投入边界」。");
  }

  if (sFresh >= 0.85) {
    reasons.push("对方资料近期有更新，活跃意愿相对较高。");
  }

  if (reasons.length < 4) {
    reasons.push(
      "可把总分当作「冷启动排序」：优先邀约高分对象，中分适合做一次话题探测再决定是否深聊。",
    );
  }

  return {
    score,
    breakdown: {
      role: sRole,
      keywords: sKw,
      direction: sDir,
      budget: sBudget,
      freshness: sFresh,
    },
    reasons: reasons.slice(0, 7),
  };
}

export function toRanked(
  themUserId: string,
  displayName: string,
  avatarUrl: string | null,
  them: ParsedProfile & { updatedAt: Date },
  me: ParsedProfile,
): RankedCandidate {
  const { score, breakdown, reasons } = scorePair(me, them);
  const intro = them.intro.trim();
  const introPreview =
    intro.length > 120 ? `${intro.slice(0, 120)}…` : intro;
  return {
    userId: themUserId,
    displayName,
    avatarUrl,
    role: them.role,
    score,
    breakdown,
    reasons,
    introPreview,
    direction: them.direction.trim(),
  };
}
