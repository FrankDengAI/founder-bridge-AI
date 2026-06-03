import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth/AuthCard";

export default async function ForgotPasswordPage() {
  const t = await getTranslations("welcome");
  const ta = await getTranslations("auth");

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Link
          href="/welcome/login?next=%2Fhome"
          className="inline-flex w-fit text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          ← {t("forgotPasswordBackLogin")}
        </Link>
        <Link
          href="/home"
          className="text-xs font-medium text-zinc-500 hover:text-violet-700"
        >
          {t("browseFirst")}
        </Link>
      </div>
      <AuthCard>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">{t("forgotPasswordTitle")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">{t("forgotPasswordDesc")}</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/welcome/register"
            className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            {t("forgotPasswordRegister")}
          </Link>
          <Link
            href="/welcome/login?next=%2Fhome"
            className="flex w-full items-center justify-center rounded-full border border-zinc-200 py-3 text-sm font-semibold text-zinc-700 transition hover:border-violet-300 hover:bg-violet-50"
          >
            {ta("goLogin")}
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
