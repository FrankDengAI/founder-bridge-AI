"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { POST_TYPES } from "@/lib/domain/postType";
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
  /** 与类型筛选组合，保留排序 */
  sort?: "new" | "hot";
  view?: string;
};

export function HomeTypeFilters({ current, sort = "new", view }: Props) {
  const tSearch = useTranslations("pages.search");
  const tPost = useTranslations("postType");

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Link
        href={withSortAndView("/home", sort, view)}
        className={clsx(
          "shrink-0 rounded-full border px-3 py-1.5 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          !current
            ? "border-brand-300 bg-brand-50 text-brand-900 shadow-sm"
            : "border-zinc-200/80 bg-white/70 text-zinc-600 hover:border-zinc-300",
        )}
      >
        {tSearch("all")}
      </Link>
      {POST_TYPES.map((pt) => (
        <Link
          key={pt}
          href={withSortAndView(`/home?type=${encodeURIComponent(pt)}`, sort, view)}
          className={clsx(
            "shrink-0 rounded-full border px-3 py-1.5 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
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
