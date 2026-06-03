export function encodeFeedCursor(createdAt: Date, id: string) {
  return `${createdAt.toISOString()}_${id}`;
}

export function feedNextCursor<T extends { createdAt: Date; id: string }>(
  posts: T[],
  take: number,
): string | null {
  if (posts.length < take) return null;
  const last = posts[posts.length - 1];
  return last ? encodeFeedCursor(last.createdAt, last.id) : null;
}

export function toFeedPostItem(p: {
  id: string;
  type: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  likes: number;
  saves: number;
  author: { id: string; displayName: string };
}) {
  return {
    id: p.id,
    type: p.type,
    title: p.title,
    excerpt: p.excerpt,
    coverUrl: p.coverUrl,
    likes: p.likes,
    saves: p.saves,
    author: p.author,
  };
}
