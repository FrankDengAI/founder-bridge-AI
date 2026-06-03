import { Suspense } from "react";
import { RegisterPageClient } from "./RegisterPageClient";

function RegisterFallback() {
  return (
    <div className="mx-auto w-full max-w-lg animate-pulse space-y-4 py-8">
      <div className="h-4 w-24 rounded bg-zinc-200" />
      <div className="h-40 rounded-3xl bg-zinc-100" />
      <div className="h-64 rounded-3xl bg-zinc-100" />
    </div>
  );
}

export default function WelcomeRegisterPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterPageClient />
    </Suspense>
  );
}
