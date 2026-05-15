"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ImagePlus, NotebookPen } from "lucide-react";
import clsx from "clsx";
import { LS_USER_ID } from "@/lib/clientSession";
import { DEMO_USER_ID } from "@/lib/constants";
import { POST_TYPES, isPostType } from "@/lib/domain/postType";
import { POST_TYPE_LABEL } from "@/lib/labels";

const STEPS = ["类型", "内容", "封面", "发布"] as const;

function currentUserId() {
  if (typeof window === "undefined") return DEMO_USER_ID;
  return localStorage.getItem(LS_USER_ID) || DEMO_USER_ID;
}

export function PublishWizard() {
  const router = useRouter();
  const userId = useMemo(() => currentUserId(), []);
  const [step, setStep] = useState(0);
  const [type, setType] = useState<string>("NOTE");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    setBusy(true);
    setErr(null);
    setToast(null);
    try {
      const tKey = isPostType(type) ? type : "NOTE";
      const typeTag = POST_TYPE_LABEL[tKey];
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId,
          title,
          excerpt,
          body,
          type,
          coverUrl: coverUrl.trim() || undefined,
          tags: ["VibeCoding", typeTag, "发布"],
        }),
      });
      if (!res.ok) throw new Error("发布失败");
      const data = (await res.json()) as { post: { id: string } };
      setToast("发布成功！正在跳转到笔记详情…");
      window.setTimeout(() => {
        router.push(`/post/${data.post.id}`);
        router.refresh();
      }, 450);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "发布失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {toast ? (
        <div
          className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-zinc-950 px-4 py-2 text-xs font-medium text-white shadow-lg motion-safe:animate-pulse"
          role="status"
        >
          {toast}
        </div>
      ) : null}
      <div className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-zinc-900">发布流程</p>
          <p className="text-[11px] font-semibold text-brand-900">
            第 {step + 1} / {STEPS.length} 步 · {STEPS[step]}
          </p>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={clsx(
                "flex shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-[11px] font-semibold",
                i === step
                  ? "border-brand-300 bg-brand-50 text-brand-950 shadow-sm"
                  : i < step
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-zinc-200/70 bg-white/70 text-zinc-600",
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : <span className="tabular-nums">{i + 1}</span>}
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        {step === 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-zinc-900">选择内容类型</p>
            <div className="grid grid-cols-2 gap-2">
              {POST_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={clsx(
                    "rounded-2xl border px-3 py-3 text-left text-xs font-semibold transition",
                    type === t
                      ? "border-brand-300 bg-brand-50 text-brand-950 shadow-sm"
                      : "border-zinc-200/80 bg-white/70 text-zinc-700 hover:border-zinc-300",
                  )}
                >
                  {POST_TYPE_LABEL[t]}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-zinc-900">填写正文</p>
            <label className="block text-[11px] font-medium text-zinc-600">
              标题
              <input
                className="mt-1 w-full rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="让人一眼想点进来的标题"
              />
            </label>
            <label className="block text-[11px] font-medium text-zinc-600">
              摘要
              <input
                className="mt-1 w-full rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="一句话概括亮点"
              />
            </label>
            <label className="block text-[11px] font-medium text-zinc-600">
              正文
              <textarea
                className="mt-1 min-h-[140px] w-full rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm leading-relaxed"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="记录你的过程、踩坑、提示词与交付结果…"
              />
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-zinc-900">封面图（可选）</p>
            <label className="block text-[11px] font-medium text-zinc-600">
              图片 URL
              <input
                className="mt-1 w-full rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="留空则自动生成封面"
              />
            </label>
            <div className="rounded-2xl border border-dashed border-zinc-300/80 bg-gradient-to-br from-brand-50 to-fuchsia-50 p-4 text-xs text-zinc-700">
              <div className="flex items-center gap-2 font-semibold text-zinc-900">
                <ImagePlus className="h-4 w-4" />
                下一步将写入 SQLite，并出现在「发现」信息流。
              </div>
              <p className="mt-2 leading-relaxed text-zinc-600">
                你也可以粘贴一张 `picsum.photos` 链接，或使用默认封面。
              </p>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200/70">
              <NotebookPen className="mt-0.5 h-5 w-5 text-brand-700" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900">确认发布</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                  将使用当前用户{" "}
                  <span className="rounded bg-white px-1 font-mono text-[11px] ring-1 ring-zinc-200">
                    {userId}
                  </span>{" "}
                  作为作者。发布后可从详情页点赞/收藏，并进入作者主页继续扩展。
                </p>
              </div>
            </div>
            {err ? <p className="text-xs font-medium text-red-600">{err}</p> : null}
          </div>
        ) : null}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0 || busy}
            className="flex-1 rounded-2xl bg-white px-3 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200/80 disabled:opacity-40"
          >
            上一步
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              disabled={(step === 1 && !title.trim()) || busy}
              onClick={next}
              className="flex-1 rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
            >
              下一步
            </button>
          ) : (
            <button
              type="button"
              disabled={!title.trim() || busy}
              onClick={() => void submit()}
              className="flex-1 rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
            >
              {busy ? "发布中…" : "发布到发现"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
