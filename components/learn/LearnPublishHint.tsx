"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLearnProgress } from "@/lib/hooks/useLearnProgress";

export function LearnPublishHint() {
  const t = useTranslations("learn");
  const { loading, complete, nextStep } = useLearnProgress();

  if (loading || complete || nextStep >= 8) return null;

  return (
    <p className="rounded-xl bg-violet-50 px-3 py-2 text-[11px] text-violet-900 ring-1 ring-violet-200/70">
      {t("publishHint")}{" "}
      <Link href={`/learn/step/${nextStep}`} className="font-semibold underline">
        {t("publishHintLink")}
      </Link>
    </p>
  );
}
