export type Locale = "zh" | "en";

const LS_LOCALE = "vibe_locale";

const DICT: Record<Locale, Record<string, string>> = {
  zh: {
    "nav.home": "发现",
    "nav.learn": "学习",
    "nav.tools": "工具",
    "nav.match": "匹配",
    "nav.me": "我的",
    "home.title": "发现",
    "match.title": "创业伙伴匹配",
    "checkin": "今日签到",
  },
  en: {
    "nav.home": "Discover",
    "nav.learn": "Learn",
    "nav.tools": "Tools",
    "nav.match": "Match",
    "nav.me": "Me",
    "home.title": "Discover",
    "match.title": "Co-founder Match",
    "checkin": "Check in",
  },
};

export function readLocale(): Locale {
  if (typeof window === "undefined") return "zh";
  const v = localStorage.getItem(LS_LOCALE);
  return v === "en" ? "en" : "zh";
}

export function writeLocale(locale: Locale) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_LOCALE, locale);
  window.dispatchEvent(new Event("vibe-locale-updated"));
}

export function t(key: string, locale?: Locale): string {
  const loc = locale ?? (typeof window !== "undefined" ? readLocale() : "zh");
  return DICT[loc][key] ?? DICT.zh[key] ?? key;
}
