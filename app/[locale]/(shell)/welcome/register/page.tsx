import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterWizard } from "./RegisterWizard";

export default function WelcomeRegisterPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <Link
        href="/welcome"
        className="inline-flex w-fit text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
      >
        ← 返回
      </Link>
      <AuthCard>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">注册</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          四步：账号密码 → 昵称 → 创业角色 → 兴趣标签。完成后自动登录。
        </p>
        <div className="mt-6">
          <RegisterWizard />
        </div>
        <div className="mt-6 border-t border-zinc-100 pt-5 text-center text-xs font-medium text-zinc-500">
          已有账号？
          <Link href="/welcome/login" className="ml-1 font-semibold text-violet-700 hover:underline">
            去登录
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
