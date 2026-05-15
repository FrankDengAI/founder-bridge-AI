"use client";

const CATEGORIES = [
  { id: "all", label: "全部" },
  { id: "写代码", label: "写代码" },
  { id: "做网页", label: "做网页" },
  { id: "管理 GitHub", label: "GitHub" },
  { id: "自动部署", label: "部署" },
  { id: "生成图片或视频", label: "多媒体" },
  { id: "做数据分析", label: "数据" },
  { id: "做产品原型", label: "原型" },
] as const;

type Props = {
  value: string;
  onChange: (id: string) => void;
};

export function ToolCategoryNav({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.id)}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition ${
            value === c.id
              ? "border-violet-400 bg-violet-50 text-violet-900"
              : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
