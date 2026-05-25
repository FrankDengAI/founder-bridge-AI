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
  { id: "daily_login", label: "早起鸟", desc: "完成至少 1 次每日签到", emoji: "☀️" },
  { id: "daily_7", label: "七日燃", desc: "连续签到满 7 天", emoji: "🔥" },
  { id: "match_3", label: "社交蝶", desc: "打开匹配页 3 次", emoji: "🦋" },
  { id: "publish_1", label: "发声者", desc: "发布或保存过 1 篇内容", emoji: "📣" },
  { id: "daily_missions_done", label: "日课达人", desc: "单日完成全部今日任务", emoji: "✅" },
  { id: "first_message", label: "破冰者", desc: "发出第一条私信", emoji: "💬" },
  { id: "follow_first", label: "人脉+", desc: "首次关注一位创业者", emoji: "🤝" },
  { id: "activation_week", label: "七日毕业生", desc: "完成 7 日激活路线", emoji: "🎓" },
  { id: "chat_back_and_forth", label: "深聊", desc: "与伙伴来回对话各 2 条+", emoji: "🔁" },
  { id: "streak_freeze_used", label: "补签侠", desc: "使用过一次 streak 保护", emoji: "🛡️" },
  { id: "model_review_first", label: "模型观察员", desc: "提交第一条大模型评价", emoji: "🔭" },
  { id: "model_discussion_first", label: "榜单共建者", desc: "首次发起模型讨论帖", emoji: "🏗️" },
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

const LS_VISIT = "vibe_visit_counts";

/** 累计访问次数，达到阈值时解锁徽章（如 match_3） */
export function bumpVisitCounter(pageId: string, badgeId: string, threshold: number) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LS_VISIT);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    map[pageId] = (map[pageId] ?? 0) + 1;
    localStorage.setItem(LS_VISIT, JSON.stringify(map));
    if (map[pageId] >= threshold) recordGamifyEvent(badgeId);
  } catch {
    // ignore
  }
}

export function getAllBadges(): BadgeDef[] {
  return BADGES;
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
