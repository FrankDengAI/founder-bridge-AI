"use client";

import { Crown, Flame, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { RailPanel } from "./RailPanel";

type HotPost = { id: string; title: string; likes: number };
type HotTool = { id: string; name: string; avgRating: number };
type HotModel = {
  id: string;
  name: string;
  provider: string;
  avgRating: number;
  reviewCount: number;
};

type Props = {
  hotPosts?: HotPost[];
  hotTools?: HotTool[];
  hotModels?: HotModel[];
  index?: number;
};

export function RailHotList({
  hotPosts = [],
  hotTools = [],
  hotModels = [],
  index = 2,
}: Props) {
  const t = useTranslations("rail");
  const tw = useTranslations("webShell");

  if (hotPosts.length === 0 && hotTools.length === 0 && hotModels.length === 0) return null;

  return (
    <RailPanel
      title={t("hotList.title")}
      purpose={t("hotList.purpose")}
      icon={<Flame className="h-4 w-4 text-orange-500" />}
      index={index}
    >
      {hotPosts.length > 0 ? (
        <div>
          <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            <TrendingUp className="h-3 w-3" />
            {tw("hotPosts")}
          </p>
          <ul className="mt-2 space-y-1.5">
            {hotPosts.map((p, i) => (
              <li key={p.id}>
                <Link
                  href={`/post/${p.id}`}
                  className="group flex items-start gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-700 transition hover:bg-violet-50 hover:text-violet-800"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                      i === 0
                        ? "bg-amber-100 text-amber-800"
                        : i === 1
                          ? "bg-zinc-100 text-zinc-600"
                          : "bg-zinc-50 text-zinc-500"
                    }`}
                  >
                    {i === 0 ? <Crown className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className="line-clamp-2 transition group-hover:translate-x-0.5">{p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {hotTools.length > 0 ? (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{tw("hotTools")}</p>
          <ul className="mt-2 space-y-1">
            {hotTools.map((tool) => (
              <li key={tool.id}>
                <Link
                  href={`/tools/${tool.id}`}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs text-zinc-700 transition hover:bg-amber-50 hover:text-amber-900"
                >
                  <span className="truncate">{tool.name}</span>
                  <span className="ml-2 shrink-0 font-mono text-[10px] text-amber-700">
                    ★ {tool.avgRating.toFixed(1)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {hotModels.length > 0 ? (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{tw("hotModels")}</p>
          <ul className="mt-2 space-y-1">
            {hotModels.slice(0, 4).map((m) => (
              <li key={m.id}>
                <Link
                  href={`/models/${m.id}`}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs text-zinc-700 transition hover:bg-violet-50 hover:text-violet-800"
                >
                  <span className="truncate">{m.name}</span>
                  <span className="ml-2 shrink-0 font-mono text-[10px] text-violet-700">
                    ★ {m.avgRating.toFixed(1)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </RailPanel>
  );
}
