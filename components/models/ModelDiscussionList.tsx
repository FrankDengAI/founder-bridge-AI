import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { POST_TYPE_LABEL } from "@/lib/labels";

export type ModelDiscussionRow = {
  id: string;
  title: string;
  excerpt: string;
  likes: number;
  createdAt: string;
};

type Props = {
  modelId: string;
  modelName: string;
  posts: ModelDiscussionRow[];
};

export function ModelDiscussionList({ modelId, modelName, posts }: Props) {
  const publishHref = `/publish?type=MODEL_DISCUSSION&modelId=${encodeURIComponent(modelId)}`;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-900">社区讨论</h2>
        <Link
          href={publishHref}
          className="inline-flex items-center gap-1 rounded-full bg-zinc-950 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-zinc-800"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          发起讨论
        </Link>
      </div>
      <p className="text-[11px] leading-relaxed text-zinc-600">
        围绕 <span className="font-semibold text-violet-800">{modelName}</span> 的真实体验、选型与踩坑，讨论帖会关联到本模型页。
      </p>
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-violet-200/80 bg-gradient-to-br from-violet-50/60 to-white p-5 text-center ring-1 ring-violet-100/70">
          <p className="text-xs font-semibold text-zinc-900">还没有讨论帖</p>
          <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
            试试这些话题：写前端稳不稳？和 GPT-4 比性价比如何？长上下文会不会丢指令？
          </p>
          <Link
            href={publishHref}
            className="mt-3 inline-flex items-center gap-1 rounded-full bg-zinc-950 px-4 py-2 text-[11px] font-semibold text-white hover:bg-zinc-800"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            做第一个讨论的人
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/post/${p.id}`}
                className="block rounded-2xl bg-white/85 p-3 ring-1 ring-zinc-200/70 transition hover:ring-violet-300/60"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-zinc-950">{p.title}</p>
                  <span className="shrink-0 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-800">
                    {POST_TYPE_LABEL.MODEL_DISCUSSION}
                  </span>
                </div>
                {p.excerpt ? (
                  <p className="mt-1 line-clamp-2 text-[11px] text-zinc-600">{p.excerpt}</p>
                ) : null}
                <p className="mt-2 text-[10px] text-zinc-500">
                  {p.likes} 赞 · {new Date(p.createdAt).toLocaleDateString("zh-CN")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
