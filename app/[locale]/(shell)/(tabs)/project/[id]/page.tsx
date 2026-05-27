import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ExternalLink, FolderGit2, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
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

export default async function ProjectPage({ params }: Props) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      user: { include: { profile: true } },
    },
  });
  if (!project) notFound();

  const stack = parseJsonArray(project.stack);
  const tags = parseJsonArray(project.tags);
  const role =
    project.user.profile && isRole(project.user.profile.role)
      ? project.user.profile.role
      : null;

  return (
    <div className="space-y-4 pb-10">
      <PageHeader title="项目主页" backHref={`/user/${project.userId}`} />

      <section className="glass-panel overflow-hidden rounded-3xl shadow-soft ring-1 ring-white/70">
        {project.coverUrl ? (
          <div className="relative aspect-[16/7] w-full bg-zinc-100">
            <Image
              src={project.coverUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="h-28 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500" />
        )}
        <div className="space-y-3 p-4">
          <h1 className="text-lg font-semibold text-zinc-950">{project.name}</h1>
          {project.stage ? (
            <span className="inline-block rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-900 ring-1 ring-violet-200/70">
              {project.stage}
            </span>
          ) : null}
          {project.description ? (
            <p className="text-sm leading-relaxed text-zinc-700">{project.description}</p>
          ) : null}
          {project.revenueBand ? (
            <p className="text-xs text-zinc-500">
              收入区间（自述）：<span className="font-medium text-zinc-800">{project.revenueBand}</span>
            </p>
          ) : null}
          {project.teamNeeds ? (
            <div className="rounded-2xl bg-amber-50/80 p-3 ring-1 ring-amber-200/60">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-950">
                <Users className="h-3.5 w-3.5" />
                团队需求
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-amber-900/90">
                {project.teamNeeds}
              </p>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-1.5">
            {stack.map((s) => (
              <span
                key={s}
                className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 ring-1 ring-zinc-200/70"
              >
                {s}
              </span>
            ))}
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-fuchsia-50 px-2 py-0.5 text-[10px] font-medium text-fuchsia-800 ring-1 ring-fuchsia-200/60"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-2xl bg-zinc-950 px-3 py-2 text-xs font-semibold text-white"
              >
                <FolderGit2 className="h-3.5 w-3.5" />
                仓库
              </a>
            ) : null}
            {project.previewUrl ? (
              <a
                href={project.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-zinc-900 ring-1 ring-zinc-200/80"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                在线预览
              </a>
            ) : null}
            <Link
              href={`/collab/${project.id}`}
              className="inline-flex items-center gap-1 rounded-2xl bg-violet-100 px-3 py-2 text-xs font-semibold text-violet-900 ring-1 ring-violet-200/70"
            >
              协作看板
            </Link>
            <Link
              href={`/messages?peer=${encodeURIComponent(project.userId)}&intent=collab`}
              className="inline-flex items-center gap-1 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2 text-xs font-semibold text-white"
            >
              联系创始人
            </Link>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-2xl p-4 text-sm shadow-sm ring-1 ring-white/70">
        <p className="text-xs font-semibold text-zinc-900">创始人</p>
        <Link
          href={`/user/${project.userId}`}
          className="mt-2 inline-flex flex-wrap items-center gap-2 text-violet-800 hover:underline"
        >
          <span className="font-semibold">{project.user.displayName}</span>
          {role ? (
            <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-900 ring-1 ring-violet-200/60">
              {ROLE_LABEL[role]}
            </span>
          ) : null}
        </Link>
      </section>
    </div>
  );
}
