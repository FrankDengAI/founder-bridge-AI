import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

type Props = { params: { projectId: string } };

export const dynamic = "force-dynamic";

const DEMO_TASKS = [
  { id: "t1", title: "对齐 MVP 范围与里程碑", done: true },
  { id: "t2", title: "完成匹配画像并联系 2 位候选", done: true },
  { id: "t3", title: "发布招募帖并收集反馈", done: false },
] as const;

const COLUMN_KEYS = ["columnTodo", "columnInProgress", "columnDone"] as const;

export default async function CollabPage({ params }: Props) {
  const tPage = await getTranslations("pages.collab");
  const t = await getTranslations("collab");
  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
    include: { user: { select: { displayName: true } } },
  });
  if (!project) notFound();

  return (
    <div className="space-y-4 pb-10">
      <PageHeader
        title={tPage("title")}
        subtitle={t("subtitle", { projectName: project.name })}
        backHref={`/project/${project.id}`}
      />

      <p className="text-xs text-zinc-600">
        {t("organizerHint", { name: project.user.displayName })}
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {COLUMN_KEYS.map((colKey, ci) => (
          <section
            key={colKey}
            className="glass-panel rounded-2xl p-3 ring-1 ring-white/70"
          >
            <p className="text-xs font-semibold text-zinc-900">{t(colKey)}</p>
            <ul className="mt-2 space-y-2">
              {DEMO_TASKS.filter((task, i) => {
                if (ci === 0) return !task.done && i === 2;
                if (ci === 1) return !task.done && i < 2;
                return task.done;
              }).map((task) => (
                <li
                  key={task.id}
                  className="flex items-start gap-2 rounded-xl bg-white/80 p-2.5 text-[11px] ring-1 ring-zinc-200/70"
                >
                  {task.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-zinc-400" />
                  )}
                  <span className="text-zinc-800">{task.title}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Link
        href={`/messages?peer=${encodeURIComponent(project.userId)}&intent=collab`}
        className="inline-flex rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-xs font-semibold text-white"
      >
        {t("syncInMessages")}
      </Link>
    </div>
  );
}
