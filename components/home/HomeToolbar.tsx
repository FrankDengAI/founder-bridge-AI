"use client";

import Link from "next/link";
import { Command, PenSquare, Search } from "lucide-react";

export function HomeToolbar() {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        title="命令面板"
        aria-label="打开命令面板"
        onClick={() => window.dispatchEvent(new Event("vibe-open-command-palette"))}
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-zinc-800 ring-1 ring-zinc-200/80 shadow-sm transition hover:bg-white"
      >
        <Command className="h-4 w-4" />
      </button>
      <Link
        href="/search"
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-zinc-800 ring-1 ring-zinc-200/80 shadow-sm transition hover:bg-white"
        aria-label="搜索"
      >
        <Search className="h-4 w-4" />
      </Link>
      <Link
        href="/publish"
        className="inline-flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 text-xs font-semibold text-white shadow-glow"
      >
        <PenSquare className="h-4 w-4" />
        发布
      </Link>
    </div>
  );
}
