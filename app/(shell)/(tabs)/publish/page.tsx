import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { PublishWizard } from "@/components/PublishWizard";

export default function PublishPage() {
  return (
    <div className="space-y-3">
      <PageHeader title="发布" subtitle="四步完成：类型 → 内容 → 封面 → 确认。" backHref="/home" />
      <Suspense fallback={<p className="text-xs text-zinc-500">加载发布向导…</p>}>
        <PublishWizard />
      </Suspense>
    </div>
  );
}
