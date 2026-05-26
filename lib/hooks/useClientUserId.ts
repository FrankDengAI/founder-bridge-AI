"use client";

import { useEffect, useState } from "react";

export type MeUser = {
  userId: string;
  username: string;
  displayName: string;
  isDemo: boolean;
};

type SessionSnapshot = {
  user: MeUser | null;
  loading: boolean;
};

let snapshot: SessionSnapshot = { user: null, loading: true };
let inflight: Promise<MeUser | null> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

async function fetchMe(): Promise<MeUser | null> {
  try {
    const res = await fetch("/api/me", { credentials: "include" });
    if (!res.ok) return null;
    const me = (await res.json()) as MeUser;
    return me?.userId ? me : null;
  } catch {
    return null;
  }
}

function ensureSessionLoaded() {
  if (!inflight) {
    inflight = fetchMe().then((user) => {
      snapshot = { user, loading: false };
      notify();
      return user;
    });
  }
  return inflight;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getSnapshot(): SessionSnapshot {
  return snapshot;
}

/** 客户端读取当前登录用户；未登录为 null（加载完成前也为 null） */
export function useClientUserId(): string | null {
  const [, bump] = useState(0);
  useEffect(() => {
    return subscribe(() => bump((n) => n + 1));
  }, []);
  useEffect(() => {
    void ensureSessionLoaded();
  }, []);
  return getSnapshot().user?.userId ?? null;
}

/** `/api/me` 是否已返回（用于区分「加载中」与「未登录」） */
export function useClientUserReady(): boolean {
  const [, bump] = useState(0);
  useEffect(() => {
    return subscribe(() => bump((n) => n + 1));
  }, []);
  useEffect(() => {
    void ensureSessionLoaded();
  }, []);
  return !getSnapshot().loading;
}

export function useCurrentUser(): { user: MeUser | null; loading: boolean } {
  const [, bump] = useState(0);
  useEffect(() => {
    return subscribe(() => bump((n) => n + 1));
  }, []);
  useEffect(() => {
    void ensureSessionLoaded();
  }, []);
  const s = getSnapshot();
  return { user: s.user, loading: s.loading };
}

/** 登录/登出后强制刷新会话缓存 */
export function invalidateClientSession() {
  inflight = null;
  snapshot = { user: null, loading: true };
  notify();
  void ensureSessionLoaded();
}
