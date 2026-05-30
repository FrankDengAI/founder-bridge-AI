"use client";

import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { RailPanel } from "./RailPanel";

export type QuickLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  tone: string;
};

export function RailQuickActions({
  links,
  title,
  purpose,
  index = 1,
}: {
  links: QuickLink[];
  title?: string;
  purpose?: string;
  index?: number;
}) {
  const t = useTranslations("rail");

  return (
    <RailPanel
      title={title ?? t("quickActions.title")}
      purpose={purpose ?? t("quickActions.purpose")}
      index={index}
    >
      <div className="space-y-2">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-white/90 px-3 py-2.5 text-sm font-semibold text-zinc-800 transition duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.tone} text-white shadow-sm transition group-hover:scale-105`}
              >
                <Icon className="h-4 w-4" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </RailPanel>
  );
}
