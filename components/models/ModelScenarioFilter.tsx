"use client";

import clsx from "clsx";
import { MODEL_SCENARIOS } from "@/lib/models/rank";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function ModelScenarioFilter({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {MODEL_SCENARIOS.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onChange(s.id)}
          className={clsx(
            "rounded-full px-3 py-1.5 text-[11px] font-semibold transition",
            value === s.id
              ? "bg-violet-600 text-white shadow-sm"
              : "bg-white/80 text-zinc-700 ring-1 ring-zinc-200/80 hover:bg-white",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
