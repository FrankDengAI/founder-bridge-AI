import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { FollowButton } from "@/components/FollowButton";
import { PageHeader } from "@/components/PageHeader";
import { UserPageTabs } from "@/components/user/UserPageTabs";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";
import { isRole } from "@/lib/domain/role";
import { ROLE_LABEL } from "@/lib/labels";

type Props = { params: { id: string } };

export const dynamic = "force-dynamic";

function parseJsonArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default async function UserPage({ params }: Props) {
  const viewerId = await getUserIdFromCookies();
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      profile: true,
      posts: {
        where: { status: "published" },
        orderBy: { createdAt: "desc" },
        take: 24,
      },
      projects: { orderBy: { createdAt: "desc" }, take: 12 },
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
  const skillKeywords = user.profile
    ? parseJsonArray(user.profile.skillKeywords)
    : [];
  const desiredPartnerRoles = user.profile
    ? parseJsonArray(user.profile.desiredPartnerRoles).filter(isRole)
    : [];

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

      <div className="flex flex-wrap gap-2">
        <Link href="/match" className="text-[11px] font-semibold text-brand-800 hover:underline">
          去找 Ta 匹配
        </Link>
        <Link
          href={`/messages?peer=${encodeURIComponent(user.id)}&intent=interview`}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-800 hover:underline"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          发消息
        </Link>
      </div>

      <UserPageTabs
        userId={user.id}
        displayName={user.displayName}
        intro={user.profile?.intro ?? ""}
        direction={user.profile?.direction ?? ""}
        role={role}
        skillKeywords={skillKeywords}
        desiredPartnerRoles={desiredPartnerRoles}
        remoteOk={user.profile?.remoteOk ?? false}
        githubUrl={user.profile?.githubUrl ?? ""}
        verified={Boolean(user.profile?.verifiedAt)}
        posts={user.posts.map((p) => ({
          id: p.id,
          authorId: p.authorId,
          type: p.type,
          title: p.title,
          excerpt: p.excerpt,
          coverUrl: p.coverUrl,
          likes: p.likes,
          saves: p.saves,
        }))}
        projects={user.projects.map((proj) => ({
          id: proj.id,
          name: proj.name,
          description: proj.description,
          stage: proj.stage,
          stack: parseJsonArray(proj.stack),
          teamNeeds: proj.teamNeeds,
        }))}
      />
    </div>
  );
}
