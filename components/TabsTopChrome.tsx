"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { AccountMenu } from "@/components/AccountMenu";
import { NotificationHub } from "@/components/NotificationHub";
import clsx from "clsx";

export function TabsTopChrome() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("vibe_theme", next ? "dark" : "light");
    setDark(next);
  };

  return (
    <div className="mb-2 flex items-center justify-end gap-2">
      <AccountMenu />
      <button
        type="button"
        onClick={toggle}
        className={clsx(
          "flex h-11 w-11 items-center justify-center rounded-2xl shadow-md ring-1 transition",
          dark
            ? "bg-zinc-900 text-amber-200 ring-zinc-700 hover:bg-zinc-800"
            : "bg-white/90 text-amber-600 ring-zinc-200/80 hover:bg-white",
        )}
        aria-label="切换深色模式"
      >
        {dark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>
      <NotificationHub />
    </div>
  );
}
