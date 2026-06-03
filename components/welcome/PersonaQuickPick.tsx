"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useOpenLogin } from "@/lib/hooks/useOpenLogin";
import { completeActivationStep } from "@/lib/activation";
import { useModePickerHref } from "@/lib/hooks/useModePickerHref";

const PRESETS = [
  { id: "student", titleKey: "personaStudent", role: "ADC", href: "/home" },
  { id: "pm", titleKey: "personaPm", role: "SUPPORT", href: "/match" },
  { id: "founder", titleKey: "personaFounder", role: "JUNGLE", href: "/match" },
] as const;

export function PersonaQuickPick() {
  const router = useRouter();
  const openLogin = useOpenLogin();
  const modeHref = useModePickerHref();
  const t = useTranslations("welcome");
  const tDir = useTranslations("welcome.personaDirections");
  const tPw = useTranslations("publishWizard");
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const apply = async (p: (typeof PRESETS)[number]) => {
    setBusy(p.id);
    setErr(null);
    try {
      const me = await fetch("/api/me", { credentials: "include" });
      if (!me.ok) {
        openLogin({ next: p.href, reason: "default" });
        return;
      }
      const j = (await me.json()) as { userId: string | null };
      if (!j.userId) {
        openLogin({ next: p.href, reason: "default" });
        return;
      }
      const label = t(p.titleKey);
      const put = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          role: p.role,
          direction: tDir(p.id),
          intro: `${label} — exploring VibeHub.`,
        }),
      });
      if (!put.ok) {
        const body = (await put.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? t("profileSaveFail"));
      }
      localStorage.setItem("vibe_persona", p.id);
      completeActivationStep("persona");
      window.location.href = modeHref(p.href);
    } catch (e) {
      setErr(e instanceof Error ? e.message : tPw("opFail"));
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="welcome-glass relative z-10 rounded-3xl p-4">
      <p className="text-sm font-bold text-zinc-900">{t("personaTitle")}</p>
      <p className="mt-1 text-xs text-zinc-600">{t("personaDesc")}</p>
      {err ? <p className="mt-2 text-xs text-rose-600">{err}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={Boolean(busy)}
            onClick={() => void apply(p)}
            className="rounded-2xl bg-violet-50 px-3 py-2 text-[11px] font-semibold text-violet-900 ring-1 ring-violet-200/80 transition hover:bg-violet-100 active:scale-95 disabled:opacity-50"
          >
            {busy === p.id ? t("personaSaving") : t(p.titleKey)}
          </button>
        ))}
      </div>
    </section>
  );
}
