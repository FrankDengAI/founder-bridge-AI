"use client";

import { Link } from "@/i18n/navigation";
import { Cpu, MessageCircle, Sparkles, Users } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  modelCount?: number;
  reviewCount?: number;
};

const CARD_KEYS = ["modelRanking", "findPartner", "discussion"] as const;

const CARD_META = {
  modelRanking: {
    href: "/models",
    icon: Cpu,
    tone: "from-violet-600 to-fuchsia-600",
    ring: "ring-violet-200/70",
  },
  findPartner: {
    href: "/match",
    icon: Users,
    tone: "from-sky-600 to-cyan-600",
    ring: "ring-cyan-200/70",
  },
  discussion: {
    href: "/publish?type=MODEL_DISCUSSION",
    icon: MessageCircle,
    tone: "from-amber-500 to-rose-500",
    ring: "ring-amber-200/70",
  },
} as const;

export function HomeCommunityHub({ modelCount = 0, reviewCount = 0 }: Props) {
  const t = useTranslations("homeUi.communityHub");

  return (
    <section className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-2 px-0.5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-700">
            {t("label")}
          </p>
          <h2 className="text-sm font-bold text-zinc-950">{t("title")}</h2>
        </div>
        {modelCount > 0 ? (
          <p className="text-[10px] text-zinc-500">
            {t.rich("stats", {
              modelCount,
              reviewCount,
              strong: (chunks) => <strong className="text-violet-800">{chunks}</strong>,
            })}
          </p>
        ) : null}
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {CARD_KEYS.map((key) => {
          const meta = CARD_META[key];
          const Icon = meta.icon;
          return (
            <Link
              key={meta.href}
              href={meta.href}
              className={`group relative overflow-hidden rounded-2xl bg-white/90 p-3 ring-1 ${meta.ring} transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(109,40,217,0.45)]`}
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${meta.tone} opacity-20 blur-2xl transition group-hover:opacity-35`}
              />
              <span
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${meta.tone} text-white shadow-sm`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <p className="relative mt-2 text-xs font-bold text-zinc-950">
                {t(`cards.${key}.title`)}
              </p>
              <p className="relative mt-1 line-clamp-2 text-[10px] leading-relaxed text-zinc-600">
                {t(`cards.${key}.desc`)}
              </p>
              <span className="relative mt-2 inline-flex items-center gap-0.5 text-[10px] font-semibold text-violet-800">
                {t(`cards.${key}.cta`)}
                <Sparkles className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
