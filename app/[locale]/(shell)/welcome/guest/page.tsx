import { Link } from "@/i18n/navigation";
import { redirect } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth/AuthCard";
import { isGuestEnabled } from "@/lib/auth/config";
import { GuestInterestForm } from "./GuestInterestForm";

export default async function WelcomeGuestPage() {
  if (!isGuestEnabled()) {
    redirect({ href: "/welcome/register", locale: await getLocale() });
  }

  const t = await getTranslations("welcome");
  const ta = await getTranslations("auth");
  const tc = await getTranslations("common");

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Link
          href="/home"
          className="inline-flex w-fit text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          ← {t("browseFirst")}
        </Link>
        <Link
          href="/welcome"
          className="text-xs font-medium text-zinc-500 hover:text-violet-700"
        >
          {t("backToWelcomeBoard")}
        </Link>
      </div>
      <AuthCard>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">{t("guestTitle")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">{t("guestDesc")}</p>
        <div className="mt-6">
          <GuestInterestForm />
        </div>
        <div className="mt-6 border-t border-zinc-100 pt-5 text-center text-xs font-medium text-zinc-500">
          <Link href="/welcome/login?next=%2Fhome" className="font-semibold text-violet-700 hover:underline">
            {ta("goLogin")}
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
