"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { authFlowQuery } from "@/lib/navBack";
import { safeNextPath } from "@/lib/viewMode";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterWizard } from "./RegisterWizard";

export function RegisterPageClient() {
  const t = useTranslations("welcome");
  const ta = useTranslations("auth");
  const tr = useTranslations("authRegister");
  const tc = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"), "/home");
  const [step, setStep] = useState(0);
  const totalSteps = 4;

  const handleTopBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
      return;
    }
    router.push(next);
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
      <button
        type="button"
        onClick={handleTopBack}
        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
      >
        ← {step > 0 ? tc("back") : tr("backToDiscovery")}
      </button>

      <div className="rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-600/8 via-white to-fuchsia-600/8 p-5 shadow-sm ring-1 ring-white/80">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-900">
          <Sparkles className="h-3.5 w-3.5" />
          {tr("heroBadge")}
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950">{tr("heroTitle")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{tr("heroDesc")}</p>
        <ul className="mt-4 space-y-2 text-xs text-zinc-700">
          <li className="flex gap-2">
            <span className="text-violet-600">✓</span>
            {tr("heroPoint1")}
          </li>
          <li className="flex gap-2">
            <span className="text-violet-600">✓</span>
            {tr("heroPoint2")}
          </li>
          <li className="flex gap-2">
            <span className="text-violet-600">✓</span>
            {tr("heroPoint3")}
          </li>
        </ul>
      </div>

      <AuthCard>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-zinc-900">{t("registerTitle")}</h2>
          <p className="mt-1 text-sm text-zinc-500">{t("registerDesc")}</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all duration-300"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] font-medium text-zinc-500">
            {tr("stepProgress", { current: step + 1, total: totalSteps })}
          </p>
        </div>

        <RegisterWizard step={step} onStepChange={setStep} />

        <p className="mt-6 border-t border-zinc-100 pt-4 text-center text-xs text-zinc-500">
          {ta("hasAccount")}{" "}
          <Link
            href={`/welcome/login${authFlowQuery(next)}`}
            className="font-semibold text-violet-700 hover:underline"
          >
            {ta("goLogin")}
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
