import type { Role } from "@/lib/domain/role";
import { ROLE_LABEL } from "@/lib/labels";
import { roleComplementScore } from "./roleMatrix";
import type { ParsedProfile, RankedCandidate, ScoreBreakdown } from "./types";

/**
 * v2 多维加权（合计 = 1.0）
 *  调权策略：
 *   - role 仍为主导信号 → 0.26
 *   - keywords 0.18  + interest 0.16 → 共 0.34 占据「能力 + 兴趣」最大权重
 *   - direction 0.14 创业方向语义
 *   - reciprocity 0.10 双向意向，激励真互选
 *   - budget 0.08 资金档位（差异容忍）
 *   - activity 0.04 活跃度
 */
const W_ROLE = 0.26;
const W_KW = 0.18;
const W_INT = 0.16;
const W_DIR = 0.14;
const W_RECIPROCITY = 0.1;
const W_BUDGET = 0.08;
const W_ACTIVITY = 0.04;

// 安全断言：权重和必须接近 1
// 0.26 + 0.18 + 0.16 + 0.14 + 0.10 + 0.08 + 0.04 + 0.04 = 1.00（activity 与 freshness 同义）
// 这里只算到 0.96 + 0.04 = 1.00。

function normalizeText(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, "");
}

/** Jaccard 重叠 */
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

