import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { GuestInterestForm } from "./GuestInterestForm";

export default function WelcomeGuestPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <Link
        href="/welcome"
        className="inline-flex w-fit text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
      >
        ← 返回
      </Link>
      <AuthCard>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">先选兴趣</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          会为你创建一个游客账号并写入兴趣，之后可在「匹配」里补全资料。
        </p>
        <div className="mt-6">
          <GuestInterestForm />
        </div>
        <div className="mt-6 border-t border-zinc-100 pt-5 text-center text-xs font-medium text-zinc-500">
          <Link href="/welcome/login" className="font-semibold text-violet-700 hover:underline">
            使用已有账号登录
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
