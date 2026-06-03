import type { PostType } from "@/lib/domain/postType";

/** App 发现页顶栏展示的类型（不含学习/招募等） */
export const DISCOVERY_FEED_TYPES = [
  "NOTE",
  "VIDEO",
  "ARTICLE",
  "SHOWCASE",
  "REVIEW",
] as const satisfies readonly PostType[];

export type DiscoveryFeedType = (typeof DISCOVERY_FEED_TYPES)[number];

export function isDiscoveryFeedType(v: string): v is DiscoveryFeedType {
  return (DISCOVERY_FEED_TYPES as readonly string[]).includes(v);
}
