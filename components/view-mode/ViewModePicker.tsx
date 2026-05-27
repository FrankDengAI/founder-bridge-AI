"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowRight, LayoutGrid, Loader2, Monitor, Smartphone, Sparkles } from "lucide-react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { localizedPath } from "@/lib/localePath";
import { formatNextPathLabel, safeNextPath, setViewMode, type ViewMode } from "@/lib/viewMode";

function AppPreview() {
  return (
    <div className="mx-auto w-[120px] rounded-[1.75rem] border-[5px] border-zinc-800 bg-zinc-900 p-1.5 shadow-2xl">
      <div className="overflow-hidden rounded-[1.35rem] bg-gradient-to-b from-violet-100 to-fuchsia-50 dark:from-zinc-800 dark:to-zinc-900">
        <div className="h-3 bg-zinc-800/90" />
        <div className="space-y-1.5 p-2">
          <div className="h-8 rounded-lg bg-white/80 shadow-sm" />
          <div className="grid grid-cols-2 gap-1">
            <div className="h-10 rounded-md bg-violet-200/70" />
            <div className="h-10 rounded-md bg-fuchsia-200/60" />
          </div>
        </div>
        <div className="mx-2 mb-2 flex justify-around rounded-full bg-white/90 py-1 shadow-inner">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={clsx("h-1.5 w-1.5 rounded-full", i === 0 ? "bg-violet-500" : "bg-zinc-300")} />
          ))}
        </div>
      </div>
    </div>
  );
}

function WebPreview() {
  return (
    <div className="mx-auto w-full max-w-[200px] rounded-xl border border-zinc-200/80 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      <div className="grid h-28 grid-cols-[2fr_5fr_2fr] gap-1">
        <div className="space-y-1 rounded bg-violet-100/80 p-1 dark:bg-violet-950/50">
          <div className="h-1.5 w-full rounded bg-violet-400/60" />
          <div className="h-1 w-3/4 rounded bg-violet-300/50" />
          <div className="h-1 w-2/3 rounded bg-violet-300/40" />
        </div>
        <div className="space-y-1 rounded bg-zinc-50 p-1 dark:bg-zinc-800/80">
          <div className="h-2 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="grid grid-cols-2 gap-0.5">
            <div className="h-6 rounded bg-violet-200/60" />
            <div className="h-6 rounded bg-fuchsia-200/50" />
            <div className="h-6 rounded bg-sky-200/50" />
            <div className="h-6 rounded bg-amber-200/40" />
          </div>
        </div>
        <div className="space-y-1 rounded bg-fuchsia-50/80 p-1 dark:bg-fuchsia-950/30">
          <div className="h-1.5 w-full rounded bg-fuchsia-300/50" />
          <div className="h-1 w-full rounded bg-fuchsia-200/40" />
        </div>
      </div>
    </div>
  );
}

const MODES: ViewMode[] = ["app", "web"];

export function ViewModePicker() {
  const locale = useLocale();
  const tWelcome = useTranslations("welcome");
  const tVm = useTranslations("viewMode");
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  const nextLabel = formatNextPathLabel(next);
  const [busy, setBusy] = useState<ViewMode | null>(null);
  const [preferWeb, setPreferWeb] = useState(false);

  const options = useMemo(
    () =>
      MODES.map((mode) => ({
        mode,
        title: tVm(mode === "app" ? "app" : "web"),
        Icon: mode === "app" ? Smartphone : LayoutGrid,
        accent:
          mode === "app"
            ? "from-violet-600 via-fuchsia-600 to-violet-700"
            : "from-sky-600 via-violet-600 to-fuchsia-600",
        features: [
          tVm(mode === "app" ? "appFeature1" : "webFeature1"),
          tVm(mode === "app" ? "appFeature2" : "webFeature2"),
          tVm(mode === "app" ? "appFeature3" : "webFeature3"),
        ] as string[],
        desc: tVm(mode === "app" ? "appDesc" : "webDesc"),
      })),
    [tVm],
  );

  useEffect(() => {
    setPreferWeb(typeof window !== "undefined" && window.innerWidth >= 1024);
  }, []);

  const choose = (mode: ViewMode) => {
    if (busy) return;
    setBusy(mode);
    setViewMode(mode);
    window.location.href = localizedPath(next, locale);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <div className="text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/60 bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700">
          <Sparkles className="h-3.5 w-3.5" />
          {tWelcome("modeSameContent")}
        </p>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {tWelcome("modeTitle")}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-zinc-600">
          {tWelcome("modeSubtitle")}
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white/80 px-3 py-1.5 text-xs text-zinc-700 ring-1 ring-zinc-200/80">
          <Monitor className="h-3.5 w-3.5 text-violet-600" />
          {tWelcome("modeEntering", { target: nextLabel })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((opt) => {
          const Icon = opt.Icon;
          const loading = busy === opt.mode;
          const recommend = preferWeb ? opt.mode === "web" : opt.mode === "app";
          return (
            <button
              key={opt.mode}
              type="button"
              disabled={Boolean(busy)}
              onClick={() => choose(opt.mode)}
              className={clsx(
                "welcome-glass group relative overflow-hidden rounded-3xl p-5 text-left transition duration-300 active:scale-[0.98]",
                "hover:-translate-y-1 hover:shadow-[0_0_56px_-8px_rgba(167,139,250,0.55)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                busy && busy !== opt.mode && "opacity-45",
              )}
            >
              {recommend ? (
                <span className="absolute right-3 top-3 rounded-full bg-amber-400/90 px-2 py-0.5 text-[10px] font-bold text-amber-950 shadow">
                  {tWelcome("modeRecommend")}
                </span>
              ) : null}

              <div className="flex min-h-[130px] items-center justify-center py-2">
                {opt.mode === "app" ? <AppPreview /> : <WebPreview />}
              </div>

              <div className="mt-4 flex items-start gap-3">
                <span
                  className={clsx(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
                    opt.accent,
                  )}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-zinc-900">{opt.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-600">{opt.desc}</p>
                  <ul className="mt-2 space-y-0.5">
                    {opt.features.map((f) => (
                      <li key={f} className="text-[10px] text-zinc-500">
                        · {f}
                      </li>
                    ))}
                  </ul>
                </div>
                {!loading ? (
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-zinc-500 transition group-hover:translate-x-0.5 group-hover:text-violet-600" />
                ) : null}
              </div>

              <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-wider text-violet-600/90">
                {loading ? tVm("entering") : opt.title}
              </p>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs leading-relaxed text-zinc-500">{tWelcome("modeFooter")}</p>
    </div>
  );
}
