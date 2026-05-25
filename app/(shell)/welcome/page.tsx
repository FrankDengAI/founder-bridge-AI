import Link from "next/link";
import { LogIn, Sparkles, UserPlus } from "lucide-react";
import { PersonaQuickPick } from "@/components/welcome/PersonaQuickPick";

const cards = [
  {
    href: "/welcome/login",
    title: "登录",
    desc: "选择已有演示账号或种子用户，固定口令 demo。",
    icon: LogIn,
    tone: "from-brand-600 to-fuchsia-600",
  },
  {
    href: "/welcome/register",
    title: "注册",
    desc: "昵称、创业角色、兴趣标签，一步写入数据库。",
    icon: UserPlus,
    tone: "from-sky-600 to-brand-600",
  },
  {
    href: "/welcome/guest",
    title: "先选兴趣",
    desc: "快速创建游客身份，稍后再完善资料。",
    icon: Sparkles,
    tone: "from-fuchsia-600 to-rose-500",
  },
] as const;

export default function WelcomePage() {
  return (
    <div className="space-y-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Link
            key={c.href}
            href={c.href}
            className="welcome-glass group relative z-10 block rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_56px_-8px_rgba(167,139,250,0.55)]"
          >
            <div className="flex items-start gap-4">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${c.tone} text-white shadow-lg ring-1 ring-white/20 transition group-hover:scale-105`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-lg font-bold text-white">{c.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">{c.desc}</p>
              </div>
            </div>
          </Link>
        );
      })}
      <PersonaQuickPick />
    </div>
  );
}
