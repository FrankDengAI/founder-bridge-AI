import { Link } from "@/i18n/navigation";
import { AuthCard } from "@/components/auth/AuthCard";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <Link
        href="/welcome/login"
        className="inline-flex w-fit text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
      >
        ← 返回登录
      </Link>
      <AuthCard>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">找回密码</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          当前版本使用账号密码登录，暂未开放邮箱自助找回。若忘记密码，请重新注册新账号，或联系站点管理员重置。
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/welcome/register"
            className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            注册新账号
          </Link>
          <Link
            href="/welcome/login"
            className="flex w-full items-center justify-center rounded-full border border-zinc-200 py-3 text-sm font-semibold text-zinc-700 transition hover:border-violet-300 hover:bg-violet-50"
          >
            返回登录
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
