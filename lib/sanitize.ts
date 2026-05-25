/** 剥除 HTML/脚本标签，防止 XSS 内容存入数据库 */
export function stripHtml(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

/** 校验文本字段：去除 HTML、限制长度，返回净化后字符串或 null（校验失败） */
export function sanitizeText(
  raw: string | undefined | null,
  opts: { min?: number; max: number },
): string | null {
  if (raw === undefined || raw === null) return null;
  const cleaned = stripHtml(raw);
  const { min = 1, max } = opts;
  if (cleaned.length < min || cleaned.length > max) return null;
  return cleaned;
}
