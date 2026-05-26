/** 早期留存：签到、继续阅读、本地事件（演示） */

export const LS_CHECKIN = "vibe_checkin";
export const LS_CHECKIN_HISTORY = "vibe_checkin_history";
export const LS_PENDING_REPLY = "vibe_pending_reply";
export const LS_RECENT_VIEWS = "vibe_recent_views";
export const LS_TRACK_EVENTS = "vibe_track_events";

export type CheckInState = {
  lastDate: string;
  streak: number;
};

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function readCheckIn(): CheckInState {
  if (typeof window === "undefined") return { lastDate: "", streak: 0 };
  try {
    const raw = localStorage.getItem(LS_CHECKIN);
    if (!raw) return { lastDate: "", streak: 0 };
    const v = JSON.parse(raw) as CheckInState;
    return {
      lastDate: typeof v.lastDate === "string" ? v.lastDate : "",
      streak: typeof v.streak === "number" ? v.streak : 0,
    };
  } catch {
    return { lastDate: "", streak: 0 };
  }
}

export function canCheckInToday(): boolean {
  return readCheckIn().lastDate !== todayKey();
}

export function readCheckInHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_CHECKIN_HISTORY);
    const v = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function appendCheckInHistory(date: string) {
  if (typeof window === "undefined") return;
  const hist = readCheckInHistory();
  if (!hist.includes(date)) hist.push(date);
  localStorage.setItem(LS_CHECKIN_HISTORY, JSON.stringify(hist.slice(-60)));
}

/** 是否已断签（上次签到既不是今天也不是昨天） */
export function isStreakBroken(): boolean {
  const { lastDate, streak } = readCheckIn();
  if (!lastDate || streak <= 0) return false;
  const today = todayKey();
  if (lastDate === today) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return lastDate !== todayKey(yesterday);
}

export type CalendarDay = {
  date: string;
  weekday: string;
  checked: boolean;
  isToday: boolean;
};

/** 最近 7 天签到日历（含今天） */
export function getCheckInCalendar7(): CalendarDay[] {
  const hist = new Set(readCheckInHistory());
  const { lastDate } = readCheckIn();
  if (lastDate) hist.add(lastDate);
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const out: CalendarDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = todayKey(d);
    out.push({
      date,
      weekday: weekdays[d.getDay()],
      checked: hist.has(date),
      isToday: i === 0,
    });
  }
  return out;
}

export function performCheckIn(): CheckInState {
  const today = todayKey();
  const prev = readCheckIn();
  let streak = 1;
  if (prev.lastDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (prev.lastDate === today) streak = prev.streak;
    else if (prev.lastDate === todayKey(yesterday)) streak = prev.streak + 1;
    else streak = 1;
  }
  const next = { lastDate: today, streak };
  localStorage.setItem(LS_CHECKIN, JSON.stringify(next));
  appendCheckInHistory(today);
  window.dispatchEvent(new Event("vibe-checkin-updated"));
  return next;
}

export type PendingReply = {
  peerId: string;
  peerName: string;
  preview: string;
  at: number;
  dismissed: boolean;
};

export function recordPendingReply(
  data: Omit<PendingReply, "dismissed" | "at"> & { preview: string },
) {
  if (typeof window === "undefined") return;
  const row: PendingReply = {
    ...data,
    at: Date.now(),
    dismissed: false,
  };
  localStorage.setItem(LS_PENDING_REPLY, JSON.stringify(row));
  window.dispatchEvent(new Event("vibe-reply-pending"));
}

export function readPendingReply(): PendingReply | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_PENDING_REPLY);
    if (!raw) return null;
    const v = JSON.parse(raw) as PendingReply;
    if (v.dismissed) return null;
    if (typeof v.peerId !== "string" || typeof v.peerName !== "string") return null;
    return v;
  } catch {
    return null;
  }
}

export function dismissPendingReply() {
  if (typeof window === "undefined") return;
  const cur = readPendingReply();
  if (!cur) return;
  localStorage.setItem(
    LS_PENDING_REPLY,
    JSON.stringify({ ...cur, dismissed: true }),
  );
  window.dispatchEvent(new Event("vibe-reply-pending"));
}

export type RecentView = { postId: string; title: string; at: number };

