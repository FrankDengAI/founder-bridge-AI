/** 7 日激活旅程（localStorage 演示） */

import { recordGamifyEvent } from "@/lib/gamification";
import { todayKey } from "@/lib/retention";

export const LS_ACTIVATION = "vibe_activation";

export type ActivationStepId =
  | "persona"
  | "profile_60"
  | "first_match"
  | "first_save"
  | "first_message"
  | "first_follow"
  | "week_publish_or_learn";

export type ActivationStep = {
  id: ActivationStepId;
  label: string;
  hint: string;
  href: string;
  day: number;
};

export const ACTIVATION_STEPS: ActivationStep[] = [
  {
    id: "persona",
    label: "选择创业人设",
    hint: "让每日任务更贴合你的目标",
    href: "/welcome",
    day: 0,
  },
  {
    id: "profile_60",
    label: "资料完善度 ≥60%",
    hint: "提升匹配推荐质量",
    href: "/settings/profile",
    day: 0,
  },
  {
    id: "first_match",
    label: "完成首次匹配",
    hint: "找到第一位值得聊的伙伴",
    href: "/match",
    day: 1,
  },
  {
    id: "first_save",
    label: "收藏第一篇笔记",
    hint: "建立你的灵感库",
    href: "/home",
    day: 1,
  },
  {
    id: "first_message",
    label: "发出第一条招呼",
    hint: "把匹配变成真实对话",
    href: "/messages",
    day: 2,
  },
  {
    id: "first_follow",
    label: "关注 1 位创业者",
    hint: "订阅你关心的人动态",
    href: "/home",
    day: 3,
  },
  {
    id: "week_publish_or_learn",
    label: "发布内容或学完 3 步",
    hint: "完成首周闭环",
    href: "/publish",
    day: 7,
  },
];

type ActivationState = {
  startedAt: string;
  done: ActivationStepId[];
};

function readState(): ActivationState {
  if (typeof window === "undefined") {
    return { startedAt: todayKey(), done: [] };
  }
  try {
    const raw = localStorage.getItem(LS_ACTIVATION);
    const v = raw ? (JSON.parse(raw) as ActivationState) : null;
    if (!v || typeof v.startedAt !== "string") {
      return { startedAt: todayKey(), done: [] };
    }
    return { startedAt: v.startedAt, done: Array.isArray(v.done) ? v.done : [] };
  } catch {
    return { startedAt: todayKey(), done: [] };
  }
}

function writeState(s: ActivationState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_ACTIVATION, JSON.stringify(s));
  window.dispatchEvent(new Event("vibe-activation-updated"));
}

export function completeActivationStep(id: ActivationStepId) {
  const s = readState();
  if (!s.done.includes(id)) {
    s.done.push(id);
    writeState(s);
    if (readActivationProgress().complete) {
      recordGamifyEvent("activation_week");
    }
  }
}

export function readActivationProgress() {
  const s = readState();
  const total = ACTIVATION_STEPS.length;
  const done = s.done.length;
  const next = ACTIVATION_STEPS.find((x) => !s.done.includes(x.id)) ?? null;
  const complete = done >= total;
  return { startedAt: s.startedAt, done: s.done, total, doneCount: done, next, complete };
}

export function isActivationComplete(): boolean {
  return readActivationProgress().complete;
}
