import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { MessagesClient } from "./MessagesClient";

export const dynamic = "force-dynamic";

async function MessagesLoadingFallback() {
  const t = await getTranslations("pages.messages");
  return (
    <div className="glass-panel rounded-3xl p-6 text-sm text-zinc-600 shadow-sm">
      {t("loading")}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<MessagesLoadingFallback />}>
      <MessagesClient />
    </Suspense>
  );
}
