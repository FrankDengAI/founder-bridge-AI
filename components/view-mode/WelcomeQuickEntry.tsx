"use client";

import { useEffect, useState } from "react";
import { LayoutGrid } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useModePickerHref } from "@/lib/hooks/useModePickerHref";

export function WelcomeQuickEntry() {
  const t = useTranslations("welcomeQuick");
  const modeHref = useModePickerHref();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    void fetch("/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d: { userId?: string | null }) => setLoggedIn(Boolean(d.userId)))
      .catch(() => setLoggedIn(false));
  }, []);

  if (!loggedIn) return null;

  return (
    <Link
      href={modeHref("/home")}
      className="welcome-glass group relative z-10 flex items-center gap-4 rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_56px_-8px_rgba(167,139,250,0.55)]"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 text-white shadow-lg ring-1 ring-white/20">
        <LayoutGrid className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="text-lg font-bold text-zinc-900">{t("enterExperience")}</p>
        <p className="mt-1 text-sm text-zinc-600">{t("loggedInHint")}</p>
      </div>
    </Link>
  );
}
