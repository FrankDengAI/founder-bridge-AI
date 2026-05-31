"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Copy } from "lucide-react";

export function TemplateCopyButton({ cmd }: { cmd: string }) {
  const t = useTranslations("templateCopy");
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(cmd);
          setOk(true);
          window.setTimeout(() => setOk(false), 1600);
        } catch {
          setOk(false);
        }
      }}
      className="inline-flex items-center gap-1 rounded-xl bg-violet-100 px-3 py-2 text-[11px] font-semibold text-violet-900 ring-1 ring-violet-200/70"
    >
      <Copy className="h-3.5 w-3.5" />
      {ok ? t("copied") : t("copyCmd")}
    </button>
  );
}
