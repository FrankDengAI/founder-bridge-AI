/** 大模型评价场景与排行榜算法 */

export const MODEL_SCENARIOS = [
  { id: "all", label: "全部" },
  { id: "coding", label: "编程" },
  { id: "prototype", label: "产品原型" },
  { id: "writing", label: "写作" },
  { id: "reasoning", label: "推理" },
  { id: "value", label: "性价比" },
  { id: "context", label: "长上下文" },
] as const;

export type ModelScenarioId = (typeof MODEL_SCENARIOS)[number]["id"];

export const SCENARIO_LABEL: Record<string, string> = Object.fromEntries(
  MODEL_SCENARIOS.filter((s) => s.id !== "all").map((s) => [s.id, s.label]),
);

export function isModelScenarioId(v: unknown): v is ModelScenarioId {
  return typeof v === "string" && MODEL_SCENARIOS.some((s) => s.id === v);
}

export function computeRankScore(avgRating: number, reviewCount: number): number {
  return Math.round((avgRating * 0.7 + Math.log10(reviewCount + 1) * 0.8) * 100) / 100;
}

export function parseJsonArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
