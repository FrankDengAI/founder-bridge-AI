"use client";

import { useState } from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { INTEREST_OPTIONS } from "@/lib/interestPool";
import { syncLocalUserId } from "@/lib/clientSession";
import { writePersona } from "@/lib/retention";
import { completeActivationStep } from "@/lib/activation";
import { useModePickerHref } from "@/lib/hooks/useModePickerHref";

export function GuestInterestForm() {
  const t = useTranslations("authGuest");
  const [tags, setTags] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const modeHref = useModePickerHref();

  const toggle = (tag: string) => {
    setTags((p) => (p.includes(tag) ? p.filter((x) => x !== tag) : [...p, tag]));
  };

  const submit = async () => {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ interestTags: tags }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || t("createFail"));
      }
      const data = (await res.json()) as { userId: string };
      syncLocalUserId(data.userId);
      writePersona("student");
      completeActivationStep("persona");
      window.location.href = modeHref("/home");
    } catch (e) {
      setErr(e instanceof Error ? e.message : t("createFail"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              tags.includes(tag)
                ? "border-violet-400 bg-violet-50 text-violet-900"
                : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300",
            )}
          >
            {tag}
          </button>
        ))}
      </div>
      {err ? <p className="text-sm font-medium text-red-600">{err}</p> : null}
      <button
        type="button"
        disabled={tags.length === 0 || busy}
        onClick={() => void submit()}
        className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:opacity-50"
      >
        {busy ? t("creating") : t("enterApp")}
      </button>
    </div>
  );
}
