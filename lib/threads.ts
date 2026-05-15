export type Thread = {
  peerId: string;
  peerName: string;
  lastMessage: string;
  updatedAt: number;
  /** 从匹配页「发起沟通」创建 */
  source?: "match";
};

const KEY = "vibe_threads";

export function loadThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v
      .map((x) => x as Partial<Thread>)
      .filter(
        (x) =>
          typeof x.peerId === "string" &&
          typeof x.peerName === "string" &&
          typeof x.lastMessage === "string" &&
          typeof x.updatedAt === "number",
      )
      .map((x) => ({
        peerId: x.peerId as string,
        peerName: x.peerName as string,
        lastMessage: x.lastMessage as string,
        updatedAt: x.updatedAt as number,
        source: x.source === "match" ? ("match" as const) : undefined,
      }));
  } catch {
    return [];
  }
}

export function upsertThread(t: Thread) {
  if (typeof window === "undefined") return;
  const prev = loadThreads();
  const prevRow = prev.find((x) => x.peerId === t.peerId);
  const merged: Thread = {
    ...t,
    source: t.source ?? prevRow?.source,
  };
  const others = prev.filter((x) => x.peerId !== t.peerId);
  const next = [merged, ...others].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(next));
}
