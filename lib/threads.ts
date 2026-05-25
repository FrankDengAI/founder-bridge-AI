export type Thread = {
  peerId: string;
  peerName: string;
  lastMessage: string;
  updatedAt: number;
  /** 从匹配页「发起沟通」创建 */
  source?: "match";
  contextTitle?: string;
  contextPostId?: string;
  draftMessage?: string;
  pinned?: boolean;
  label?: string;
  /** 对方有新消息未读 */
  unread?: boolean;
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
        contextTitle:
          typeof x.contextTitle === "string" ? x.contextTitle : undefined,
        contextPostId:
          typeof x.contextPostId === "string" ? x.contextPostId : undefined,
        draftMessage:
          typeof x.draftMessage === "string" ? x.draftMessage : undefined,
        pinned: x.pinned === true,
        label: typeof x.label === "string" ? x.label : undefined,
        unread: x.unread === true,
      }))
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        if (a.unread && !b.unread) return -1;
        if (!a.unread && b.unread) return 1;
        return b.updatedAt - a.updatedAt;
      });
  } catch {
    return [];
  }
}

export function upsertThread(t: Thread) {
  if (typeof window === "undefined") return;
  const prev = loadThreads();
  const prevRow = prev.find((x) => x.peerId === t.peerId);
  const merged: Thread = {
    ...prevRow,
    ...t,
    source: t.source ?? prevRow?.source,
    contextTitle: t.contextTitle ?? prevRow?.contextTitle,
    contextPostId: t.contextPostId ?? prevRow?.contextPostId,
    draftMessage: t.draftMessage ?? prevRow?.draftMessage,
    pinned: t.pinned ?? prevRow?.pinned,
    label: t.label ?? prevRow?.label,
    unread: t.unread !== undefined ? t.unread : prevRow?.unread,
  };
  const others = prev.filter((x) => x.peerId !== t.peerId);
  const next = [merged, ...others].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("vibe-threads-updated"));
}

export function markThreadRead(peerId: string) {
  const row = loadThreads().find((x) => x.peerId === peerId);
  if (!row) return;
  upsertThread({ ...row, unread: false });
}

export function unreadThreadCount(): number {
  return loadThreads().filter((t) => t.unread).length;
}
