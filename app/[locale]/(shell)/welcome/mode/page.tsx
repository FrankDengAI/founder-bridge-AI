import { Suspense } from "react";
import { ViewModePicker } from "@/components/view-mode/ViewModePicker";
import { ViewModeLoading } from "@/components/view-mode/ViewModeLoading";

export default function WelcomeModePage() {
  return (
    <Suspense fallback={<ViewModeLoading welcomeMode />}>
      <ViewModePicker />
    </Suspense>
  );
}
