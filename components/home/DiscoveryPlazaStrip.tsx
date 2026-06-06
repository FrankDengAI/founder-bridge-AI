"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Compass, Sparkles, Wrench, BookOpen, Flame } from "lucide-react";

const LINKS = [
  { href: "/tools", key: "tools", Icon: Wrench },
  { href: "/models", key: "models", Icon: Flame },
  { href: "/learn", key: "learn", Icon: BookOpen },
  { href: "/match", key: "match", Icon: Sparkles },
  { href: "/home?view=plaza", key: "plaza", Icon: Compass },
] as const;

export function DiscoveryPlazaStrip() {
  const t = useTranslations("pages.homeExtra");

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {LINKS.map(({ href, key, Icon }) => (
        <Link
          key={key}
          href={href}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-zinc-800 ring-1 ring-zinc-200/80"
        >
          <Icon className="h-3 w-3 text-violet-600" />
          {t(`plazaLinks.${key}`)}
        </Link>
      ))}
    </div>
  );
}
