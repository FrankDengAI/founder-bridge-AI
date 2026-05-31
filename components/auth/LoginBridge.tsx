"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/app/[locale]/(shell)/welcome/login/LoginForm";
import {
  isExternalMiniapp,
  miniappOrigin,
} from "@/lib/miniappOrigin";
import { useAppEntryHref } from "@/lib/hooks/useAppEntryHref";
import { localizedPath, modePickerHref } from "@/lib/localePath";
import { VBC_AUTH_POST_MESSAGE } from "@/lib/constants";

function loginEmbedSrc(locale: string, external: boolean, app: string): string {
  const path = localizedPath("/welcome/login", locale);
  const qs = "?embed=1";
  if (!external) return `${path}${qs}`;
  if (!app) return `${path}${qs}`;
  return `${app.replace(/\/$/, "")}${path}${qs}`;
}

function LoginBridgeInner() {
  const t = useTranslations("loginBridge");
  const locale = useLocale();
  const app = miniappOrigin();
  const external = isExternalMiniapp();
  const appEntry = useAppEntryHref();
  const iframeSrc = useMemo(
    () => loginEmbedSrc(locale, external, app),
    [locale, external, app],
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let expected: string;
    try {
      expected = external && app ? new URL(app).origin : window.location.origin;
    } catch {
      return;
    }
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type !== VBC_AUTH_POST_MESSAGE) return;
      if (e.origin !== expected) return;
      setDone(true);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [external, app]);

  const homeHref =
    external && app
      ? `${app.replace(/\/$/, "")}${modePickerHref("/home", locale)}`
      : appEntry("/home");

  if (!external) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg flex-col gap-6 px-4 pb-16 pt-8 sm:pt-12">
        <Link
          href="/"
          className="inline-flex w-fit text-sm font-medium text-zinc-500 transition hover:text-violet-700"
        >
          ← {t("backHome")}
        </Link>
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg flex-col gap-6 px-4 pb-16 pt-8 sm:pt-12">
      <Link
        href="/"
        className="inline-flex w-fit text-sm font-medium text-zinc-500 transition hover:text-violet-700"
      >
        ← {t("backHome")}
      </Link>

      <div className="text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {external ? t("descExternal") : t("descSameOrigin")}
        </p>
      </div>

      {done ? (
        <AuthCard>
          <p className="text-center text-sm font-medium text-zinc-700">{t("loginSuccess")}</p>
          <a
            href={homeHref}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="mt-5 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3.5 text-sm font-semibold text-white transition hover:opacity-95"
          >
            {t("openAppHome")}
          </a>
          <p className="mt-3 text-center text-xs text-zinc-500">{t("dbHint")}</p>
        </AuthCard>
      ) : (
        <div className="mx-auto w-full max-w-sm space-y-4">
          <>
            <div className="rounded-[2rem] border border-violet-200/60 bg-white/90 p-2 shadow-[0_24px_60px_-24px_rgba(139,92,246,0.25)] backdrop-blur-md">
              <div className="overflow-hidden rounded-[1.65rem] bg-white ring-1 ring-zinc-200/80">
                <iframe
                  title={t("iframeTitle")}
                  src={iframeSrc}
                  className="h-[min(72vh,640px)] w-full min-h-[480px] border-0"
                  sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                />
              </div>
            </div>
            <details className="rounded-xl border border-violet-200/60 bg-violet-50/50 px-3 py-2 text-[11px] text-zinc-600">
              <summary className="cursor-pointer select-none font-medium text-zinc-800">
                {t("troubleshootSummary")}
              </summary>
              <ul className="mt-2 list-disc space-y-1 pl-4 leading-relaxed">
                <li>{t("troubleshootDb")}</li>
                <li>{t("troubleshootSeed")}</li>
                {external ? (
                  <li>{t("troubleshootCrossDomain")}</li>
                ) : (
                  <li>{t("troubleshootSameOrigin")}</li>
                )}
              </ul>
            </details>
          </>

          <p className="text-center text-[11px] leading-relaxed text-slate-500">{t("footerNote")}</p>
        </div>
      )}
    </div>
  );
}

function LoginBridgeFallback() {
  const t = useTranslations("loginBridge");
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg items-center justify-center px-4">
      <p className="text-sm text-zinc-500">{t("loading")}</p>
    </div>
  );
}

export function LoginBridge() {
  return (
    <Suspense fallback={<LoginBridgeFallback />}>
      <LoginBridgeInner />
    </Suspense>
  );
}
