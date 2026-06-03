"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { DISCOVERY_FEED_TYPES } from "@/lib/domain/discoveryFilters";
import { getPostTypeLabel } from "@/lib/labels";

function withSortAndView(href: string, sort: string, view?: string) {
  let out = href;
  const params: string[] = [];
  if (sort && sort !== "new") params.push(`sort=${encodeURIComponent(sort)}`);
  if (view && view !== "default") params.push(`view=${encodeURIComponent(view)}`);
  if (params.length) {
    const join = out.includes("?") ? "&" : "?";
    out = `${out}${join}${params.join("&")}`;
  }
  return out;
}

type Props = {
  current?: string;
  sort?: "new" | "hot";
  view?: string;
};

export function DiscoveryTypeChips({ current, sort = "new", view }: Props) {
  const tSearch = useTranslations("pages.search");
  const tPost = useTranslations("postType");

  return (
    <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Link
        href={withSortAndView("/home", sort, view)}
        className={clsx(
          "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          !current
            ? "border-brand-300 bg-brand-50 text-brand-900 shadow-sm"
            : "border-zinc-200/80 bg-white/70 text-zinc-600 hover:border-zinc-300",
        )}
      >
        {tSearch("all")}
      </Link>
      {DISCOVERY_FEED_TYPES.map((pt) => (
        <Link
          key={pt}
          href={withSortAndView(`/home?type=${encodeURIComponent(pt)}`, sort, view)}
          className={clsx(
            "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
            current === pt
              ? "border-brand-300 bg-brand-50 text-brand-900 shadow-sm"
              : "border-zinc-200/80 bg-white/70 text-zinc-600 hover:border-zinc-300",
          )}
        >
          {getPostTypeLabel(tPost, pt)}
        </Link>
      ))}
    </div>
  );
}
