/** 命令面板 / 最近访问（localStorage） */

export const LS_RECENT_ROUTES = "vibe_recent_routes";
export const LS_SAVED_POSTS = "vibe_saved_post_ids";
export const LS_LEARN_STEPS = "vibe_learn_steps_done";

const MAX_RECENT = 10;

export function recordRouteVisit(pathname: string) {
  if (typeof window === "undefined") return;
  if (!pathname || pathname.startsWith("/api")) return;
  const skip = ["/_next", "/favicon"].some((p) => pathname.startsWith(p));
  if (skip) return;
  try {
    const raw = localStorage.getItem(LS_RECENT_ROUTES);
    const prev = raw ? (JSON.parse(raw) as string[]) : [];
    const next = [
      pathname,
      ...prev.filter((p) => p !== pathname),
    ].slice(0, MAX_RECENT);
    localStorage.setItem(LS_RECENT_ROUTES, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function readRecentRoutes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_RECENT_ROUTES);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function readSavedPostIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_SAVED_POSTS);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function toggleSavedPost(postId: string): boolean {
  if (typeof window === "undefined") return false;
  const cur = readSavedPostIds();
  const has = cur.includes(postId);
  const next = has ? cur.filter((id) => id !== postId) : [...cur, postId];
  localStorage.setItem(LS_SAVED_POSTS, JSON.stringify(next));
  return !has;
}

export function isPostSaved(postId: string): boolean {
  return readSavedPostIds().includes(postId);
}

export function readLearnStepsDone(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(LS_LEARN_STEPS);
    const arr = raw ? (JSON.parse(raw) as number[]) : [];
    return new Set(Array.isArray(arr) ? arr.filter((n) => typeof n === "number") : []);
  } catch {
    return new Set();
  }
}

export function toggleLearnStepDone(stepIndex1Based: number): Set<number> {
  const s = readLearnStepsDone();
  if (s.has(stepIndex1Based)) s.delete(stepIndex1Based);
  else s.add(stepIndex1Based);
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_LEARN_STEPS, JSON.stringify(Array.from(s)));
  }
  return s;
}
