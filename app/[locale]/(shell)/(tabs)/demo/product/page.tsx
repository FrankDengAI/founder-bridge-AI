import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/PageHeader";

export default function DemoProductPage() {
  return (
    <div className="space-y-4 pb-10">
      <PageHeader
        title="产品页预览（演示）"
        subtitle="用 iframe 模拟「把产品嵌进 App」的体验。"
        backHref="/home"
      />

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-zinc-200/70">
        <div className="border-b border-zinc-200/70 bg-zinc-50 px-4 py-2 text-[11px] font-semibold text-zinc-700">
          嵌入区域 · example.com
        </div>
        <iframe
          title="demo-product"
          className="h-[520px] w-full bg-white"
          src="https://example.com"
        />
      </div>

      <div className="glass-panel rounded-3xl p-4 text-xs leading-relaxed text-zinc-700 shadow-sm">
        生产环境建议：自有域名白名单、CSP、登录态隔离，以及「在 App 内打开 / 外部浏览器打开」切换。
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/learn/github"
            className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
          >
            去绑定 GitHub
          </Link>
          <Link
            href="/match"
            className="rounded-full bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-1 text-[11px] font-semibold text-white"
          >
            发布完去找伙伴
          </Link>
        </div>
      </div>
    </div>
  );
}
