import { PageHeader } from "@/components/PageHeader";
import { PublishWizard } from "@/components/PublishWizard";

export default function PublishPage() {
  return (
    <div className="space-y-3">
      <PageHeader title="发布" subtitle="四步完成：类型 → 内容 → 封面 → 确认。" backHref="/home" />
      <PublishWizard />
    </div>
  );
}
