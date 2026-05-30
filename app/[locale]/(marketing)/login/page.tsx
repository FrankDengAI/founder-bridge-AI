import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginBridge } from "@/components/auth/LoginBridge";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("marketing.loginMeta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function LoginPage() {
  return <LoginBridge />;
}
