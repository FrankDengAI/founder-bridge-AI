"use client";

import { useEffect, useState } from "react";
import { Compass } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { stripLocalePrefix } from "@/lib/localePath";
import { RAIL_MISSIONS } from "@/lib/webModuleMission";
import { RailPanel } from "./RailPanel";

const STORAGE_KEY = "vbc_recent_paths";
const MAX = 5;

const PATH_LABELS: Record<string, string> = {
  "/home": "发现",
  "/match": "匹配",
  "/tools": "工具商城",
  "/models": "模型榜",
  "/learn": "学习",
  "/messages": "消息",
  "/workspace": "工作台",
  "/search": "搜索",
};

export function RailRecentPaths({ index = 3 }: { index?: number }) {
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
      title={RAIL_MISSIONS.recentPaths.title}
      purpose={RAIL_MISSIONS.recentPaths.purpose}
      icon={<Compass className="h-4 w-4 text-zinc-500" />}
      index={index}
    >
      <ul className="space-y-1.5">
        {paths.map((p) => {
          const base = stripLocalePrefix(p.split("?")[0] || "/");
          const label = PATH_LABELS[base] ?? base;
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
