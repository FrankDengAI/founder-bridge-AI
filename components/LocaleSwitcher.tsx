"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import clsx from "clsx";
import type { AppLocale } from "@/i18n/routing";

type Props = {
  variant?: "compact" | "settings";
  className?: string;
};

export function LocaleSwitcher({ variant = "compact", className }: Props) {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  const switchTo = (next: AppLocale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
    router.refresh();
  };

  if (variant === "settings") {
    return (
      <div className={clsx("grid grid-cols-2 gap-2", className)}>
        {(["zh", "en"] as const).map((loc) => {
          const active = locale === loc;
          return (
            <button
              key={loc}
              type="button"
              onClick={() => switchTo(loc)}
              className={clsx(
                "rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition",
                active
                  ? "border-violet-400 bg-violet-50 text-violet-900 ring-1 ring-violet-200 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-100"
                  : "border-zinc-200/80 bg-white/60 text-zinc-700 hover:border-violet-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300",
              )}
            >
              {loc === "zh" ? t("languageZh") : t("languageEn")}
              {active ? (
                <span className="ml-1.5 text-[10px] font-bold text-violet-600">✓</span>
              ) : null}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => switchTo(locale === "zh" ? "en" : "zh")}
      className={clsx(
        "rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-700 ring-1 ring-zinc-200/80 transition hover:bg-white hover:ring-violet-300 active:scale-95",
        className,
      )}
      title={locale === "zh" ? t("switchToEn") : t("switchToZh")}
    >
      {locale === "zh" ? "EN" : "中文"}
    </button>
  );
}
