import { redirect } from "next/navigation";

/** 已改为账号密码登录，旧邮箱验证入口重定向 */
export default function VerifyEmailPage() {
  redirect("/welcome/login");
}
