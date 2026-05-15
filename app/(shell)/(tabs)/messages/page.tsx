import { Suspense } from "react";
import { MessagesClient } from "./MessagesClient";

export const dynamic = "force-dynamic";

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="glass-panel rounded-3xl p-6 text-sm text-zinc-600 shadow-sm">
          加载消息…
        </div>
      }
    >
      <MessagesClient />
    </Suspense>
  );
}
