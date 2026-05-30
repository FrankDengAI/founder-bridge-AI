"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { FileEdit, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { clearPublishDraftLocal, readPublishDraftLocal } from "@/lib/retention";

export function PublishDraftBanner() {
  const t = useTranslations("retention.draft");
  const [has, setHas] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const d = readPublishDraftLocal();
      const title = typeof d?.title === "string" ? d.title.trim() : "";
      const body = typeof d?.body === "string" ? d.body.trim() : "";
      setHas(title.length > 0 || body.length > 0);
    };
    refresh();
    window.addEventListener("vibe-publish-draft-updated", refresh);
    return () => window.removeEventListener("vibe-publish-draft-updated", refresh);
  }, []);

  if (!has) return null;

  return (
    <section className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-3 py-2 ring-1 ring-zinc-200/80">
      <FileEdit className="h-4 w-4 shrink-0 text-zinc-600" />
      <p className="min-w-0 flex-1 text-[11px] font-medium text-zinc-800">{t("banner")}</p>
      <Link
        href="/publish"
        className="shrink-0 rounded-lg bg-zinc-900 px-2.5 py-1 text-[10px] font-bold text-white"
      >
        {t("continue")}
      </Link>
      <button
        type="button"
        aria-label={t("close")}
        onClick={() => {
          clearPublishDraftLocal();
          setHas(false);
        }}
        className="shrink-0 rounded-lg p-1 text-zinc-500 hover:bg-zinc-200"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </section>
  );
}
