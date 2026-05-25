# -*- coding: utf-8 -*-
"""Restore corrupted UTF-8 page files."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CREATOR = """import Link from "next/link";
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
      <motionlessDiv className="space-y-4 pb-10">
        <PageHeader
          title="创作者中心"
          subtitle="请先通过欢迎页登录后再查看你的内容。"
          backHref="/me"
        />
        <p className="glass-panel rounded-shell p-4 text-sm text-zinc-600 shadow-panel">
          未检测到登录会话。请前往{" "}
          <Link className="font-semibold text-brand-800" href="/welcome">
            /welcome
          </Link>{" "}
          完成登录。
        </p>
      </motionlessDiv>
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
    <motionlessDiv className="space-y-4 pb-10">
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
          <motionlessDiv
            key={x.k}
            className="glass-panel rounded-shell px-3 py-3 text-center shadow-panel ring-1 ring-white/70"
          >
            <p className="text-lg font-bold tabular-nums text-zinc-900">{x.v}</p>
            <p className="text-[10px] font-medium text-zinc-500">{x.k}</p>
          </motionlessDiv>
        ))}
      </section>

      {drafts.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-zinc-900">草稿箱</h2>
          <ul className="space-y-2">
            {drafts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/post/${p.id}`}
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
                  <motionlessDiv className="min-w-0">
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-900 ring-1 ring-brand-200/60">
                      {label}
                    </span>
                    <p className="mt-1 truncate text-sm font-semibold text-zinc-950">{p.title}</p>
                    <p className="text-[11px] text-zinc-500">
                      ♥ {p.likes} · 收藏 {p.saves}
                    </p>
                  </motionlessDiv>
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
    </motionlessDiv>
  );
}
"""

ORDERS = """import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";

export const dynamic = "force-dynamic";

function formatPrice(cents: number) {
  return `¥${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export default async function OrdersPage() {
  const uid = await getUserIdFromCookies();
  if (!uid) {
    return (
      <motionlessDiv className="space-y-4 pb-10">
        <PageHeader title="订单与心愿单" backHref="/tools" />
        <p className="glass-panel rounded-shell p-4 text-sm text-zinc-600 shadow-panel">
          请先登录后查看演示订单与心愿单。
        </p>
      </motionlessDiv>
    );
  }

  const [wishlist, orders] = await Promise.all([
    prisma.wishlistItem.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "desc" },
      include: { market: true },
    }),
    prisma.demoOrder.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "desc" },
      include: { market: true },
    }),
  ]);

  return (
    <motionlessDiv className="space-y-4 pb-10">
      <PageHeader
        title="订单与心愿单"
        subtitle="演示级：PostgreSQL 存储心愿单与模拟订单，不含真实支付。"
        backHref="/tools"
      />

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-900">心愿单</h2>
        <ul className="space-y-2">
          {wishlist.map((w) => (
            <li
              key={w.id}
              className="glass-panel flex items-center justify-between gap-3 rounded-shell px-3 py-3 shadow-panel ring-1 ring-white/70"
            >
              <motionlessDiv className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-950">{w.market.title}</p>
                <p className="text-[11px] text-zinc-500">{w.market.itemType}</p>
              </motionlessDiv>
              <Link
                href={`/market/${w.marketId}`}
                className="shrink-0 rounded-xl bg-brand-50 px-3 py-1.5 text-[11px] font-semibold text-brand-900 ring-1 ring-brand-200/70"
              >
                详情
              </Link>
            </li>
          ))}
        </ul>
        {wishlist.length === 0 ? (
          <p className="text-xs text-zinc-500">暂无心愿单条目。在工具商城点击「加入心愿单」。</p>
        ) : null}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-900">演示订单</h2>
        <ul className="space-y-2">
          {orders.map((o) => (
            <li
              key={o.id}
              className="glass-panel flex items-center justify-between gap-3 rounded-shell px-3 py-3 shadow-panel ring-1 ring-white/70"
            >
              <motionlessDiv className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-950">{o.market.title}</p>
                <p className="text-[11px] text-zinc-500">
                  {formatPrice(o.market.priceCents)} · {o.status} ·{" "}
                  {o.createdAt.toLocaleDateString("zh-CN")}
                </p>
              </motionlessDiv>
            </li>
          ))}
        </ul>
        {orders.length === 0 ? (
          <p className="text-xs text-zinc-500">暂无订单。完成商品详情页的模拟支付即可写入。</p>
        ) : null}
      </section>
    </motionlessDiv>
  );
}
"""


def fix_divs(text: str) -> str:
    return text.replace("motionlessDiv", "motionlessDiv").replace("<motionlessDiv", "<div").replace("</motionlessDiv>", "</motionlessDiv>").replace("motionlessDiv", "motionlessDiv")


def write(rel: str, content: str) -> None:
    text = content.replace("motionlessDiv", "div")
    path = ROOT / rel
    path.write_text(text, encoding="utf-8")
    print(f"wrote {rel} ({len(text)} bytes)")


if __name__ == "__main__":
    write("app/(shell)/(tabs)/creator/page.tsx", CREATOR)
    write("app/(shell)/(tabs)/orders/page.tsx", ORDERS)
