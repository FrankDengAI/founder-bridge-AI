"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { getDefaultBackHref } from "@/lib/navBack";

type Props = {
  href?: string;
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
};

export function BackButton({ href, className, iconClassName, onClick }: Props) {
  const pathname = usePathname() ?? "/home";
  const t = useTranslations("common");
  const target = href ?? getDefaultBackHref(pathname);

  return (
    <Link
      href={target}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center justify-center rounded-panel bg-white/70 text-zinc-700 ring-1 ring-zinc-200/80 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        className,
      )}
      aria-label={t("back")}
    >
      <ChevronLeft className={clsx("h-4 w-4", iconClassName)} />
    </Link>
  );
}