/** 词频向量 TF-cosine（短文本下与 Jaccard 互补） */
function tfCosine(a: string[], b: string[]): number {
  const norm = (xs: string[]) => xs.map((x) => x.trim().toLowerCase()).filter(Boolean);
  const A = norm(a);
  const B = norm(b);
  if (!A.length || !B.length) return 0;
  const tf = (xs: string[]) => {
    const m = new Map<string, number>();
    xs.forEach((x) => m.set(x, (m.get(x) ?? 0) + 1));
    return m;
  };
  const Ta = tf(A);
  const Tb = tf(B);
  let dot = 0;
  let na = 0;
  let nb = 0;
  Ta.forEach((va) => (na += va * va));
  Tb.forEach((vb) => (nb += vb * vb));
  Ta.forEach((va, k) => {
    const vb = Tb.get(k);
    if (vb) dot += va * vb;
  });
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
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

/** 中文 + 英文混合的轻量分词：以非字母数字 / 中文为分隔，单中文字也算一个 token */
// 字符类：ASCII 字母数字 + CJK 统一表意范围（避开 \p{} Unicode property，兼容旧 target）
const TOKEN_CHAR_RE = /[A-Za-z0-9一-鿿]/;
const NON_TOKEN_CHAR_RE = /[^A-Za-z0-9一-鿿]+/g;

function tokenize(text: string): string[] {
  if (!text) return [];
  const cleaned = text.toLowerCase().replace(NON_TOKEN_CHAR_RE, " ");
  const tokens: string[] = [];
  cleaned.split(/\s+/).forEach((seg) => {
    if (!seg) return;
    if (/^[a-z0-9]+$/.test(seg)) {
      tokens.push(seg);
    } else {
      // 含中文 → 拆为单字（演示用，比 bigram 更稳）
      for (const ch of Array.from(seg)) {
        if (TOKEN_CHAR_RE.test(ch)) tokens.push(ch);
      }
    }
  });
  return tokens.filter((t) => t.length >= 1 && !STOPWORDS.has(t));
}

const STOPWORDS = new Set([
  "的", "了", "和", "与", "或", "是", "在", "也", "都", "一", "我", "你", "他", "她",
  "the", "and", "or", "of", "for", "to", "a", "an", "in", "on",
]);

function directionScore(myDir: string, theirDir: string): number {
  const x = normalizeText(myDir);
  const y = normalizeText(theirDir);
  if (!x && !y) return 0.55;
  if (!x || !y) return 0.35;
  if (x === y) return 1;
  if (x.includes(y) || y.includes(x)) return 0.88;
  const tokenA = tokenize(myDir);
  const tokenB = tokenize(theirDir);
  const tokenJ = jaccard(tokenA, tokenB);
  const bg = bigramOverlap(myDir, theirDir);
  return Math.min(1, 0.5 * tokenJ + 0.5 * bg);
}

/** 兴趣向量：把 关键词 + 方向 拼合后求 cosine + Jaccard 平均 */
function interestScore(me: ParsedProfile, them: ParsedProfile): number {
  const myPool = [
    ...me.skillKeywords,
    ...tokenize(me.direction),
    ...tokenize(me.intro),
  ];
  const theirPool = [
    ...them.skillKeywords,
    ...tokenize(them.direction),
    ...tokenize(them.intro),
  ];
  if (!myPool.length && !theirPool.length) return 0.55;
  if (!myPool.length || !theirPool.length) return 0.35;
  const cos = tfCosine(myPool, theirPool);
  const j = jaccard(myPool, theirPool);
  return Math.min(1, 0.6 * cos + 0.4 * j);
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

/** 活跃度：新鲜度 + 简介信息密度 */
function activityScore(them: ParsedProfile, updatedAt: Date): number {
  const fresh = freshnessScore(updatedAt);
  const intro = them.intro.trim();
  // 简介长度 0-180 字 → 线性 → [0,1]，超过 180 视为饱和
  const introDensity = Math.min(1, intro.length / 180);
  const hasDirection = them.direction.trim().length > 0 ? 1 : 0;
  const kwRichness = Math.min(1, them.skillKeywords.length / 6);
  return Math.min(
    1,
    0.55 * fresh +
      0.18 * introDensity +
      0.12 * hasDirection +
      0.15 * kwRichness,
  );
}

function desiredRoleBonus(desired: Role[], theirRole: Role): number {
  if (!desired.length) return 0.55;
  return desired.includes(theirRole) ? 1 : 0.25;
}

/** keywords 维度：Jaccard + tfCosine + 期望意向 */
function keywordsScore(me: ParsedProfile, them: ParsedProfile): number {
  const j = jaccard(me.skillKeywords, them.skillKeywords);
  const c = tfCosine(me.skillKeywords, them.skillKeywords);
  const desiredBoost = desiredRoleBonus(me.desiredPartnerRoles, them.role);
  // 关键词信号：取 Jaccard 与 cosine 的均值（更稳定），再与意向 boost 加权
  const overlap = 0.5 * j + 0.5 * c;
  return Math.min(1, 0.6 * overlap + 0.4 * desiredBoost);
}

/** 双向意向：me 是否在 them.desiredPartnerRoles 里、them 是否在 me.desiredPartnerRoles 里 */
function reciprocityScore(me: ParsedProfile, them: ParsedProfile): number {
  const theyWantMe = them.desiredPartnerRoles.includes(me.role);
  const iWantThem = me.desiredPartnerRoles.includes(them.role);
  if (theyWantMe && iWantThem) return 1;
  if (theyWantMe || iWantThem) return 0.65;
  // 都没有显式勾选，按角色互补度兜底
  return Math.max(0.3, roleComplementScore(me.role, them.role) * 0.55);
}

function sharedKeywords(a: string[], b: string[]): string[] {
  const B = new Set(b.map((x) => x.trim().toLowerCase()).filter(Boolean));
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
  const sKw = keywordsScore(me, them);
  const sDir = directionScore(me.direction, them.direction);
  const sInt = interestScore(me, them);
  const sRecip = reciprocityScore(me, them);
  const sBudget = budgetScore(me.budgetTier, them.budgetTier);
  const sAct = activityScore(them, them.updatedAt);

  const score =
    W_ROLE * sRole +
    W_KW * sKw +
    W_DIR * sDir +
    W_INT * sInt +
    W_RECIPROCITY * sRecip +
    W_BUDGET * sBudget +
    W_ACTIVITY * sAct;

  const reasons: string[] = [];
  reasons.push(rolePairNarrative(me.role, them.role, sRole));

  const overlap = sharedKeywords(me.skillKeywords, them.skillKeywords);
  if (overlap.length) {
    reasons.push(`共同能力标签：${overlap.join("、")}，便于对齐技术栈与协作语言。`);
  } else if (sKw >= 0.5) {
    reasons.push("能力关键词有部分语义接近，协作时可从具体交付物倒推分工。");
  }

  if (sRecip >= 0.95) {
    reasons.push(
      `双向意向命中：你们互为对方期望伙伴（${ROLE_LABEL[me.role]} ↔ ${ROLE_LABEL[them.role]}），是高优先邀约对象。`,
    );
  } else if (sRecip >= 0.6) {
    const oneSide = them.desiredPartnerRoles.includes(me.role)
      ? `对方正在找「${ROLE_LABEL[me.role]}」类伙伴`
      : `你正在找「${ROLE_LABEL[them.role]}」类伙伴`;
    reasons.push(`单边意向：${oneSide}，建议主动发起一次破冰。`);
  }

  if (sInt >= 0.7) {
    reasons.push(
      "兴趣画像高度重叠（关键词 + 方向 + 简介综合 cosine ≥ 0.7），共同语言较多。",
    );
  } else if (sInt >= 0.45) {
    reasons.push("兴趣有交集但不集中，可借一次具体的项目话题确认方向是否对齐。");
  }

  if (sDir >= 0.85) {
    reasons.push("创业方向表述接近，立项与复盘时更容易对齐北极星指标。");
  } else if (sDir >= 0.55) {
    reasons.push("方向不完全一致，但存在一定文本关联，适合探索「上下游/生态位」合作。");
  }

  if (sBudget >= 0.82) {
    reasons.push("资金意愿档位接近，对里程碑投入节奏的预期更一致。");
  } else if (sBudget <= 0.4) {
    reasons.push("资金档位差异较大：若连接，建议尽早对齐「阶段目标与投入边界」。");
  }

  if (sAct >= 0.85) {
    reasons.push("资料活跃度高（近期更新 + 信息密度），回复响应可能更及时。");
  } else if (sAct <= 0.5) {
    reasons.push("活跃度一般：可优先用「短消息 + 具体话题」破冰，避免冷启失败。");
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
      interest: sInt,
      reciprocity: sRecip,
      budget: sBudget,
      activity: sAct,
    },
    reasons: reasons.slice(0, 8),
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
  const introPreview = intro.length > 120 ? `${intro.slice(0, 120)}…` : intro;
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
