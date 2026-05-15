"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Command, CornerDownLeft, Search } from "lucide-react";
import {
  COMMAND_ITEMS,
  type CommandItem,
} from "@/lib/commandPaletteItems";
import { readRecentRoutes } from "@/lib/appHub";

type Row =
  | { kind: "recent"; key: string; label: string; href: string }
  | { kind: "cmd"; key: string; item: CommandItem };

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function scoreItem(q: string, item: CommandItem): number {
  if (!q) return 1;
  const n = normalize(q);
  if (normalize(item.label).includes(n)) return 100;
  if (item.hint && normalize(item.hint).includes(n)) return 80;
  if (item.keywords.some((k) => k.includes(n) || n.includes(k))) return 60;
  return 0;
}

function filterCommands(q: string): CommandItem[] {
  if (!q.trim()) return COMMAND_ITEMS;
  return COMMAND_ITEMS.filter((it) => scoreItem(q, it) > 0).sort(
    (a, b) => scoreItem(q, b) - scoreItem(q, a),
  );
}

function buildRows(q: string, recent: string[]): Row[] {
  const rows: Row[] = [];
  const qt = q.trim();
  if (!qt) {
    recent.slice(0, 6).forEach((href) => {
      rows.push({ kind: "recent", key: `r:${href}`, label: href, href });
    });
  } else {
    recent
      .filter((href) => href.toLowerCase().includes(qt.toLowerCase()))
      .slice(0, 4)
      .forEach((href) => {
        rows.push({ kind: "recent", key: `r:${href}`, label: href, href });
      });
  }
  filterCommands(q).forEach((item) => {
    rows.push({ kind: "cmd", key: `c:${item.id}`, item });
  });
  return rows;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [recent, setRecent] = useState<string[]>([]);

  const rows = useMemo(() => buildRows(q, recent), [q, recent]);

  useEffect(() => {
    setActive(0);
  }, [q, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key === "k" || e.key === "K";
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("vibe-open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("vibe-open-command-palette", onOpen);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setRecent(readRecentRoutes());
      setQ("");
      window.setTimeout(() => inputRef.current?.focus(), 10);
      window.dispatchEvent(new Event("vibe-command-palette-opened"));
    }
  }, [open]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  const activate = useCallback(
    (index: number) => {
      const row = rows[index];
      if (!row) return;
      if (row.kind === "recent") go(row.href);
      else go(row.item.href);
    },
    [rows, go],
  );

  const onKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(rows.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      activate(active);
    }
  };

  useEffect(() => {
    if (active >= rows.length) setActive(Math.max(0, rows.length - 1));
  }, [rows.length, active]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-zinc-950/50 p-3 pt-[10vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vibe-command-palette-title"
      aria-describedby="vibe-command-palette-hint"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <p id="vibe-command-palette-title" className="sr-only">
        命令面板
      </p>
      <p id="vibe-command-palette-hint" className="sr-only">
        使用上下键选择，回车打开，Esc 关闭。
      </p>
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-zinc-200/80 dark:bg-zinc-950 dark:ring-zinc-800">
        <div className="flex items-center gap-2 border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
          <input
            ref={inputRef}
            id="command-palette-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyNav}
            placeholder="跳转页面、搜索功能…"
            role="combobox"
            aria-autocomplete="list"
            aria-controls="command-palette-listbox"
            aria-activedescendant={
              rows.length ? `command-palette-opt-${active}` : undefined
            }
            aria-expanded="true"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-0"
          />
          <kbd className="hidden shrink-0 rounded-lg bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-500 sm:inline-block">
            Esc
          </kbd>
        </div>

        <div className="max-h-[min(58vh,400px)] overflow-y-auto overscroll-contain py-2">
          {!q.trim() && recent.length ? (
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              最近访问
            </p>
          ) : null}
          <ul id="command-palette-listbox" role="listbox" className="px-1" aria-label="命令与最近访问">
            {rows.map((row, i) => {
              const isSel = i === active;
              if (row.kind === "recent") {
                return (
                  <li key={row.key} role="presentation">
                    <button
                      type="button"
                      id={`command-palette-opt-${i}`}
                      role="option"
                      aria-selected={isSel}
                      onClick={() => activate(i)}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm ${
                        isSel ? "bg-violet-50 ring-1 ring-violet-200/80" : "hover:bg-zinc-50"
                      }`}
                    >
                      <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                      <span className="truncate font-mono text-xs text-zinc-800">{row.label}</span>
                    </button>
                  </li>
                );
              }
              const item = row.item;
              const Icon = item.Icon;
              return (
                <li key={row.key} role="presentation">
                  <button
                    type="button"
                    id={`command-palette-opt-${i}`}
                    role="option"
                    aria-selected={isSel}
                    onClick={() => activate(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${
                      isSel ? "bg-violet-50 ring-1 ring-violet-200/80" : "hover:bg-zinc-50"
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-fuchsia-500/15 text-brand-800">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-zinc-900">{item.label}</span>
                      <span className="block text-[11px] text-zinc-500">
                        {item.group}
                        {item.hint ? ` · ${item.hint}` : ""}
                      </span>
                    </span>
                    <Command className="h-3.5 w-3.5 shrink-0 text-zinc-300" />
                  </button>
                </li>
              );
            })}
          </ul>
          {rows.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-zinc-500">没有匹配项，换个词试试</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 px-3 py-2 text-[10px] text-zinc-500">
          <span className="flex flex-wrap items-center gap-1">
            <kbd className="rounded bg-zinc-100 px-1 font-mono">↑↓</kbd> 选择
            <kbd className="rounded bg-zinc-100 px-1 font-mono">Enter</kbd> 打开
          </span>
          <span>
            <kbd className="rounded bg-zinc-100 px-1 font-mono">⌘/Ctrl</kbd>+
            <kbd className="rounded bg-zinc-100 px-1 font-mono">K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
