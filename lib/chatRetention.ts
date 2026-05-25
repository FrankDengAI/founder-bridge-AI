/** 本地会话温度与对话里程碑（演示） */

const CHAT_KEY = "vibe_chat_messages";

type ChatMsg = { from: "me" | "peer"; text: string };

function loadPeerMsgs(peerId: string): ChatMsg[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as Record<string, ChatMsg[]>;
    const list = all[peerId];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export type ThreadWarmth = "hot" | "warm" | "cold";

export function threadWarmth(peerId: string): ThreadWarmth {
  const msgs = loadPeerMsgs(peerId);
  const mine = msgs.filter((m) => m.from === "me").length;
  const peer = msgs.filter((m) => m.from === "peer").length;
  if (msgs.length >= 6 && mine >= 2 && peer >= 2) return "hot";
  if (msgs.length >= 2) return "warm";
  return "cold";
}

export const WARMTH_LABEL: Record<ThreadWarmth, string> = {
  hot: "热聊",
  warm: "温",
  cold: "新",
};

/** 双方各至少 2 条 → 来回对话里程碑 */
export function hasBackAndForthChat(peerId: string): boolean {
  const msgs = loadPeerMsgs(peerId);
  const mine = msgs.filter((m) => m.from === "me").length;
  const peer = msgs.filter((m) => m.from === "peer").length;
  return mine >= 2 && peer >= 2;
}
