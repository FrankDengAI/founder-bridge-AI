"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Bell, Brush, Database, Keyboard, LogOut } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  LS_LEARN_STEPS,
  LS_RECENT_ROUTES,
  LS_SAVED_POSTS,
} from "@/lib/appHub";
import { clearRetentionLocalData } from "@/lib/retention";
import { performLogout } from "@/lib/authLogout";
import { ViewModeSettingsPanel } from "@/components/view-mode/ViewModeSettingsPanel";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { UiToast } from "@/components/ui/UiToast";

const LS_NOTIFS = "vibe_notifs_v1";
const LS_GAMIFY = "vibe_gamify_events";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const [notify, setNotify] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("vibe_theme", "light");
    setNotify(localStorage.getItem("vibe_notify") !== "0");

    const onMode = (e: Event) => {
      const detail = (e as CustomEvent<{ label?: string }>).detail;
      setToast(t("modeSwitched", { label: detail?.label ?? "…" }));
    };
    window.addEventListener("vbc-view-mode-changed", onMode);
    return () => window.removeEventListener("vbc-view-mode-changed", onMode);
  }, [t]);

  const toggleNotify = () => {
    const next = !notify;
    setNotify(next);
    localStorage.setItem("vibe_notify", next ? "1" : "0");
    setToast(next ? t("notifyToastOn") : t("notifyToastOff"));
  };

  const clearDemo = () => {
    localStorage.removeItem("vibe_github_demo_connected");
    sessionStorage.removeItem("vibe_dismissed_reply_banners");
    localStorage.removeItem(LS_RECENT_ROUTES);
    localStorage.removeItem(LS_SAVED_POSTS);
    localStorage.removeItem(LS_LEARN_STEPS);
    localStorage.removeItem(LS_NOTIFS);
    localStorage.removeItem(LS_GAMIFY);
    localStorage.removeItem("vibe_visit_counts");
    localStorage.removeItem("vibe_activation");
    localStorage.removeItem("vibe_demo_retention_done");
    clearRetentionLocalData();
    setToast(t("clearDataToast"));
  };

  return (
    <div className="space-y-3 pb-6">
      <PageHeader title={t("title")} subtitle={t("subtitle")} backHref="/me" />
      <UiToast message={toast} />

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <p className="text-sm font-semibold text-zinc-950">{t("languageSection")}</p>
        <p className="mt-1 text-xs text-zinc-600">{t("languageSectionDesc")}</p>
        <div className="mt-3">
          <LocaleSwitcher variant="settings" />
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <p className="text-sm font-semibold text-zinc-950">{t("experienceMode")}</p>
        <p className="mt-1 text-xs text-zinc-600">{t("experienceModeDesc")}</p>
        <ViewModeSettingsPanel />
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-zinc-950">{t("logoutSection")}</p>
            <p className="mt-1 text-xs text-zinc-600">{t("logoutDesc")}</p>
          </div>
          <button
            type="button"
            onClick={() => void performLogout()}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2 text-xs font-semibold text-white hover:opacity-95 active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            {t("logoutBtn")}
          </button>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950">
          <Keyboard className="h-4 w-4 text-brand-700" />
          {t("shortcuts")}
        </div>
        <ul className="mt-3 space-y-2 text-xs text-zinc-700">
          <li className="flex items-center justify-between gap-2 rounded-xl bg-white/60 px-3 py-2 ring-1 ring-zinc-200/60">
            <span>{t("shortcutPalette")}</span>
            <kbd className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[10px]">⌘/Ctrl + K</kbd>
          </li>
          <li className="flex items-center justify-between gap-2 rounded-xl bg-white/60 px-3 py-2 ring-1 ring-zinc-200/60">
            <span>{t("shortcutDiscover")}</span>
            <span className="text-[10px] text-zinc-500">{t("shortcutPaletteHint")}</span>
          </li>
        </ul>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-zinc-950">{t("notify")}</p>
            <p className="text-xs text-zinc-600">{t("notifyDesc")}</p>
          </div>
          <button
            type="button"
            onClick={toggleNotify}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-zinc-900 ring-1 ring-zinc-200/80"
          >
            <Bell className="h-4 w-4" />
            {notify ? t("notifyOn") : t("notifyOff")}
          </button>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-zinc-950">{t("clearData")}</p>
            <p className="text-xs text-zinc-600">{t("clearDataDesc")}</p>
          </div>
          <button
            type="button"
            onClick={clearDemo}
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
          >
            <Database className="h-4 w-4" />
            {t("clearData")}
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-rose-200/70 bg-rose-50/50 p-4 shadow-sm ring-1 ring-rose-100/80">
        <p className="text-sm font-bold text-rose-900">{t("logoutAgainTitle")}</p>
        <p className="mt-1 text-xs text-rose-800/90">
          {t("logoutAgainDesc")}
        </p>
        <button
          type="button"
          onClick={() => void performLogout()}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3 text-sm font-bold text-white shadow-md transition hover:bg-rose-700 active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" />
          {t("logoutAgainBtn")}
        </button>
      </section>

      <div className="glass-panel rounded-3xl p-4 text-xs leading-relaxed text-zinc-700 shadow-sm ring-1 ring-white/70">
        <div className="flex items-center gap-2 font-semibold text-zinc-950">
          <Brush className="h-4 w-4 text-brand-700" />
          {t("nextSteps")}
        </div>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>{t("nextAccount")}</li>
          <li>{t("nextPush")}</li>
          <li>{t("nextPrivacy")}</li>
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/learn/github" className="text-brand-800 hover:underline">
            {t("githubChecklist")}
          </Link>
          <span className="text-zinc-300">·</span>
          <Link href="/messages" className="text-brand-800 hover:underline">
            {t("backMessages")}
          </Link>
        </div>
      </div>
    </div>
  );
}
