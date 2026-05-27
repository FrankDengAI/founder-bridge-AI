import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";
import { POST_TYPE_LABEL } from "@/lib/labels";
import { isPostType } from "@/lib/domain/postType";

export const dynamic = "force-dynamic";

export default async function CreatorPage() {
  const uid = await getUserIdFromCookies();
  if (!uid) {
    return (
      <div className="space-y-4 pb-10">
        <PageHeader
          title="创作者中心"
          subtitle="请先通过欢迎页登录后再查看你的内容。"
          backHref="/me"
        />
        <p className="glass-panel rounded-shell p-4 text-sm text-zinc-600 shadow-panel">
          未检测到登录会话。请前往{" "}
          <Link className="font-semibold text-brand-800 hover:underline" href="/welcome/login">
            欢迎页登录
          </Link>
          后再查看创作者数据。
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
        title="创作者中心"
        subtitle={`${user?.displayName ?? "创作者"} · 笔记 ${postCount} 条 · 累计 ♥ ${sumLikes._sum.likes ?? 0} · 收藏 ${sumSaves._sum.saves ?? 0}（演示指标）`}
        backHref="/me"
        right={
          <Link
            href="/publish"
            className="rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-2 text-[11px] font-semibold text-white shadow-glow"
          >
            发布
          </Link>
        }
      />

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { k: "笔记", v: postCount },
          { k: "累计点赞", v: sumLikes._sum.likes ?? 0 },
          { k: "累计收藏", v: sumSaves._sum.saves ?? 0 },
          { k: "近端排序", v: "最新优先" },
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
          <h2 className="text-sm font-semibold text-zinc-900">草稿箱</h2>
          <ul className="space-y-2">
            {drafts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/publish?draftId=${p.id}`}
                  className="glass-panel block rounded-shell px-3 py-3 text-sm ring-1 ring-amber-200/70"
                >
                  <span className="text-[10px] font-semibold text-amber-800">草稿</span>
                  <p className="mt-1 font-semibold text-zinc-950">{p.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-900">我的笔记</h2>
        <ul className="space-y-2">
          {posts.map((p) => {
            const label = isPostType(p.type) ? POST_TYPE_LABEL[p.type] : p.type;
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
                      ♥ {p.likes} · 收藏 {p.saves}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold text-brand-800">查看</span>
                </Link>
              </li>
            );
          })}
        </ul>
        {posts.length === 0 ? (
          <p className="glass-panel rounded-shell p-4 text-xs text-zinc-600 shadow-panel">
            暂无笔记，去发布一条吧。
          </p>
        ) : null}
      </section>
    </div>
  );
}
