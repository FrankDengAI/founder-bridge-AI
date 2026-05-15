/** 与 Feed/搜索/工具列表布局对齐的骨架屏（motion-safe） */

export function HomeFeedSkeleton() {
  return (
    <div className="columns-2 gap-2 space-y-2 [column-fill:_balance]">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="mb-2 break-inside-avoid">
          <div className="overflow-hidden rounded-2xl bg-white/80 ring-1 ring-zinc-200/60 motion-safe:animate-pulse dark:bg-zinc-900/50 dark:ring-zinc-800/80">
            <div className="aspect-[4/5] w-full bg-gradient-to-br from-zinc-100 to-zinc-200/80 dark:from-zinc-800 dark:to-zinc-900" />
            <div className="space-y-2 p-3">
              <div className="h-3.5 w-[88%] rounded-full bg-zinc-200/90 dark:bg-zinc-700" />
              <div className="h-3 w-[55%] rounded-full bg-zinc-100 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SearchListSkeleton() {
  return (
    <ul className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="glass-panel flex gap-3 rounded-2xl p-3 shadow-sm motion-safe:animate-pulse"
        >
          <div className="h-16 w-16 shrink-0 rounded-2xl bg-zinc-200/80 dark:bg-zinc-700" />
          <div className="min-w-0 flex-1 space-y-2 py-0.5">
            <div className="h-2.5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3.5 w-full rounded-full bg-zinc-200/90 dark:bg-zinc-700" />
            <div className="h-3 w-[80%] max-w-[240px] rounded-full bg-zinc-100 dark:bg-zinc-800" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ToolsPageSkeleton() {
  return (
    <div className="space-y-4 pb-4 motion-safe:animate-pulse">
      <div className="glass-panel h-[72px] rounded-2xl shadow-soft ring-1 ring-white/70" />
      <div className="glass-panel space-y-3 rounded-3xl p-3 ring-1 ring-white/70">
        <div className="h-10 w-full rounded-2xl bg-zinc-200/70 dark:bg-zinc-800" />
        <div className="h-24 w-full rounded-2xl bg-zinc-100/90 dark:bg-zinc-900" />
        <div className="h-24 w-full rounded-2xl bg-zinc-100/90 dark:bg-zinc-900" />
      </div>
      <div className="glass-panel space-y-3 rounded-3xl p-4 ring-1 ring-white/70">
        <div className="h-5 w-32 rounded-full bg-zinc-200/80 dark:bg-zinc-800" />
        <div className="h-10 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-20 w-full rounded-2xl bg-zinc-100/90 dark:bg-zinc-900" />
      </div>
    </div>
  );
}
