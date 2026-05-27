import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { localizedPath } from "@/lib/localePath";

export default async function LearnPage() {
  const locale = await getLocale();
  redirect(localizedPath("/learn/step/1", locale));
}
