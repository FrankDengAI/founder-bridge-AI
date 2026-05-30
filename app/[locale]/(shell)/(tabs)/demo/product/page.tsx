import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/PageHeader";

export default function DemoProductPage() {
  return (
    <div className="space-y-4 pb-10">
      <PageHeader
        title="产品预览"
        subtitle="在应用内直接浏览你的产品页面，方便伙伴快速了解你在做什么。"
        backHref="/home"
      />

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-zinc-200/70">
        <div className="border-b border-zinc-200/70 bg-zinc-50 px-4 py-2 text-[11px] font-semibold text-zinc-700">
          产品页面预览
        </div>
        <iframe
          title="产品预览"
          className="h-[520px] w-full bg-white"
          src="https://example.com"
        />
      </div>

      <div className="glass-panel rounded-3xl p-4 text-xs leading-relaxed text-zinc-700 shadow-sm">
        绑定你的产品链接后，匹配到的伙伴可以在这里直接体验，降低沟通成本。
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
            去找创业伙伴
          </Link>
        </div>
      </div>
    </div>
  );
}
