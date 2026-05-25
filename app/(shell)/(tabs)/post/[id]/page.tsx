import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, FolderGit2, Sparkles } from "lucide-react";
import { PostComments } from "@/components/PostComments";
import { PostEngage } from "@/components/PostEngage";
import { RecordRecentView } from "@/components/RecordRecentView";
import { PageHeader } from "@/components/PageHeader";
import { MarkdownBody } from "@/components/MarkdownBody";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";
import { isPostType } from "@/lib/domain/postType";
import { POST_TYPE_LABEL } from "@/lib/labels";

type Props = { params: { id: string } };

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: Props) {
  const viewerId = getUserIdFromCookies();
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { author: true },
  });
  if (!post) notFound();

  const [likedRow, savedRow] = viewerId
    ? await Promise.all([
        prisma.postLike.findUnique({
          where: { userId_postId: { userId: viewerId, postId: post.id } },
        }),
        prisma.postSave.findUnique({
          where: { userId_postId: { userId: viewerId, postId: post.id } },
        }),
      ])
    : [null, null];
  const label = isPostType(post.type)
    ? POST_TYPE_LABEL[post.type]
    : post.type;

  let tags: string[] = [];
  try {
    tags = JSON.parse(post.tags) as string[];
    if (!Array.isArray(tags)) tags = [];
  } catch {
    tags = [];
  }

  let recruitMeta: Record<string, string> | null = null;
  if (post.type === "RECRUIT") {
    try {
      recruitMeta = JSON.parse(post.meta) as Record<string, string>;
    } catch {
      recruitMeta = null;
    }
  }

  return (
    <article className="space-y-4 pb-10">
      <RecordRecentView postId={post.id} title={post.title} postType={post.type} />
      <PageHeader title="笔记详情" backHref="/home" />

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-zinc-200/70">
        <div className="relative aspect-[16/10] w-full bg-zinc-100">
          <Image
            src={post.coverUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 480px"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-zinc-900 shadow-sm ring-1 ring-black/5 backdrop-blur">
            {label}
          </span>
        </div>
        <div className="space-y-4 p-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-900 ring-1 ring-brand-200/60"
              >
                #{t}
              </span>
            ))}
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
            {post.title}
          </h1>
          <p className="text-sm leading-relaxed text-zinc-600">{post.excerpt}</p>

          <div className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200/70">
            <div className="min-w-0">
              <p className="text-xs text-zinc-500">作者</p>
              <Link
                href={`/user/${post.authorId}`}
                className="truncate text-sm font-semibold text-brand-800 hover:underline"
              >
                {post.author.displayName}
              </Link>
            </div>
            <Link
              href={`/user/${post.authorId}`}
              className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
            >
              进主页
            </Link>
          </div>

          {recruitMeta ? (
            <div className="rounded-2xl bg-violet-50/80 p-3 text-xs ring-1 ring-violet-200/60">
              <p className="font-semibold text-violet-950">招募信息</p>
              <ul className="mt-2 space-y-1 text-violet-900/90">
                {recruitMeta.recruitRole ? (
                  <li>需求角色：{recruitMeta.recruitRole}</li>
                ) : null}
                {recruitMeta.recruitTime ? (
                  <li>时间投入：{recruitMeta.recruitTime}</li>
                ) : null}
                {recruitMeta.recruitComp ? (
                  <li>报酬方式：{recruitMeta.recruitComp}</li>
                ) : null}
              </ul>
            </div>
          ) : null}

          <PostEngage
            postId={post.id}
            initialLikes={post.likes}
            initialSaves={post.saves}
            initiallyLiked={Boolean(likedRow)}
            initiallySaved={Boolean(savedRow)}
          />

          <PostComments postId={post.id} viewerId={viewerId} />

          <MarkdownBody source={post.body} />

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Link
              href="/learn/github"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-3 py-3 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800"
            >
              <FolderGit2 className="h-4 w-4" />
              绑定 GitHub
            </Link>
            <Link
              href="/demo/product"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-3 text-xs font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
            >
              <Sparkles className="h-4 w-4" />
              产品预览
            </Link>
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-3 text-xs font-semibold text-white shadow-glow hover:brightness-105"
            >
              <ExternalLink className="h-4 w-4" />
              外链示例
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
