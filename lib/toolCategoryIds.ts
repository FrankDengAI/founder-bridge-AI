/** DB 工具分类 slug（与种子数据一致，显示文案见 messages toolCategory） */
export const TOOL_CATEGORY_IDS = [
  "all",
  "写代码",
  "做网页",
  "管理 GitHub",
  "自动部署",
  "生成图片或视频",
  "做数据分析",
  "做产品原型",
] as const;

export type ToolCategoryId = (typeof TOOL_CATEGORY_IDS)[number];
