import { Link } from "@/i18n/navigation";
import { Cpu, MessageCircle, Sparkles, Users } from "lucide-react";

type Props = {
  modelCount?: number;
  reviewCount?: number;
};

const cards = [
  {
    href: "/models",
    title: "大模型口碑榜",
    desc: "看真实短评，按编程/写作/性价比场景选型，不用只看参数表。",
    cta: "去评分社区",
    icon: Cpu,
    tone: "from-violet-600 to-fuchsia-600",
    ring: "ring-violet-200/70",
  },
  {
    href: "/match",
    title: "找互补创业伙伴",
    desc: "技术 × 产品 × 增长，MOBA 式角色匹配，冷启动也能先聊起来。",
    cta: "开始匹配",
    icon: Users,
    tone: "from-sky-600 to-cyan-600",
    ring: "ring-cyan-200/70",
  },
  {
    href: "/publish?type=MODEL_DISCUSSION",
    title: "发起模型讨论",
    desc: "Claude 写前端稳不稳？DeepSeek 值不值？把你的踩坑经验留下来。",
    cta: "写讨论帖",
    icon: MessageCircle,
    tone: "from-amber-500 to-rose-500",
    ring: "ring-amber-200/70",
  },
] as const;

export function HomeCommunityHub({ modelCount = 0, reviewCount = 0 }: Props) {
  return (
    <section className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-2 px-0.5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-700">
            社区共建
          </p>
          <h2 className="text-sm font-bold text-zinc-950">还没找到伙伴？先在这里留下来</h2>
        </div>
        {modelCount > 0 ? (
          <p className="text-[10px] text-zinc-500">
            <strong className="text-violet-800">{modelCount}</strong> 个模型 ·{" "}
            <strong className="text-violet-800">{reviewCount}</strong> 条真实短评
          </p>
        ) : null}
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className={`group relative overflow-hidden rounded-2xl bg-white/90 p-3 ring-1 ${c.ring} transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(109,40,217,0.45)]`}
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${c.tone} opacity-20 blur-2xl transition group-hover:opacity-35`}
              />
              <span
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${c.tone} text-white shadow-sm`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <p className="relative mt-2 text-xs font-bold text-zinc-950">{c.title}</p>
              <p className="relative mt-1 line-clamp-2 text-[10px] leading-relaxed text-zinc-600">
                {c.desc}
              </p>
              <span className="relative mt-2 inline-flex items-center gap-0.5 text-[10px] font-semibold text-violet-800">
                {c.cta}
                <Sparkles className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
