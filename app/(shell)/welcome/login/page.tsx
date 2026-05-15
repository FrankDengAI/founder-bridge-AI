import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "./LoginForm";

function LoginSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md">
      <AuthCard>
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-7 w-48 rounded-lg bg-zinc-200" />
          <div className="h-4 w-full rounded bg-zinc-100" />
          <div className="h-11 rounded-xl bg-zinc-100" />
          <div className="h-24 rounded-xl bg-zinc-100" />
          <div className="h-12 rounded-full bg-zinc-200" />
        </div>
      </AuthCard>
    </div>
  );
}

export default function WelcomeLoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
