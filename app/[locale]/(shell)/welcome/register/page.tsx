import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterWizard } from "./RegisterWizard";

export default async function WelcomeRegisterPage() {
  const t = await getTranslations("welcome");
  const ta = await getTranslations("auth");
  const tc = await getTranslations("common");

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <Link
        href="/welcome"
        className="inline-flex w-fit text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
      >
        ← {tc("back")}
      </Link>
      <AuthCard>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">{t("registerTitle")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">{t("registerDesc")}</p>
        <div className="mt-6">
          <RegisterWizard />
        </div>
        <div className="mt-6 border-t border-zinc-100 pt-5 text-center text-xs font-medium text-zinc-500">
          {ta("hasAccount")}
          <Link href="/welcome/login" className="ml-1 font-semibold text-violet-700 hover:underline">
            {ta("goLogin")}
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
