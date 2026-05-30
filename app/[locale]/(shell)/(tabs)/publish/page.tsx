import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { PublishWizard } from "@/components/PublishWizard";

export default async function PublishPage() {
  const t = await getTranslations("publish");

  return (
    <div className="space-y-3">
      <PageHeader title={t("title")} subtitle={t("subtitleFlow")} backHref="/home" />
      <Suspense fallback={<p className="text-xs text-zinc-500">{t("loadingWizard")}</p>}>
        <PublishWizard />
      </Suspense>
    </div>
  );
}
