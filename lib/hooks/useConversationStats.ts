"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchConversations, type ApiThread } from "@/lib/chat/client";

const POLL_VISIBLE_MS = 8000;
const POLL_HIDDEN_MS = 30000;

export function notifyConversationsUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("vibe-conversations-updated"));
  }
}

type Listener = () => void;

let sharedConversations: ApiThread[] = [];
let sharedLoading = true;
let subscriberCount = 0;
let pollIntervalId = 0;
const listeners = new Set<Listener>();
let refreshInFlight: Promise<void> | null = null;

function emit() {
  listeners.forEach((fn) => fn());
}

async function sharedRefresh() {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const list = await fetchConversations();
    sharedConversations = list;
    sharedLoading = false;
    emit();
  })().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

function armPollInterval() {
  window.clearInterval(pollIntervalId);
  const ms = document.hidden ? POLL_HIDDEN_MS : POLL_VISIBLE_MS;
  pollIntervalId = window.setInterval(() => void sharedRefresh(), ms);
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  subscriberCount += 1;
  if (subscriberCount === 1) {
    void sharedRefresh();
    armPollInterval();
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("vibe-conversations-updated", onExternalUpdate);
  }
}

function unsubscribe(listener: Listener) {
  listeners.delete(listener);
  subscriberCount = Math.max(0, subscriberCount - 1);
  if (subscriberCount === 0) {
    window.clearInterval(pollIntervalId);
    pollIntervalId = 0;
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("vibe-conversations-updated", onExternalUpdate);
    sharedConversations = [];
    sharedLoading = true;
  }
}

function onVisibilityChange() {
  if (!document.hidden) void sharedRefresh();
  if (subscriberCount > 0) armPollInterval();
}

function onExternalUpdate() {
  void sharedRefresh();
}

/** 服务端会话列表（全局单例轮询，多组件共享） */
export function useConversations(enabled = true) {
  const [conversations, setConversations] = useState<ApiThread[]>(
    enabled ? sharedConversations : [],
  );
  const [loading, setLoading] = useState(enabled ? sharedLoading : false);

  const sync = useCallback(() => {
    setConversations([...sharedConversations]);
    setLoading(sharedLoading);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setConversations([]);
      setLoading(false);
      return;
    }

    sync();
    subscribe(sync);
    return () => unsubscribe(sync);
  }, [enabled, sync]);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    await sharedRefresh();
  }, [enabled]);

  const unread = useMemo(
    () => conversations.filter((t) => t.unread).length,
    [conversations],
  );

  return {
    conversations,
    total: conversations.length,
    unread,
    loading,
    refresh,
  };
}

/** 仅统计会话数与未读数 */
export function useConversationStats(enabled = true) {
  const { total, unread } = useConversations(enabled);
  return { total, unread };
}