export function pushRecentView(v: RecentView) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LS_RECENT_VIEWS);
    const list = raw ? (JSON.parse(raw) as RecentView[]) : [];
    const filtered = list.filter((x) => x.postId !== v.postId);
    const next = [{ ...v, at: Date.now() }, ...filtered].slice(0, 8);
    localStorage.setItem(LS_RECENT_VIEWS, JSON.stringify(next));
    window.dispatchEvent(new Event("vibe-recent-updated"));
  } catch {
    // ignore
  }
}

export function readRecentViews(): RecentView[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_RECENT_VIEWS);
    const list = raw ? (JSON.parse(raw) as RecentView[]) : [];
    return Array.isArray(list) ? list.slice(0, 8) : [];
  } catch {
    return [];
  }
}

export function trackEvent(name: string, props?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LS_TRACK_EVENTS);
    const list = raw ? (JSON.parse(raw) as unknown[]) : [];
    const row = { name, props: props ?? {}, at: Date.now(), day: todayKey() };
    const next = [...(Array.isArray(list) ? list : []), row].slice(-200);
    localStorage.setItem(LS_TRACK_EVENTS, JSON.stringify(next));
    window.dispatchEvent(new Event("vibe-track-updated"));
  } catch {
    // ignore
  }
}

export function countEventsToday(name?: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(LS_TRACK_EVENTS);
    const list = raw ? (JSON.parse(raw) as { name: string; day: string }[]) : [];
    const today = todayKey();
    return list.filter(
      (e) => e.day === today && (!name || e.name === name),
    ).length;
  } catch {
    return 0;
  }
}

function weekStartKey(d = new Date()): string {
  const x = new Date(d);
  const day = x.getDay() || 7;
  x.setDate(x.getDate() - day + 1);
  return todayKey(x);
}

/** 本周（周一至今日）事件计数 */
export function countEventsThisWeek(name?: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(LS_TRACK_EVENTS);
    const list = raw ? (JSON.parse(raw) as { name: string; day: string }[]) : [];
    const start = weekStartKey();
    return list.filter(
      (e) => e.day >= start && (!name || e.name === name),
    ).length;
  } catch {
    return 0;
  }
}

export function countCheckInsThisWeek(): number {
  const start = weekStartKey();
  return readCheckInHistory().filter((d) => d >= start).length;
}

export const LS_PERSONA = "vibe_persona";
export const LS_DAILY_MISSIONS = "vibe_daily_missions";
export const LS_DAILY_MATCH_CONTACTED = "vibe_daily_match_contacted";
export const LS_STREAK_FREEZE = "vibe_streak_freeze";
export const LS_PUBLISH_DRAFT = "vibe_publish_draft";
export const LS_FOLLOW_MISSION_WEEK = "vibe_follow_mission_week";

export type PersonaId = "student" | "pm" | "founder";

export function readPersona(): PersonaId | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(LS_PERSONA);
  if (v === "student" || v === "pm" || v === "founder") return v;
  return null;
}

export function writePersona(id: PersonaId) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_PERSONA, id);
  window.dispatchEvent(new Event("vibe-persona-updated"));
}

/** 注册角色 → 留存人设 */
export function roleToPersona(role: string): PersonaId {
  if (role === "ADC") return "founder";
  if (role === "SUPPORT") return "pm";
  return "student";
}

