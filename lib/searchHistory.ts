const KEY = "vibe_search_history_v1";
const MAX = 12;

export function readSearchHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function rememberSearchQuery(q: string) {
  const t = q.trim();
  if (!t || typeof window === "undefined") return;
  const prev = readSearchHistory().filter((x) => x.toLowerCase() !== t.toLowerCase());
  const next = [t, ...prev].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(next));
}
