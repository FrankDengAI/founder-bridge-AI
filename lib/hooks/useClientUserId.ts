"use client";

import { useEffect, useState } from "react";

export type MeUser = {
  userId: string;
  username: string;
  displayName: string;
  isDemo: boolean;
};

/** 客户端读取当前登录用户；未登录为 null */
export function useClientUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    void fetch("/api/me", { credentials: "include" })
      .then(async (r) => {
        if (!r.ok) return null;
        return r.json() as Promise<MeUser>;
      })
      .then((me) => {
        if (!cancelled) setUserId(me?.userId ?? null);
      })
      .catch(() => {
        if (!cancelled) setUserId(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return userId;
}

export function useCurrentUser(): { user: MeUser | null; loading: boolean } {
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    void fetch("/api/me", { credentials: "include" })
      .then(async (r) => {
        if (!r.ok) return null;
        return r.json() as Promise<MeUser>;
      })
      .then((me) => {
        if (!cancelled) {
          setUser(me?.userId ? me : null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return { user, loading };
}
