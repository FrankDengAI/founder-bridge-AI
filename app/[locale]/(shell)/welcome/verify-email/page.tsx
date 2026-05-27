import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { localizedPath } from "@/lib/localePath";

/** 已改为账号密码登录，旧邮箱验证入口重定向 */
export default async function VerifyEmailPage() {
  const locale = await getLocale();
  redirect(localizedPath("/welcome/login", locale));
}
