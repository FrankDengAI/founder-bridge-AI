/** 本地成就事件（演示用，写入 localStorage） */
const LS = "vibe_gamify_events";

export type BadgeDef = {
  id: string;
  label: string;
  desc: string;
  emoji: string;
};

const BADGES: BadgeDef[] = [
  { id: "visit_home", label: "探索者", desc: "打开过发现首页", emoji: "🧭" },
  { id: "save_post", label: "策展人", desc: "收藏过至少 1 篇笔记", emoji: "⭐" },
  { id: "save_3", label: "收藏家", desc: "收藏满 3 篇笔记", emoji: "📚" },
  { id: "open_workspace", label: "指挥官", desc: "进入过工作台", emoji: "🛰️" },
  { id: "open_match", label: "连接者", desc: "打开过创业匹配", emoji: "✨" },
  { id: "open_palette", label: "极客", desc: "使用过命令面板 (⌘K)", emoji: "⌘" },
  { id: "lesson_path", label: "路线生", desc: "学习路线至少完成 3 步（入库）", emoji: "🎓" },
  { id: "lesson_master", label: "通关者", desc: "学习路线 8 步全部完成（入库）", emoji: "🏁" },
];

function readEvents(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS);
    const a = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}

export function recordGamifyEvent(eventId: string) {
  if (typeof window === "undefined") return;
  const cur = readEvents();
  if (cur.includes(eventId)) return;
  cur.push(eventId);
  localStorage.setItem(LS, JSON.stringify(cur.slice(-120)));
  window.dispatchEvent(new Event("vibe-badges-updated"));
}

export function getUnlockedBadges(): BadgeDef[] {
  const ev = readEvents();
  return BADGES.filter((b) => ev.includes(b.id));
}

export function syncSaveCountBadge(count: number) {
  if (count >= 1) recordGamifyEvent("save_post");
  if (count >= 3) recordGamifyEvent("save_3");
}

/** 与 UserLessonProgress 单一数据源对齐的成就同步（仅客户端） */
export function syncLessonProgressGamification(doneCount: number) {
  if (typeof window === "undefined") return;
  if (doneCount >= 3) recordGamifyEvent("lesson_path");
  if (doneCount >= 8) recordGamifyEvent("lesson_master");
}
