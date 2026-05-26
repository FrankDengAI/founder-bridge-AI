import { Suspense } from "react";
import { ViewModePicker } from "@/components/view-mode/ViewModePicker";
import { ViewModeLoading } from "@/components/view-mode/ViewModeLoading";

export default function WelcomeModePage() {
  return (
    <Suspense fallback={<ViewModeLoading message="正在准备模式选择…" />}>
      <ViewModePicker />
    </Suspense>
  );
}
