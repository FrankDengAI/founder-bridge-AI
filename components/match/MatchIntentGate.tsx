"use client";

import { useTranslations } from "next-intl";
import { Users, UserSearch } from "lucide-react";
import type { MatchIntent } from "@/lib/matchUiCopy";
import clsx from "clsx";

type Props = {
  value: MatchIntent | null;
  onSelect: (intent: MatchIntent) => void;
};

export function MatchIntentGate({ value, onSelect }: Props) {
  const te = useTranslations("matchExtra");

  const options: {
    intent: MatchIntent;
    icon: typeof Users;
    titleKey: "intentPartnerTitle" | "intentRecruitTitle";
    descKey: "intentPartnerDesc" | "intentRecruitDesc";
  }[] = [
    {
      intent: "PARTNER",
      icon: Users,
      titleKey: "intentPartnerTitle",
      descKey: "intentPartnerDesc",
    },
    {
      intent: "RECRUIT",
      icon: UserSearch,
      titleKey: "intentRecruitTitle",
      descKey: "intentRecruitDesc",
    },
  ];

  return (
    <section className="space-y-3 rounded-3xl bg-white/80 p-4 shadow-soft ring-1 ring-white/70 backdrop-blur">
      <p className="text-sm font-semibold text-zinc-900">{te("intentGateTitle")}</p>
      <p className="text-[11px] leading-relaxed text-zinc-500">{te("intentGateHint")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map(({ intent, icon: Icon, titleKey, descKey }) => {
          const active = value === intent;
          return (
            <button
              key={intent}
              type="button"
              onClick={() => onSelect(intent)}
              className={clsx(
                "flex flex-col rounded-2xl border px-4 py-4 text-left transition",
                active
                  ? "border-violet-400 bg-violet-50 shadow-sm ring-1 ring-violet-200/60"
                  : "border-zinc-200/90 bg-white/60 hover:border-violet-200 hover:bg-violet-50/30",
              )}
            >
              <span
                className={clsx(
                  "inline-flex h-10 w-10 items-center justify-center rounded-xl",
                  active
                    ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white"
                    : "bg-zinc-100 text-zinc-600",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="mt-3 text-sm font-semibold text-zinc-900">{te(titleKey)}</span>
              <span className="mt-1 text-[11px] leading-relaxed text-zinc-600">{te(descKey)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
