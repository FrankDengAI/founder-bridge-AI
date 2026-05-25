/** 从消息 meta JSON 解析会话上下文（匹配来源等） */
export function parseMessageMeta(raw: string | null | undefined): Record<string, unknown> {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw) as unknown;
    return v && typeof v === "object" && !Array.isArray(v)
      ? (v as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export function metaFromMessages(
  messages: { meta: string | null }[],
): Record<string, unknown> {
  for (const m of messages) {
    const meta = parseMessageMeta(m.meta);
    if (meta.source === "match" || typeof meta.contextTitle === "string") {
      return meta;
    }
  }
  return parseMessageMeta(messages[0]?.meta);
}
