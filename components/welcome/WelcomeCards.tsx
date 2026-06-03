"use client";

import { motion } from "framer-motion";
import { LogIn, Sparkles, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { authFlowQuery } from "@/lib/navBack";
import { PersonaQuickPick } from "@/components/welcome/PersonaQuickPick";
import { WelcomeBrowseEntry } from "@/components/welcome/WelcomeBrowseEntry";
import { WelcomeQuickEntry } from "@/components/view-mode/WelcomeQuickEntry";

type CardDef = {
  href: "/welcome/login" | "/welcome/register" | "/welcome/guest";
  titleKey: "loginTitle" | "registerTitle" | "guestTitle";
  descKey: "loginDesc" | "registerDesc" | "guestDesc";
  icon: typeof LogIn;
  tone: string;
};

const cards: CardDef[] = [
  {
    href: "/welcome/login",
    titleKey: "loginTitle",
    descKey: "loginDesc",
    icon: LogIn,
    tone: "from-brand-600 to-fuchsia-600",
  },
  {
    href: "/welcome/register",
    titleKey: "registerTitle",
    descKey: "registerDesc",
    icon: UserPlus,
    tone: "from-sky-600 to-brand-600",
  },
  {
    href: "/welcome/guest",
    titleKey: "guestTitle",
    descKey: "guestDesc",
    icon: Sparkles,
    tone: "from-fuchsia-600 to-rose-500",
  },
];

export function WelcomeCards({ showGuest }: { showGuest: boolean }) {
  const t = useTranslations("welcome");
  const visible = cards.filter((c) => c.href !== "/welcome/guest" || showGuest);

  return (
    <div className="space-y-3">
      <WelcomeBrowseEntry />
      <WelcomeQuickEntry />
      {visible.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.href}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={
                c.href === "/welcome/guest"
                  ? c.href
                  : `${c.href}${authFlowQuery("/home")}`
              }
              className="welcome-glass group relative z-10 block rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_56px_-8px_rgba(167,139,250,0.55)] active:scale-[0.99]"
            >
              <div className="flex items-start gap-4">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${c.tone} text-white shadow-lg ring-1 ring-white/20 transition group-hover:scale-105`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-zinc-900">{t(c.titleKey)}</p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600">{t(c.descKey)}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
      <PersonaQuickPick />
    </div>
  );
}
