/** 品牌站 · 四大产品体验区块快捷跳转（页内锚点，与 WebNav「产品体验」下拉一致） */
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
      className="border-y border-white/[0.06] bg-ink-950/40 py-4"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-slate-200">产品体验</span>
          <span className="mx-2 text-white/20">·</span>
          以下四块可在 App 演示中真实操作，页内分区展示
        </p>
        <div className="flex flex-wrap gap-2">
          {SHOWCASE_SECTIONS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-slate-200 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
