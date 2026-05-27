import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { localizedPath } from "@/lib/localePath";

export default async function ResetPasswordPage() {
  const locale = await getLocale();
  redirect(localizedPath("/welcome/login", locale));
}
