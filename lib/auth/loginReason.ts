/** 根据登录成功后的跳转路径推断弹窗 reason（对应 authModal.reason.*） */
const REASON_BY_PREFIX: readonly [string, string][] = [
  ["/post/", "viewPost"],
  ["/match", "match"],
  ["/messages", "messages"],
  ["/me", "me"],
  ["/publish", "publish"],
  ["/search", "search"],
  ["/settings", "me"],
  ["/models/", "default"],
  ["/tools", "default"],
];

export function loginReasonFromNext(next?: string | null): string | undefined {
  if (!next) return undefined;
  const path = next.split("?")[0] ?? next;
  for (const [prefix, reason] of REASON_BY_PREFIX) {
    if (path === prefix || path.startsWith(prefix)) return reason;
  }
  return undefined;
}
