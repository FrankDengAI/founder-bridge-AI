"use client";

import { MarkdownPreview } from "@/components/MarkdownPreview";

export function MarkdownBody({ source }: { source: string }) {
  if (!source.trim()) return null;
  return (
    <div className="rounded-2xl bg-zinc-50/80 p-3 ring-1 ring-zinc-200/60">
      <MarkdownPreview source={source} />
    </div>
  );
}
