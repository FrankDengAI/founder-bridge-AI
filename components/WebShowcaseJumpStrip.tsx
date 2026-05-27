/** 品牌站 · 四大产品体验区块快捷跳转（页内锚点，与 WebNav「产品体验」一致） */
export const SHOWCASE_SECTIONS = [
  { href: "#match", label: "匹配引擎" },
  { href: "#pulse", label: "实时脉动" },
  { href: "#market", label: "工具商城" },
  { href: "#stories", label: "用户故事" },
] as const;

export function WebShowcaseJumpStrip() {
  return (
    <section
      id="showcase"
      aria-label="产品体验快捷导航"
      className="scroll-mt-20 border-y border-violet-200/60 bg-gradient-to-r from-violet-50/80 via-white to-fuchsia-50/60 py-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-zinc-600">
          <span className="font-semibold text-zinc-900">产品体验</span>
          <span className="mx-2 text-zinc-300">·</span>
          以下四块可在 App 演示中真实操作，页内分区展示
        </p>
        <div className="flex flex-wrap gap-2">
          {SHOWCASE_SECTIONS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="rounded-full border border-violet-200/80 bg-white px-3 py-1 text-[11px] font-semibold text-violet-900 shadow-sm transition hover:border-violet-400 hover:bg-violet-50"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
