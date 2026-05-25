/** 账号：3–32 位，字母数字下划线，字母开头 */
const USERNAME_RE = /^[a-zA-Z][a-zA-Z0-9_]{2,31}$/;

export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

export function validateUsername(username: string): string | null {
  if (!username) return "请输入账号";
  if (username.length < 3) return "账号至少 3 个字符";
  if (username.length > 32) return "账号最多 32 个字符";
  if (!USERNAME_RE.test(username)) {
    return "账号需以字母开头，仅含字母、数字、下划线";
  }
  return null;
}
