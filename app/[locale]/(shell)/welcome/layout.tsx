import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WelcomeShell } from "./WelcomeShell";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("welcome.meta");
  return {
    title: t("title"),
  };
}

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WelcomeShell>{children}</WelcomeShell>;
}
