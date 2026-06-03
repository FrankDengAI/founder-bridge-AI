"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Flame, Sparkles } from "lucide-react";
import clsx from "clsx";
import { DiscoveryTypeChips } from "@/components/home/DiscoveryTypeChips";

type Props = {
  currentType?: string;
  sort: "new" | "hot";
  view?: string;
};

function homeHref(params: { type?: string; sort?: string; view?: string }) {
  const sp = new URLSearchParams();
  if (params.type) sp.set("type", params.type);
  if (params.sort && params.sort !== "new") sp.set("sort", params.sort);
  if (params.view && params.view !== "default") sp.set("view", params.view);
  const qs = sp.toString();
  return `/home${qs ? `?${qs}` : ""}`;
}

export function DiscoveryAppChrome({ currentType, sort, view }: Props) {
  const tHome = useTranslations("home");
  const tApp = useTranslations("homeUi.discoveryApp");
  const tc = useTranslations("common");
  const viewParam = view && view !== "default" ? view : undefined;

  return (
    <header className="sticky top-0 z-20 -mx-1 space-y-2 bg-gradient-to-b from-violet-50/98 via-white/98 to-white/80 px-1 pb-2 pt-0 backdrop-blur-lg supports-[backdrop-filter]:bg-white/85">
      <h1 className="truncate text-base font-bold tracking-tight text-zinc-950">
        {tHome("title")}
      </h1>

      <div className="flex items-center gap-2">
        <DiscoveryTypeChips current={currentType} sort={sort} view={view} />
        <div className="flex shrink-0 gap-0.5 rounded-xl bg-zinc-100/90 p-0.5 ring-1 ring-zinc-200/60">
          <Link
            href={homeHref({ type: currentType, sort: "new", view: viewParam })}
            className={clsx(
              "inline-flex items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-semibold transition",
              sort === "new"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900",
            )}
          >
            <Sparkles className="h-3 w-3" />
            {tApp("newest")}
          </Link>
          <Link
            href={homeHref({ type: currentType, sort: "hot", view: viewParam })}
            className={clsx(
              "inline-flex items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-semibold transition",
              sort === "hot"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900",
            )}
          >
            <Flame className="h-3 w-3 text-amber-600" />
            {tc("hot")}
          </Link>
        </div>
      </div>
    </header>
  );
}
