"use client";

import { useTranslations } from "next-intl";
import { TOOL_CATEGORY_IDS } from "@/lib/toolCategoryIds";

type Props = {
  value: string;
  onChange: (id: string) => void;
};

export function ToolCategoryNav({ value, onChange }: Props) {
  const t = useTranslations("toolCategory");

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {TOOL_CATEGORY_IDS.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition ${
            value === id
              ? "border-violet-400 bg-violet-50 text-violet-900"
              : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
          }`}
        >
          {t(id)}
        </button>
      ))}
    </div>
  );
}
