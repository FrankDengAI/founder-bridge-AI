import { PageHeader } from "@/components/PageHeader";
import { SearchListSkeleton } from "@/components/ui/PageListSkeleton";

export default function SearchLoading() {
  return (
    <div className="space-y-3 pb-4">
      <PageHeader title="搜索" subtitle="加载检索…" backHref="/home" />
      <div className="glass-panel space-y-3 rounded-2xl p-3 shadow-sm motion-safe:animate-pulse">
        <div className="h-10 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-7 w-14 rounded-full bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      </div>
      <SearchListSkeleton />
    </div>
  );
}
