"use client";

import { useEffect } from "react";

export default function TabsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">页面出了点问题</p>
      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
        {error.message || "请稍后重试，或返回上一页。"}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow ring-1 ring-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        重试
      </button>
    </div>
  );
}
