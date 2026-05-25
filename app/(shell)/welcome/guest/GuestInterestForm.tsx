"use client";

import { useState } from "react";
import clsx from "clsx";
import { INTEREST_OPTIONS } from "@/lib/interestPool";
import { syncLocalUserId } from "@/lib/clientSession";
import { writePersona } from "@/lib/retention";
import { completeActivationStep } from "@/lib/activation";

export function GuestInterestForm() {
  const [tags, setTags] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const toggle = (t: string) => {
    setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));
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
        throw new Error(j.error || "创建失败");
      }
      const data = (await res.json()) as { userId: string };
      syncLocalUserId(data.userId);
      writePersona("student");
      completeActivationStep("persona");
      window.location.href = "/home";
    } catch (e) {
      setErr(e instanceof Error ? e.message : "创建失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => toggle(t)}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              tags.includes(t)
                ? "border-violet-400 bg-violet-50 text-violet-900"
                : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      {err ? <p className="text-sm font-medium text-red-600">{err}</p> : null}
      <button
        type="button"
        disabled={tags.length === 0 || busy}
        onClick={() => void submit()}
        className="w-full rounded-full bg-zinc-900 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-800 disabled:opacity-50"
      >
        {busy ? "创建中…" : "进入应用"}
      </button>
    </div>
  );
}
