export const POST_TYPES = [
  "NOTE",
  "VIDEO",
  "ARTICLE",
  "SHOWCASE",
  "REVIEW",
  "IDEA",
  "TUTORIAL",
] as const;
export type PostType = (typeof POST_TYPES)[number];

export function isPostType(v: unknown): v is PostType {
  return typeof v === "string" && (POST_TYPES as readonly string[]).includes(v);
}
