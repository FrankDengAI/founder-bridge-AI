import { redirect } from "next/navigation";

/** 已改为账号密码登录，忘记密码请重新注册或联系管理员 */
export default function ForgotPasswordPage() {
  redirect("/welcome/login");
}
