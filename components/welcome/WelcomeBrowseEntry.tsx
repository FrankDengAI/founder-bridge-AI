"use client";

import { Compass } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** 欢迎页「先逛发现」入口（未登录主路径） */
export function WelcomeBrowseEntry() {
  const t = useTranslations("welcome");

  return (
    <Link
      href="/home"
      className="welcome-glass group relative z-10 flex items-center gap-4 rounded-3xl border border-violet-300/50 bg-gradient-to-br from-violet-50/90 to-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_56px_-8px_rgba(167,139,250,0.55)] active:scale-[0.99]"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg ring-1 ring-white/20 transition group-hover:scale-105">
        <Compass className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="text-lg font-bold text-zinc-900">{t("browseFirst")}</p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-600">{t("browseFirstDesc")}</p>
      </div>
    </Link>
  );
}
