import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { scorePostForProfile } from "@/lib/forYou";

export type PostWithAuthor = Prisma.PostGetPayload<{
  include: { author: { select: { id: true; displayName: true } } };
}>;

const POST_INCLUDE = {
  author: { select: { id: true, displayName: true } },
} as const;

const FOR_YOU_POOL = 120;

type ProfileRow = Awaited<ReturnType<typeof prisma.userProfile.findUnique>>;

function rankForYou(pool: PostWithAuthor[], profile: ProfileRow, take: number): PostWithAuthor[] {
  const scored = pool
    .map((p) => ({ p, s: scorePostForProfile(p, profile) }))
    .sort((a, b) => {
      if (b.s !== a.s) return b.s - a.s;
      return b.p.createdAt.getTime() - a.p.createdAt.getTime();
    });
  let picked = scored.slice(0, take).map((x) => x.p);
  if (picked.length < 12) {
    const fallback = pool
      .filter((p) => !picked.some((x) => x.id === p.id))
      .slice(0, take - picked.length);
    picked = [...picked, ...fallback];
  }
  return picked;
}

/** 串行拉取首页 meta 计数，避免 pooler connection_limit:1 下 6 路并行抢连接 */
export async function loadHomeMetaCounts() {
  const posts = await prisma.post.count();
  const users = await prisma.user.count();
  const tools = await prisma.tool.count();
  const projects = await prisma.project.count();
  const models = await prisma.aiModel.count();
  const reviews = await prisma.aiModelReview.count();
  return {
    posts,
    users,
    tools,
    projects,
    models,
    reviews,
  };
}

/** 单次查库，App/Web 共用结果切片 */
export async function loadHomeFeedPosts(opts: {
  view: string | undefined;
  type: string | undefined;
  sort: "new" | "hot";
  uid: string | null;
  appTake: number;
  webTake: number;
}): Promise<{ app: PostWithAuthor[]; web: PostWithAuthor[] }> {
  const where = {
    status: "published" as const,
    ...(opts.type ? { type: opts.type } : {}),
  };
  const orderBy =
    opts.sort === "hot"
      ? ([{ likes: "desc" as const }, { createdAt: "desc" as const }] as const)
      : ({ createdAt: "desc" as const } as const);

  if (opts.view === "for-you") {
    const profile = opts.uid
      ? await prisma.userProfile.findUnique({ where: { userId: opts.uid } })
      : null;
    const pool = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: FOR_YOU_POOL,
      include: POST_INCLUDE,
    });
    return {
      app: rankForYou(pool, profile, opts.appTake),
      web: rankForYou(pool, profile, opts.webTake),
    };
  }

  const pool = await prisma.post.findMany({
    where,
    orderBy,
    take: Math.max(opts.appTake, opts.webTake),
    include: POST_INCLUDE,
  });
  return {
    app: pool.slice(0, opts.appTake),
    web: pool.slice(0, opts.webTake),
  };
}
