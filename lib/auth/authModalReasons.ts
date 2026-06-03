/** authModal.reason.* 已知 key，避免 next-intl 缺 key 报错 */
export const AUTH_MODAL_REASONS = new Set([
  "default",
  "viewPost",
  "match",
  "messages",
  "me",
  "publish",
  "search",
  "engage",
]);

export function isAuthModalReason(value: string | null | undefined): value is string {
  return Boolean(value && AUTH_MODAL_REASONS.has(value));
}
