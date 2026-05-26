"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useClientUserId, useClientUserReady } from "@/lib/hooks/useClientUserId";
import {
  hasDailyMatchContactedToday,
  markDailyMatchContacted,
  MESSAGE_INTENT_TEMPLATES,
} from "@/lib/retention";
import { startConversation } from "@/lib/chat/client";
import { getRoleLabel } from "@/lib/labels";
import { isRole } from "@/lib/domain/role";

type Candidate = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
  score: number;
  direction?: string;
};

export function DailyMatchCard() {
  const t = useTranslations("home");
  const tRoles = useTranslations("roles");
  const router = useRouter();
  const userId = useClientUserId();
  const ready = useClientUserReady();
  const [c, setC] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [needProfile, setNeedProfile] = useState(false);
  const [contacted, setContacted] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void Promise.all([
      fetch("/api/match?daily=1", { credentials: "include" }).then((r) =>
        r.ok ? r.json() : null,
      ),
      fetch(`/api/profile?userId=${encodeURIComponent(userId)}`, {
        credentials: "include",
      }).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([matchJson, profileJson]) => {
        const j = matchJson as { candidate: Candidate | null } | null;
        if (j?.candidate) setC(j.candidate);
        else {
          const p = profileJson as {
            profile?: { intro?: string; skillKeywords?: string[] };
          } | null;
          const kw = p?.profile?.skillKeywords?.length ?? 0;
          const intro = (p?.profile?.intro ?? "").trim();
          setNeedProfile(kw < 2 || intro.length < 10);
        }
      })
      .finally(() => setLoading(false));
  }, [userId, ready]);

  useEffect(() => {
    const refresh = () => setContacted(hasDailyMatchContactedToday());
    refresh();
    window.addEventListener("vibe-daily-match-updated", refresh);
    return () => window.removeEventListener("vibe-daily-match-updated", refresh);
  }, []);

  if (!ready || loading) {
    return (
      <div className="rounded-2xl bg-violet-50/50 p-3 text-[11px] text-zinc-500 ring-1 ring-violet-200/50">
        {t("loadingDaily")}
      </div>
    );
  }

  if (!userId) {
    return (
      <section className="rounded-2xl border border-dashed border-violet-300/80 bg-violet-50/40 p-3 ring-1 ring-violet-200/50">
        <p className="text-xs font-semibold text-violet-950">{t("dailyMatchLocked")}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-violet-900/80">
          {t("dailyMatchLoginHint")}
        </p>
        <Link
          href="/welcome/login"
          className="mt-2 inline-flex rounded-xl bg-violet-600 px-3 py-2 text-[11px] font-semibold text-white"
        >
          {t("goLogin")}
        </Link>
      </section>
    );
  }

  if (!c) {
    return (
      <section className="rounded-2xl border border-dashed border-violet-300/80 bg-violet-50/40 p-3 ring-1 ring-violet-200/50">
        <p className="text-xs font-semibold text-violet-950">{t("dailyMatchEmpty")}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-violet-900/80">
          {needProfile ? t("dailyMatchProfileHint") : t("dailyMatchPoolHint")}
        </p>
        <Link
          href={needProfile ? "/settings/profile" : "/match"}
          className="mt-2 inline-flex rounded-xl bg-violet-600 px-3 py-2 text-[11px] font-semibold text-white"
        >
          {needProfile ? t("goProfile") : t("goMatch")}
        </Link>
      </section>
    );
  }

  const roleLabel = isRole(c.role) ? getRoleLabel(tRoles, c.role) : c.role;

  return (
    <section className="rounded-2xl bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 p-3 ring-1 ring-violet-200/60">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-violet-950">
        <Sparkles className="h-3.5 w-3.5" />
        {t("dailyPick")}
      </p>
      <div className="mt-2 flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-violet-100">
          {c.avatarUrl ? (
            <Image src={c.avatarUrl} alt="" fill className="object-cover" unoptimized />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-bold text-violet-800">
              {c.displayName.slice(0, 1)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900">{c.displayName}</p>
          <p className="text-[10px] text-zinc-600">
            {roleLabel}
            {c.direction ? ` · ${c.direction}` : ""}
          </p>
          <p className="text-[10px] font-mono text-violet-700">
            {t("matchScore", { score: Math.round(c.score * 100) })}
          </p>
        </div>
      </div>
      {!contacted ? (
        <p className="mt-2 rounded-xl bg-amber-100/90 px-2.5 py-1.5 text-[10px] font-semibold text-amber-950 ring-1 ring-amber-300/60">
          {t("dailyNudge")}
        </p>
      ) : null}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2 text-[11px] font-semibold text-white active:scale-[0.98]"
          onClick={() => {
            const intent = `${MESSAGE_INTENT_TEMPLATES.match}${c.displayName}。`;
            markDailyMatchContacted(c.userId);
            setContacted(true);
            void startConversation(c.userId, {
              source: "match",
              contextTitle: "今日一人",
              draftMessage: intent,
            }).then(() => {
              router.push(`/messages?peer=${encodeURIComponent(c.userId)}&intent=match`);
            });
          }}
        >
          {t("sayHi")}
        </button>
        <Link
          href={`/user/${c.userId}`}
          className="rounded-xl bg-white px-3 py-2 text-[11px] font-semibold text-zinc-800 ring-1 ring-zinc-200/80"
        >
          {t("profile")}
        </Link>
      </div>
    </section>
  );
}
