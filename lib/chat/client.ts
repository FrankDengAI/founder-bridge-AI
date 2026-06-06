/** 创建或打开与 peer 的 1:1 会话，返回 conversationId */
export async function startConversation(
  peerId: string,
  meta?: Record<string, unknown>,
): Promise<{ conversationId: string; peerId: string; peerName: string } | null> {
  const res = await fetch("/api/conversations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ peerId, meta }),
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ conversationId: string; peerId: string; peerName: string }>;
}

export type ApiThread = {
  id: string;
  peerId: string;
  peerName: string;
  lastMessage: string;
  updatedAt: number;
  unread: boolean;
  source?: "match";
  contextTitle?: string;
};

export async function fetchConversations(): Promise<ApiThread[]> {
  const res = await fetch("/api/conversations", { credentials: "include" });
  if (!res.ok) return [];
  const data = (await res.json()) as { conversations: ApiThread[] };
  return data.conversations ?? [];
}

export type ApiMessage = {
  id: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: number;
  meta?: Record<string, unknown>;
};

export async function fetchMessages(
  conversationId: string,
): Promise<{ messages: ApiMessage[]; peerLastReadAt: number | null }> {
  const res = await fetch(`/api/conversations/${conversationId}/messages`, {
    credentials: "include",
  });
  if (!res.ok) return { messages: [], peerLastReadAt: null };
  const data = (await res.json()) as {
    messages: ApiMessage[];
    peerLastReadAt: number | null;
  };
  return {
    messages: data.messages ?? [],
    peerLastReadAt: data.peerLastReadAt ?? null,
  };
}

export async function sendMessage(
  conversationId: string,
  body: string,
  meta?: Record<string, unknown>,
): Promise<boolean> {
  const res = await fetch(`/api/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ body, meta }),
  });
  return res.ok;
}

export async function markConversationRead(conversationId: string): Promise<void> {
  await fetch(`/api/conversations/${conversationId}/read`, {
    method: "POST",
    credentials: "include",
  });
}
