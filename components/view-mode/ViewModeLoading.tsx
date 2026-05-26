"use client";

import { useTranslations } from "next-intl";

export function ViewModeLoading({ message }: { message?: string }) {
  const t = useTranslations("common");
  const text = message ?? t("loading");
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 animate-ping rounded-full bg-violet-400/30" />
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-xs font-bold text-white shadow-lg">
          VC
        </div>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{text}</p>
    </div>
  );
}
