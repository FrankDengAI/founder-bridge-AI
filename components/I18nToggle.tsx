"use client";

import { useEffect, useState } from "react";
import { readLocale, writeLocale, type Locale } from "@/lib/i18n";

export function I18nToggle() {
  const [locale, setLocale] = useState<Locale>("zh");

  useEffect(() => {
    setLocale(readLocale());
    const on = () => setLocale(readLocale());
    window.addEventListener("vibe-locale-updated", on);
    return () => window.removeEventListener("vibe-locale-updated", on);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        const next: Locale = locale === "zh" ? "en" : "zh";
        writeLocale(next);
        setLocale(next);
      }}
      className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-700 ring-1 ring-zinc-200/80 hover:bg-white"
      title="切换中/英（演示：部分页面）"
    >
      {locale === "zh" ? "EN" : "中文"}
    </button>
  );
}
