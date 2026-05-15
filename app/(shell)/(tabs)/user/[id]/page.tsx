import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FolderGit2, Link2, MessageCircle, Sparkles } from "lucide-react";
import { FeedCard } from "@/components/FeedCard";
import { FollowButton } from "@/components/FollowButton";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";
import { isRole } from "@/lib/domain/role";
import { ROLE_LABEL } from "@/lib/labels";

type Props = { params: { id: string } };

export const dynamic = "force-dynamic";

export default async function UserPage({ params }: Props) {
  const viewerId = getUserIdFromCookies();
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      profile: true,
      posts: { orderBy: { createdAt: "desc" }, take: 24 },
      projects: { orderBy: { createdAt: "desc" }, take: 6 },
      _count: {
        select: {
          followerEdges: true,
          followingEdges: true,
        },
      },
    },
  });
  if (!user) notFound();

  const following = viewerId
    ? await prisma.follow.findUnique({
        where: {
          followerId_followingId: { followerId: viewerId, followingId: user.id },
        },
      })
    : null;

  const role = user.profile && isRole(user.profile.role) ? user.profile.role : null;

  return (
    <div className="space-y-4 pb-10">
      <PageHeader title="用户主页" backHref="/home" />

      <section className="glass-panel overflow-hidden rounded-3xl shadow-soft ring-1 ring-white/70">
        <div className="relative h-28 bg-gradient-to-r from-brand-600 via-fuchsia-600 to-sky-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
        </div>
        <div className="relative -mt-10 flex items-end gap-3 px-4 pb-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-3xl bg-white ring-4 ring-white shadow-sm">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt="" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-zinc-500">
                VC
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h1 className="truncate text-lg font-semibold text-zinc-950">
                {user.displayName}
              </h1>
              <FollowButton
                targetUserId={user.id}
                viewerId={viewerId}
                initialFollowing={Boolean(following)}
              />
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">
              粉丝 {user._count.followerEdges} · 关注 {user._count.followingEdges}
            </p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-600">
              {user.profile?.intro || "这位创作者还没有写简介。"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {role ? (
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-900 ring-1 ring-brand-200/60">
                  {ROLE_LABEL[role]}
                </span>
              ) : null}
              {user.profile?.direction ? (
                <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-zinc-800 ring-1 ring-zinc-200/70">
                  {user.profile.direction}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Ta 的笔记</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/match" className="text-[11px] font-semibold text-brand-800 hover:underline">
              去找 Ta 匹配
            </Link>
            <Link
              href={`/messages?peer=${encodeURIComponent(user.id)}`}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-800 hover:underline"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              发消息
            </Link>
          </div>
        </div>
        <div className="columns-2 gap-2 space-y-2 [column-fill:_balance]">
          {user.posts.map((p) => (
            <div key={p.id} className="mb-2 break-inside-avoid">
              <FeedCard
                id={p.id}
                authorId={p.authorId}
                type={p.type}
                title={p.title}
                excerpt={p.excerpt}
                coverUrl={p.coverUrl}
                authorName={user.displayName}
                likes={p.likes}
                saves={p.saves}
              />
            </div>
          ))}
        </div>
        {user.posts.length === 0 ? (
          <p className="glass-panel rounded-2xl p-4 text-xs text-zinc-600 shadow-sm">
            暂无笔记。
          </p>
        ) : null}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-900">项目</h2>
        <div className="space-y-2">
          {user.projects.map((proj) => {
            let stack: string[] = [];
            try {
              stack = JSON.parse(proj.stack) as string[];
              if (!Array.isArray(stack)) stack = [];
            } catch {
              stack = [];
            }
            return (
              <div
                key={proj.id}
                className="glass-panel rounded-2xl p-4 shadow-sm ring-1 ring-white/70"
              >
                <p className="text-sm font-semibold text-zinc-950">{proj.name}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {proj.repoUrl ? (
                    <a
                      className="inline-flex items-center gap-1 rounded-xl bg-zinc-950 px-3 py-2 text-[11px] font-semibold text-white hover:bg-zinc-800"
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FolderGit2 className="h-3.5 w-3.5" />
                      仓库
                    </a>
                  ) : null}
                  {proj.previewUrl ? (
                    <a
                      className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-[11px] font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
                      href={proj.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      预览
                    </a>
                  ) : null}
                  <Link
                    href="/demo/product"
                    className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-2 text-[11px] font-semibold text-white shadow-glow"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    演示嵌入
                  </Link>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-700 ring-1 ring-zinc-200/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {user.projects.length === 0 ? (
          <p className="glass-panel rounded-2xl p-4 text-xs text-zinc-600 shadow-sm">
            暂无项目展示。
          </p>
        ) : null}
      </section>
    </div>
  );
}