function isoWeekKey(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${date.getUTCFullYear()}-W${weekNo}`;
}

export const PERSONA_HOME_COPY: Record<
  PersonaId,
  { title: string; missions: string[] }
> = {
  student: {
    title: "今日目标：完成 1 步学习 + 收藏 1 篇灵感",
    missions: ["签到", "学习 1 步", "收藏 1 帖"],
  },
  pm: {
    title: "今日目标：完善资料 + 联系 1 位技术伙伴",
    missions: ["签到", "完善主页", "打个招呼"],
  },
  founder: {
    title: "今日目标：跑 1 次匹配 + 发布/浏览招募",
    missions: ["签到", "快速匹配", "浏览招募帖"],
  },
};

export type DailyMissionId =
  | "checkin"
  | "save_post"
  | "learn_step"
  | "match_run"
  | "send_message"
  | "profile_ok"
  | "browse_recruit"
  | "follow_one";

export type DailyMissionDef = {
  id: DailyMissionId;
  label: string;
  href: string;
};

const DEFAULT_MISSIONS: DailyMissionDef[] = [
  { id: "checkin", label: "每日签到", href: "/home" },
  { id: "save_post", label: "收藏 1 篇笔记", href: "/home" },
  { id: "match_run", label: "完成 1 次匹配", href: "/match" },
];

export const PERSONA_MISSIONS: Record<PersonaId, DailyMissionDef[]> = {
  student: [
    { id: "checkin", label: "签到", href: "/home" },
    { id: "learn_step", label: "学习路线 +1 步", href: "/home" },
    { id: "save_post", label: "收藏灵感帖", href: "/home" },
  ],
  pm: [
    { id: "checkin", label: "签到", href: "/home" },
    { id: "profile_ok", label: "完善主页资料", href: "/settings/profile" },
    { id: "send_message", label: "发出 1 条招呼", href: "/messages" },
  ],
  founder: [
    { id: "checkin", label: "签到", href: "/home" },
    { id: "match_run", label: "快速匹配 1 次", href: "/match" },
    { id: "browse_recruit", label: "浏览招募帖", href: "/home?type=RECRUIT" },
  ],
};

export const MISSION_LABELS: Record<DailyMissionId, string> = {
  checkin: "签到",
  save_post: "收藏",
  learn_step: "学习",
  match_run: "匹配",
  send_message: "消息",
  profile_ok: "资料",
  browse_recruit: "浏览招募",
  follow_one: "关注",
};

export function getPersonaMissions(): DailyMissionDef[] {
  const p = readPersona();
  return p ? (PERSONA_MISSIONS[p] ?? DEFAULT_MISSIONS) : DEFAULT_MISSIONS;
}

/** 今日任务完成列表（含已签到推断） */
export function getMergedDoneMissions(): DailyMissionId[] {
  const { done } = readMissionProgress();
  const merged = [...done];
  if (
    !canCheckInToday() &&
    readCheckIn().lastDate === todayKey()
  ) {
    if (!merged.includes("checkin")) merged.push("checkin");
  }
  return merged;
}

export function isAllTodayMissionsDone(): boolean {
  const ids = getPersonaMissions().map((m) => m.id);
  const merged = getMergedDoneMissions();
  return ids.every((id) => merged.includes(id));
}

export function todayMissionProgressPct(): number {
  const missions = getPersonaMissions();
  if (missions.length === 0) return 0;
  const merged = getMergedDoneMissions();
  const n = missions.filter((m) => merged.includes(m.id)).length;
  return Math.round((n / missions.length) * 100);
}

type DailyMissionState = {
  date: string;
  done: DailyMissionId[];
};

function readMissionState(): DailyMissionState {
  if (typeof window === "undefined") {
    return { date: todayKey(), done: [] };
  }
  try {
    const raw = localStorage.getItem(LS_DAILY_MISSIONS);
    const v = raw ? (JSON.parse(raw) as DailyMissionState) : null;
    if (!v || v.date !== todayKey()) return { date: todayKey(), done: [] };
    return v;
  } catch {
    return { date: todayKey(), done: [] };
  }
}

export function completeMission(id: DailyMissionId) {
  if (typeof window === "undefined") return;
  if (id === "follow_one") {
    localStorage.setItem(LS_FOLLOW_MISSION_WEEK, isoWeekKey());
  }
  const s = readMissionState();
  const wasNew = !s.done.includes(id);
  if (wasNew) s.done.push(id);
  localStorage.setItem(LS_DAILY_MISSIONS, JSON.stringify(s));
  window.dispatchEvent(new Event("vibe-missions-updated"));
  if (wasNew) {
    window.dispatchEvent(
      new CustomEvent("vibe-mission-item-done", { detail: { id } }),
    );
    if (isAllTodayMissionsDone()) {
      trackEvent("daily_missions_all_done");
    }
  }
}

/** 本周是否已完成「关注 1 人」类任务 */
export function followMissionDoneThisWeek(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(LS_FOLLOW_MISSION_WEEK) === isoWeekKey();
}

export function markDailyMatchContacted(peerId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    LS_DAILY_MATCH_CONTACTED,
    JSON.stringify({ date: todayKey(), peerId }),
  );
  window.dispatchEvent(new Event("vibe-daily-match-updated"));
}

export function readDailyMatchContacted(): { date: string; peerId: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_DAILY_MATCH_CONTACTED);
    if (!raw) return null;
    const v = JSON.parse(raw) as { date?: string; peerId?: string };
    if (v.date === todayKey() && typeof v.peerId === "string") {
      return { date: v.date, peerId: v.peerId };
    }
    return null;
  } catch {
    return null;
  }
}

export function hasDailyMatchContactedToday(): boolean {
  return readDailyMatchContacted() !== null;
}

export function isEveningStreakRisk(): boolean {
  if (!canCheckInToday()) return false;
  const h = new Date().getHours();
  if (h < 18) return false;
  const { streak } = readCheckIn();
  return streak > 0;
}

type StreakFreezeState = { week: string; used: boolean };

function readStreakFreeze(): StreakFreezeState {
  if (typeof window === "undefined") return { week: isoWeekKey(), used: false };
  try {
    const raw = localStorage.getItem(LS_STREAK_FREEZE);
    const v = raw ? (JSON.parse(raw) as StreakFreezeState) : null;
    if (!v || v.week !== isoWeekKey()) return { week: isoWeekKey(), used: false };
    return v;
  } catch {
    return { week: isoWeekKey(), used: false };
  }
}

export function canUseStreakFreeze(): boolean {
  const { streak } = readCheckIn();
  if (streak <= 0) return false;
  if (readStreakFreeze().used) return false;
  return isStreakBroken() && canCheckInToday();
}

export function applyStreakFreeze(): boolean {
  if (typeof window === "undefined" || !canUseStreakFreeze()) return false;
  const prev = readCheckIn();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = todayKey(yesterday);
  const next = { lastDate: yKey, streak: Math.max(prev.streak, 1) };
  localStorage.setItem(LS_CHECKIN, JSON.stringify(next));
  appendCheckInHistory(yKey);
  localStorage.setItem(
    LS_STREAK_FREEZE,
    JSON.stringify({ week: isoWeekKey(), used: true }),
  );
  window.dispatchEvent(new Event("vibe-checkin-updated"));
  return true;
}

export function savePublishDraftLocal(data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_PUBLISH_DRAFT, JSON.stringify({ ...data, at: Date.now() }));
  window.dispatchEvent(new Event("vibe-publish-draft-updated"));
}

export function readPublishDraftLocal(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_PUBLISH_DRAFT);
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function clearPublishDraftLocal() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_PUBLISH_DRAFT);
  window.dispatchEvent(new Event("vibe-publish-draft-updated"));
}

/** 社会证明演示基数 + 今日真实事件 */
export function socialProofCounts() {
  const baseMatch = 12;
  const baseGreet = 28;
  return {
    matchesToday: baseMatch + countEventsToday("match_run"),
    greetsToday: baseGreet + countEventsToday("send_message"),
  };
}

export function clearRetentionLocalData() {
  if (typeof window === "undefined") return;
  const keys = [
    LS_CHECKIN,
    LS_CHECKIN_HISTORY,
    LS_PENDING_REPLY,
    LS_DAILY_MISSIONS,
    LS_PERSONA,
    LS_DAILY_MATCH_CONTACTED,
    LS_STREAK_FREEZE,
    LS_PUBLISH_DRAFT,
    LS_FOLLOW_MISSION_WEEK,
    LS_TRACK_EVENTS,
    LS_RECENT_VIEWS,
    "vibe_activation",
    "vibe_demo_retention_done",
  ];
  keys.forEach((k) => localStorage.removeItem(k));
  window.dispatchEvent(new Event("vibe-checkin-updated"));
  window.dispatchEvent(new Event("vibe-missions-updated"));
  window.dispatchEvent(new Event("vibe-reply-pending"));
}

export function readMissionProgress(): { done: DailyMissionId[]; total: number } {
  const s = readMissionState();
  return { done: s.done, total: s.done.length };
}

/** 画像完善度 0–100（客户端估算，用于引导） */
export function profileCompletenessScore(profile: {
  intro?: string;
  direction?: string;
  skillKeywords?: string[];
  role?: string;
} | null): number {
  if (!profile) return 0;
  let n = 0;
  if (profile.role) n += 20;
  if ((profile.direction ?? "").trim().length >= 4) n += 25;
  if ((profile.intro ?? "").trim().length >= 20) n += 25;
  if ((profile.skillKeywords?.length ?? 0) >= 2) n += 30;
  return Math.min(100, n);
}

export const MESSAGE_INTENT_TEMPLATES: Record<string, string> = {
  match:
    "你好，我在 VibeHub 匹配里看到你的资料，想聊聊合作可能性。我目前在做的方向是：",
  interview:
    "你好，我是内容创作者，想采访你正在做的项目，方便约 20 分钟语音聊聊吗？",
  collab:
    "你好，我对你的项目很感兴趣，想进一步了解团队需求与协作方式。",
};
