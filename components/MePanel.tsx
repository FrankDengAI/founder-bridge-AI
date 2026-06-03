"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AuthLoginLink } from "@/components/auth/AuthLoginLink";
import {
  BadgeCheck,
  GraduationCap,
  LayoutGrid,
  LogOut,
  MessageCircle,
  PenSquare,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import { MeBadgesStrip } from "@/components/me/MeBadgesStrip";
import { MeRetentionHub } from "@/components/me/MeRetentionHub";
import { TodayMissionStrip } from "@/components/home/TodayMissionStrip";
import { LearnProgressInline } from "@/components/learn/LearnProgressInline";
import { ActivationJourney } from "@/components/retention/ActivationJourney";
import { ProfileStrengthCard } from "@/components/retention/ProfileStrengthCard";
import { PublishDraftBanner } from "@/components/retention/PublishDraftBanner";
import { PageHeader } from "@/components/PageHeader";
import { performLogout } from "@/lib/authLogout";
import { syncLocalUserId } from "@/lib/clientSession";
import { useCurrentUser } from "@/lib/hooks/useClientUserId";
import type { Role } from "@/lib/domain/role";
import { ROLES, isRole } from "@/lib/domain/role";
import { getRoleLabel } from "@/lib/labels";

const quickLinkKeys = [
  { href: "/workspace", key: "workspace", icon: LayoutGrid },
  { href: "/creator", key: "creator", icon: BadgeCheck },
  { href: "/orders", key: "orders", icon: ShoppingBag },
  { href: "/publish", key: "publish", icon: PenSquare },
  { href: "/settings/profile", key: "profile", icon: UserRound },
  { href: "/search", key: "search", icon: Search },
  { href: "/messages", key: "messages", icon: MessageCircle },
  { href: "/match", key: "match", icon: Sparkles },
  { href: "/tools", key: "tools", icon: Wrench },
  { href: "/settings", key: "settings", icon: Settings },
  { href: "/me/achievements", key: "achievements", icon: BadgeCheck },
  { href: "/learn", key: "learn", icon: GraduationCap },
] as const;

export function MePanel() {
  const { user, loading: authLoading } = useCurrentUser();
  const userId = user?.userId ?? "";
  const t = useTranslations("pages.me");
  const tRoles = useTranslations("roles");
  const tCommon = useTranslations("common");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/profile?userId=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error("加载失败");
      const data = (await res.json()) as {
        user: { displayName: string };
        profile: { role: string };
      };
      setDisplayName(data.user.displayName);
      setRole(isRole(data.profile.role) ? data.profile.role : null);
    } catch {
      setMsg(t("loadFail"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.userId) {
      setMsg(t("loginRequired"));
      setLoading(false);
      return;
    }
    syncLocalUserId(user.userId);
    void load(user.userId);
  }, [authLoading, user?.userId, load, t]);

  return (
    <div className="space-y-4 pb-4">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <LearnProgressInline />
      <ProfileStrengthCard />
      <PublishDraftBanner />
      <ActivationJourney compact />
      <MeRetentionHub />
      <TodayMissionStrip />
      <MeBadgesStrip />

      <section className="rounded-3xl border border-rose-200/80 bg-gradient-to-br from-rose-50/90 to-white/80 p-4 shadow-sm ring-1 ring-rose-100/80">
        <p className="text-xs font-semibold text-rose-900">{t("accountSecurity")}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-rose-800/80">
          {t("logoutDesc")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void performLogout()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-rose-700 sm:flex-none"
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
          <Link
            href="/settings"
            className="inline-flex items-center justify-center rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200/80 transition hover:bg-white"
          >
            {t("openSettings")}
          </Link>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <p className="text-xs font-semibold text-zinc-900">{t("quickLinks")}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {quickLinkKeys.map((it) => {
            const Icon = it.icon;
            return (
              <Link
                key={it.href}
                href={it.href}
                className="rounded-2xl bg-white/70 p-3 ring-1 ring-zinc-200/70 transition hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-fuchsia-600 text-white shadow-sm">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-950">{t(`links.${it.key}.label`)}</p>
                    <p className="truncate text-[11px] text-zinc-600">{t(`links.${it.key}.desc`)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        {loading ? (
          <p className="text-sm text-zinc-600">{tCommon("loading")}</p>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-950">
                  {displayName || user?.displayName || t("user")}
                </p>
                <p className="mt-1 text-xs text-zinc-600">{t("roleFromProfile")}</p>
              </div>
              <Link
                href="/settings/profile"
                className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold text-brand-900 ring-1 ring-brand-200/70 hover:bg-white"
              >
                {t("links.profile.label")}
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <span
                  key={r}
                  className={`rounded-full border px-2.5 py-1 text-[11px] ${
                    role === r
                      ? "border-brand-300 bg-brand-50 text-brand-950"
                      : "border-zinc-200/80 bg-white/70 text-zinc-600"
                  }`}
                >
                  {getRoleLabel(tRoles, r)}
                </span>
              ))}
            </div>
          </>
        )}
        {msg ? (
          <p className="mt-3 text-xs font-medium text-brand-900">
            {msg}
            {!user?.userId ? (
              <>
                {" "}
                <AuthLoginLink href="/me" reason="default" className="font-semibold underline hover:text-brand-700">
                  {t("goLogin")}
                </AuthLoginLink>
              </>
            ) : null}
          </p>
        ) : null}
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">{t("myProfile")}</h2>
            <p className="mt-1 text-xs text-zinc-600">{t("profileDesc")}</p>
          </div>
          {userId ? (
            <Link
              href={`/user/${encodeURIComponent(userId)}`}
              className="rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-2 text-xs font-semibold text-white shadow-glow"
            >
              {t("open")}
            </Link>
          ) : (
            <AuthLoginLink
              href="/me"
              reason="default"
              className="rounded-2xl bg-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700"
            >
              {t("loginFirst")}
            </AuthLoginLink>
          )}
        </div>
      </section>
    </div>
  );
}
