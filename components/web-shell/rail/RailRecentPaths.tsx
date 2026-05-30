"use client";

import { useEffect, useState } from "react";
import { Compass } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { stripLocalePrefix } from "@/lib/localePath";
import { RailPanel } from "./RailPanel";

const STORAGE_KEY = "vbc_recent_paths";
const MAX = 5;

const PATH_NAV_KEYS: Record<string, string> = {
  "/home": "home",
  "/match": "match",
  "/tools": "tools",
  "/models": "models",
  "/learn": "learn",
  "/messages": "messages",
  "/workspace": "workspace",
  "/search": "search",
};

export function RailRecentPaths({ index = 3 }: { index?: number }) {
  const t = useTranslations("rail");
  const tn = useTranslations("nav");
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPaths(JSON.parse(raw) as string[]);
    } catch {
      setPaths([]);
    }
  }, []);

  if (paths.length === 0) return null;

  return (
    <RailPanel
      title={t("recentPaths.title")}
      purpose={t("recentPaths.purpose")}
      icon={<Compass className="h-4 w-4 text-zinc-500" />}
      index={index}
    >
      <ul className="space-y-1.5">
        {paths.map((p) => {
          const base = stripLocalePrefix(p.split("?")[0] || "/");
          const navKey = PATH_NAV_KEYS[base];
          const label = navKey ? tn(navKey) : base;
          return (
            <li key={p}>
              <Link href={p} className="text-xs font-medium text-zinc-700 hover:text-violet-700">
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </RailPanel>
  );
}

/** 记录当前路径到最近浏览（在 AppShell 或 WebAppFrame 调用） */
export function pushRecentPath(pathname: string) {
  if (typeof window === "undefined") return;
  const base = stripLocalePrefix(pathname.split("?")[0] || "/");
  if (base === "/welcome" || base.startsWith("/welcome")) return;
  try {
    const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
    const next = [base, ...prev.filter((x) => x !== base)].slice(0, MAX);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}
