/** Lightweight profanity filter — core zh/en terms. Extend as needed. */

const BLOCKLIST = [
  // Chinese — vulgar / insults (sample core set)
  "傻逼",
  "傻b",
  "sb",
  "草泥马",
  "操你",
  "妈的",
  "他妈",
  "去死",
  "滚蛋",
  "废物",
  "贱人",
  "婊子",
  "狗屎",
  "混蛋",
  "王八蛋",
  "脑残",
  "智障",
  "nmsl",
  "cnm",
  "tmd",
  "wqnmlgb",
  // Gambling / drugs (Chinese)
  "赌博",
  "博彩",
  "六合彩",
  "冰毒",
  "海洛因",
  "大麻",
  "贩毒",
  "吸毒",
  // Porn (Chinese hints)
  "色情",
  "裸聊",
  "约炮",
  "嫖娼",
  // English
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "damn you",
  "cunt",
  "nigger",
  "nigga",
  "faggot",
  "retard",
  "whore",
  "slut",
  "porn",
  "hentai",
  "cocaine",
  "heroin",
  "meth",
  "gambling",
] as const;

const NORMALIZED = BLOCKLIST.map((w) => w.toLowerCase());

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9\u4e00-\u9fff]/g, "");
}

export type ProfanityCheck = {
  blocked: boolean;
  matches: string[];
};

export function checkProfanity(text: string): ProfanityCheck {
  if (!text.trim()) return { blocked: false, matches: [] };
  const norm = normalize(text);
  const rawLower = text.toLowerCase();
  const matches: string[] = [];

  for (let i = 0; i < BLOCKLIST.length; i++) {
    const word = BLOCKLIST[i]!;
    const nw = NORMALIZED[i]!;
    if (norm.includes(nw) || rawLower.includes(word.toLowerCase())) {
      matches.push(word);
    }
  }

  return { blocked: matches.length > 0, matches };
}

export function assertNoProfanity(text: string): void {
  const { blocked, matches } = checkProfanity(text);
  if (blocked) {
    const err = new Error("profanity");
    (err as Error & { code: string; matches: string[] }).code = "profanity";
    (err as Error & { matches: string[] }).matches = matches;
    throw err;
  }
}

export function profanityResponse() {
  return {
    error: "profanity",
    message: "Content contains prohibited words. Please revise.",
  };
}
