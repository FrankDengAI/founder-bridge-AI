"use client";

import { useRouter } from "next/navigation";
import { completeActivationStep } from "@/lib/activation";

const PRESETS = [
  {
    id: "student",
    label: "应届生 · 做作品集",
    role: "ADC",
    direction: "AI 编程教育",
    href: "/learn",
  },
  {
    id: "pm",
    label: "产品经理 · 找开发者",
    role: "SUPPORT",
    direction: "内容合作 / 访谈",
    href: "/match",
  },
  {
    id: "founder",
    label: "创业者 · 快速组队",
    role: "JUNGLE",
    direction: "出海 SaaS",
    href: "/match",
  },
] as const;

export function PersonaQuickPick() {
  const router = useRouter();

  const apply = async (p: (typeof PRESETS)[number]) => {
    const me = await fetch("/api/me", { credentials: "include" });
    const j = (await me.json()) as { userId: string | null };
    if (!j.userId) {
      router.push("/welcome/login");
      return;
    }
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userId: j.userId,
        role: p.role,
        direction: p.direction,
        intro: `我是${p.label}路径用户，正在探索 VibeHub。`,
      }),
    });
    localStorage.setItem("vibe_persona", p.id);
    completeActivationStep("persona");
    router.push(p.href);
  };

  return (
    <section className="welcome-glass relative z-10 rounded-3xl p-4">
      <p className="text-sm font-bold text-white">30 秒人设快选（可选）</p>
      <p className="mt-1 text-xs text-zinc-400">自动填充资料并跳转到推荐首页</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => void apply(p)}
            className="rounded-2xl bg-white/10 px-3 py-2 text-[11px] font-semibold text-white ring-1 ring-white/20 hover:bg-white/20"
          >
            {p.label}
          </button>
        ))}
      </div>
    </section>
  );
}
