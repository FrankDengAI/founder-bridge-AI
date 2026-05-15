import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";
import clsx from "clsx";
import { HomeTypeFilters } from "./HomeTypeFilters";

function homeHref(params: { type?: string; sort?: string; view?: string }) {
  const sp = new URLSearchParams();
  if (params.type) sp.set("type", params.type);
  if (params.sort && params.sort !== "new") sp.set("sort", params.sort);
  if (params.view && params.view !== "default") sp.set("view", params.view);
  const qs = sp.toString();
  return `/home${qs ? `?${qs}` : ""}`;
}

type Counts = {
  posts: number;
  users: number;
  tools: number;
  projects: number;
};

type Props = {
  currentType?: string;
  sort: "new" | "hot";
  counts: Counts;
  currentView?: "default" | "for-you" | "saved";
};

export function HomeDiscoveryMeta({
  currentType,
  sort,
  counts,
  currentView = "default",
}: Props) {
  const viewParam = currentView === "default" ? undefined : currentView;
  return (
    <div className="space-y-3">
      <div className="glass-panel rounded-shell p-3 shadow-panel ring-1 ring-white/60">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">发现模式</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href={homeHref({ type: currentType, sort, view: undefined })}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
              currentView === "default"
                ? "border-brand-300 bg-brand-50 text-brand-900"
                : "border-zinc-200 bg-white/70 text-zinc-600 hover:border-zinc-300",
            )}
          >
            全部
          </Link>
          <Link
            href={homeHref({ type: currentType, sort, view: "for-you" })}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
              currentView === "for-you"
                ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-950"
                : "border-zinc-200 bg-white/70 text-zinc-600 hover:border-zinc-300",
            )}
          >
            为你推荐
          </Link>
          <Link
            href={homeHref({ type: currentType, sort, view: "saved" })}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
              currentView === "saved"
                ? "border-amber-300 bg-amber-50 text-amber-950"
                : "border-zinc-200 bg-white/70 text-zinc-600 hover:border-zinc-300",
            )}
          >
            我的收藏
          </Link>
        </div>
      </div>
      <div className="glass-panel rounded-shell p-3 shadow-panel ring-1 ring-white/60">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-semibold text-zinc-700">内容发现</p>
          <div className="flex gap-1 rounded-xl bg-zinc-100/80 p-0.5 ring-1 ring-zinc-200/60">
            <Link
              href={homeHref({ type: currentType, sort: "new", view: viewParam })}
              className={clsx(
                "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                sort === "new"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900",
              )}
            >
              <Sparkles className="h-3 w-3" />
              最新
            </Link>
            <Link
              href={homeHref({ type: currentType, sort: "hot", view: viewParam })}
              className={clsx(
                "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                sort === "hot"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900",
              )}
            >
              <Flame className="h-3 w-3 text-amber-600" />
              热门
            </Link>
          </div>
        </div>
        <div className="mt-3">
          <HomeTypeFilters
            current={currentType}
            sort={sort}
            view={currentView === "default" ? undefined : currentView}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { k: "笔记", v: counts.posts },
          { k: "用户", v: counts.users },
          { k: "工具", v: counts.tools },
          { k: "项目", v: counts.projects },
        ].map((x) => (
          <div
            key={x.k}
            className="rounded-2xl bg-white/70 px-3 py-2 text-center ring-1 ring-zinc-200/60"
          >
            <p className="text-lg font-bold tabular-nums text-zinc-900">{x.v}</p>
            <p className="text-[10px] font-medium text-zinc-500">{x.k}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
