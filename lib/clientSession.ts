/** 浏览器端与会话 Cookie 对齐的 localStorage 键（与历史代码一致） */
export const LS_USER_ID = "vibe_current_user_id";

export function syncLocalUserId(userId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_USER_ID, userId);
}

export function clearLocalUserId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_USER_ID);
}
