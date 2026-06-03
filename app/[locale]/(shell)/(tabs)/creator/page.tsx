import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";
import { getPostTypeLabel } from "@/lib/labels";
import { isPostType } from "@/lib/domain/postType";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function CreatorPage() {
  const t = await getTranslations("pages.creator");
  const tPost = await getTranslations("postType");
  const uid = await getUserIdFromCookies();
  if (!uid) {
    return (
      <div className="space-y-4 pb-10">
        <PageHeader title={t("title")} subtitle={t("loginRequired")} backHref="/home" />
        <p className="glass-panel rounded-shell p-4 text-sm text-zinc-600 shadow-panel">
          {t("noSession")}
        </p>
      </div>
    );
  }

  const [posts, drafts, postCount, sumLikes, sumSaves] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: uid, status: "published" },
      orderBy: { createdAt: "desc" },
      take: 60,
    }),
    prisma.post.findMany({
      where: { authorId: uid, status: "draft" },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.post.count({ where: { authorId: uid } }),
    prisma.post.aggregate({
      where: { authorId: uid },
      _sum: { likes: true },
    }),
    prisma.post.aggregate({
      where: { authorId: uid },
      _sum: { saves: true },
    }),
  ]);

  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: { displayName: true },
  });

  return (
    <div className="space-y-4 pb-10">
      <PageHeader
        title={t("title")}
        subtitle={t("stats", {
          name: user?.displayName ?? t("title"),
          notes: postCount,
          likes: sumLikes._sum.likes ?? 0,
          saves: sumSaves._sum.saves ?? 0,
        })}
        backHref="/me"
        right={
          <Link
            href="/publish"
            className="rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-2 text-[11px] font-semibold text-white shadow-glow"
          >
            {t("publish")}
          </Link>
        }
      />

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { k: t("statNotes"), v: postCount },
          { k: t("statLikes"), v: sumLikes._sum.likes ?? 0 },
          { k: t("statSaves"), v: sumSaves._sum.saves ?? 0 },
          { k: t("sortMode"), v: t("newestFirst") },
        ].map((x) => (
          <div
            key={x.k}
            className="glass-panel rounded-shell px-3 py-3 text-center shadow-panel ring-1 ring-white/70"
          >
            <p className="text-lg font-bold tabular-nums text-zinc-900">{x.v}</p>
            <p className="text-[10px] font-medium text-zinc-500">{x.k}</p>
          </div>
        ))}
      </section>

      {drafts.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-zinc-900">{t("drafts")}</h2>
          <ul className="space-y-2">
            {drafts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/publish?draftId=${p.id}`}
                  className="glass-panel block rounded-shell px-3 py-3 text-sm ring-1 ring-amber-200/70"
                >
                  <span className="text-[10px] font-semibold text-amber-800">{t("draft")}</span>
                  <p className="mt-1 font-semibold text-zinc-950">{p.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-900">{t("myNotes")}</h2>
        <ul className="space-y-2">
          {posts.map((p) => {
            const label = isPostType(p.type) ? getPostTypeLabel(tPost, p.type) : p.type;
            return (
              <li key={p.id}>
                <Link
                  href={`/post/${p.id}`}
                  className="glass-panel flex items-center justify-between gap-3 rounded-shell px-3 py-3 shadow-panel ring-1 ring-white/70 transition hover:shadow-glow"
                >
                  <div className="min-w-0">
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-900 ring-1 ring-brand-200/60">
                      {label}
                    </span>
                    <p className="mt-1 truncate text-sm font-semibold text-zinc-950">{p.title}</p>
                    <p className="text-[11px] text-zinc-500">
                      {t("engagement", { likes: p.likes, saves: p.saves })}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold text-brand-800">{t("view")}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        {posts.length === 0 ? (
          <p className="glass-panel rounded-shell p-4 text-xs text-zinc-600 shadow-panel">
            {t("empty")}
          </p>
        ) : null}
      </section>
    </div>
  );
}
