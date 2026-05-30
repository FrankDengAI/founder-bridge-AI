import { CheckCircle2, GitBranch, Shield, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { GitHubDemoActions } from "@/components/GitHubDemoActions";
import { PageHeader } from "@/components/PageHeader";

export default async function GitHubConnectPage() {
  const t = await getTranslations("pages.learnGithub");

  return (
    <div className="space-y-4 pb-10">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        backHref="/home"
      />

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white">
            <GitBranch className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-950">{t("benefitsTitle")}</p>
            <ul className="mt-2 space-y-2 text-xs leading-relaxed text-zinc-700">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {t("benefit1")}
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {t("benefit2")}
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {t("benefit3")}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
          <div>
            <p className="text-sm font-semibold text-zinc-950">{t("privacyTitle")}</p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-700">{t("privacyDesc")}</p>
          </div>
        </div>
      </section>

      <GitHubDemoActions />

      <div className="glass-panel flex items-start gap-3 rounded-3xl p-4 text-xs text-zinc-700 shadow-sm ring-1 ring-white/70">
        <Users className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
        <p>{t("trustTip")}</p>
      </div>
    </div>
  );
}
