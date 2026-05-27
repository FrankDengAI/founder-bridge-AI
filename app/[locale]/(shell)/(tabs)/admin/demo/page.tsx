import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { isDemoLoginEnabled } from "@/lib/auth/config";
import { localizedPath } from "@/lib/localePath";
import { AdminDemoClient } from "./AdminDemoClient";

export default async function AdminDemoPage() {
  if (!isDemoLoginEnabled()) {
    const locale = await getLocale();
    redirect(localizedPath("/workspace", locale));
  }
  return <AdminDemoClient />;
}
