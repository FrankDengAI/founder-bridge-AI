"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { authFlowQuery } from "@/lib/navBack";
import { safeNextPath } from "@/lib/viewMode";
import { useTranslations } from "next-intl";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterWizard } from "./RegisterWizard";

export function RegisterPageClient() {
  const ta = useTranslations("auth");
  const tr = useTranslations("authRegister");
  const tc = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"), "/home");
  const [step, setStep] = useState(0);

  const handleTopBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
      return;
    }
    router.push(next);
  };

  return (
    <div className="mx-auto w-full max-w-md px-1 pb-8">
      <button
        type="button"
        onClick={handleTopBack}
        className="mb-4 inline-flex w-fit items-center gap-1 rounded-full px-1 py-1 text-sm font-medium text-zinc-600 transition hover:text-violet-800"
      >
        <span aria-hidden>←</span>
        {step > 0 ? tc("back") : tr("backToDiscovery")}
      </button>

      <AuthCard className="overflow-hidden p-0 shadow-[0_28px_80px_-28px_rgba(109,40,217,0.35)] ring-violet-200/50">
        <RegisterWizard step={step} onStepChange={setStep} />

        <p className="border-t border-zinc-100 bg-zinc-50/80 px-5 py-4 text-center text-xs text-zinc-500 sm:px-7">
          {ta("hasAccount")}{" "}
          <Link
            href={`/welcome/login${authFlowQuery(next)}`}
            className="font-semibold text-violet-700 hover:text-violet-900 hover:underline"
          >
            {ta("goLogin")}
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
