"use client";

import { useTranslations } from "next-intl";

const SECTION_KEYS = ["match", "pulse", "market", "stories"] as const;
const SECTION_HREFS: Record<(typeof SECTION_KEYS)[number], string> = {
  match: "#match",
  pulse: "#pulse",
  market: "#market",
  stories: "#stories",
};

export function WebShowcaseJumpStrip() {
  const t = useTranslations("marketingSite.showcase");

  return (
    <section
      id="showcase"
      aria-label={t("ariaLabel")}
      className="scroll-mt-20 border-y border-violet-200/60 bg-gradient-to-r from-violet-50/80 via-white to-fuchsia-50/60 py-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-zinc-600">
          <span className="font-semibold text-zinc-900">{t("label")}</span>
          <span className="mx-2 text-zinc-300">·</span>
          {t("hint")}
        </p>
        <div className="flex flex-wrap gap-2">
          {SECTION_KEYS.map((key) => (
            <a
              key={key}
              href={SECTION_HREFS[key]}
              className="rounded-full border border-violet-200/80 bg-white px-3 py-1 text-[11px] font-semibold text-violet-900 shadow-sm transition hover:border-violet-400 hover:bg-violet-50"
            >
              {t(`sections.${key}`)}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
