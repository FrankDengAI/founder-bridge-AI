"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Check, ImagePlus, NotebookPen } from "lucide-react";
import clsx from "clsx";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { UiToast } from "@/components/ui/UiToast";
import { LearnPublishHint } from "@/components/learn/LearnPublishHint";
import { useClientUserId, useClientUserReady } from "@/lib/hooks/useClientUserId";
import { POST_TYPES, isPostType } from "@/lib/domain/postType";
import { completeActivationStep } from "@/lib/activation";
import { recordGamifyEvent } from "@/lib/gamification";
import {
  clearPublishDraftLocal,
  readPublishDraftLocal,
  savePublishDraftLocal,
} from "@/lib/retention";
import { getPostTypeLabel } from "@/lib/labels";

const STEP_KEYS = ["stepType", "stepContent", "stepCover", "stepConfirm"] as const;

export function PublishWizard() {
  const t = useTranslations("publish");
  const tw = useTranslations("publishWizard");
  const tCommon = useTranslations("common");
  const tPost = useTranslations("postType");
  const router = useRouter();
  const searchParams = useSearchParams();
  const steps = useMemo(() => STEP_KEYS.map((k) => t(k)), [t]);
  const userId = useClientUserId();
  const userReady = useClientUserReady();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<string>("NOTE");
  const [linkedModelId, setLinkedModelId] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [recruitRole, setRecruitRole] = useState("ADC");
  const [recruitTime, setRecruitTime] = useState(() => tw("defaultRecruitTime"));
  const [recruitComp, setRecruitComp] = useState(() => tw("defaultRecruitComp"));
  const [previewMd, setPreviewMd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);

  const isRecruit = type === "RECRUIT";

  useEffect(() => {
    const d = readPublishDraftLocal();
    if (d?.title && typeof d.title === "string") setTitle(d.title as string);
    if (d?.excerpt && typeof d.excerpt === "string") setExcerpt(d.excerpt as string);
    if (d?.body && typeof d.body === "string") setBody(d.body as string);
    if (d?.type && typeof d.type === "string") setType(d.type as string);
  }, []);

  useEffect(() => {
    const qType = searchParams.get("type");
    const qModelId = searchParams.get("modelId")?.trim() ?? "";
    const qDraftId = searchParams.get("draftId")?.trim() ?? "";
    if (qType && isPostType(qType)) {
      setType(qType);
      if (qType === "MODEL_DISCUSSION") setStep(1);
    }
    if (qModelId) setLinkedModelId(qModelId);
    if (qDraftId) {
      setDraftId(qDraftId);
      void fetch(`/api/posts/${qDraftId}`, { credentials: "include" })
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { post?: Record<string, unknown> } | null) => {
          const post = data?.post;
          if (!post) return;
          if (typeof post.title === "string") setTitle(post.title);
          if (typeof post.excerpt === "string") setExcerpt(post.excerpt);
          if (typeof post.body === "string") setBody(post.body);
          if (typeof post.type === "string" && isPostType(post.type)) setType(post.type);
          if (typeof post.coverUrl === "string") setCoverUrl(post.coverUrl);
          if (typeof post.linkedModelId === "string") setLinkedModelId(post.linkedModelId);
          if (post.type === "RECRUIT" && typeof post.meta === "string") {
            try {
              const meta = JSON.parse(post.meta) as Record<string, string>;
              if (meta.recruitRole) setRecruitRole(meta.recruitRole);
              if (meta.recruitTime) setRecruitTime(meta.recruitTime);
              if (meta.recruitComp) setRecruitComp(meta.recruitComp);
            } catch {
              /* ignore */
            }
          }
          setStep(1);
        })
        .catch(() => setErr(tw("loadDraftFail")));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!title.trim() && !body.trim()) return;
    const t = window.setTimeout(() => {
      savePublishDraftLocal({ title, excerpt, body, type });
    }, 800);
    return () => window.clearTimeout(t);
  }, [title, excerpt, body, type]);

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const payloadMeta = useMemo(() => {
    if (!isRecruit) return undefined;
    return {
      recruitRole,
      recruitTime,
      recruitComp,
    };
  }, [isRecruit, recruitRole, recruitTime, recruitComp]);

  const submit = async (asDraft: boolean) => {
    if (!userReady) return;
    if (!userId) {
      setErr(t("loginFirst"));
      router.push("/welcome/login");
      return;
    }
    setBusy(true);
    setErr(null);
    setToast(null);
    try {
      const tKey = isPostType(type) ? type : "NOTE";
      const typeTag = getPostTypeLabel(tPost, tKey);
      const payload = {
        title,
        excerpt,
        body,
        type,
        status: asDraft ? "draft" : "published",
        meta: payloadMeta,
        coverUrl: coverUrl.trim() || undefined,
        tags: ["VibeCoding", typeTag, asDraft ? tw("tagDraft") : tw("tagPublish")],
        linkedModelId: linkedModelId.trim() || undefined,
      };
      const res = await fetch(draftId ? `/api/posts/${draftId}` : "/api/posts", {
        method: draftId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(asDraft ? tw("saveDraftFail") : tw("publishFail"));
      recordGamifyEvent("publish_1");
      if (tKey === "MODEL_DISCUSSION") recordGamifyEvent("model_discussion_first");
      const data = (await res.json()) as { post: { id: string } };
      const postId = draftId ?? data.post.id;
      if (asDraft) {
        savePublishDraftLocal({ title, excerpt, body, type });
        setToast(t("draftSaved"));
        return;
      }
      clearPublishDraftLocal();
      completeActivationStep("week_publish_or_learn");
      setToast(t("publishOk"));
      window.setTimeout(() => {
        router.push(`/post/${postId}`);
        router.refresh();
      }, 450);
    } catch (e) {
      setErr(e instanceof Error ? e.message : tw("opFail"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {draftId ? (
        <div className="rounded-2xl bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-900 ring-1 ring-amber-200/70">
          {t("draftBanner")}
        </div>
      ) : null}
      {linkedModelId && type === "MODEL_DISCUSSION" ? (
        <div className="rounded-2xl bg-violet-50 px-3 py-2 text-[11px] font-medium text-violet-900 ring-1 ring-violet-200/70">
          {t("modelLinkBanner")}
        </div>
      ) : null}
      <UiToast message={toast} />
      <div className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-zinc-900">{t("title")}</p>
          <p className="text-[11px] font-semibold text-brand-900">
            {step + 1} / {steps.length} · {steps[step]}
          </p>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((label, i) => (
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
            <p className="text-sm font-semibold text-zinc-900">{tw("chooseType")}</p>
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
                  {getPostTypeLabel(tPost, t)}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-zinc-900">{tw("fillContent")}</p>
            {isRecruit ? (
              <div className="grid gap-2 rounded-2xl bg-violet-50/80 p-3 ring-1 ring-violet-200/60">
                <label className="text-[11px] font-medium text-zinc-700">
                  {tw("recruitRole")}
                  <select
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                    value={recruitRole}
                    onChange={(e) => setRecruitRole(e.target.value)}
                  >
                    <option value="ADC">{tw("recruitRoleAdc")}</option>
                    <option value="SUPPORT">{tw("recruitRoleSupport")}</option>
                    <option value="JUNGLE">{tw("recruitRoleJungle")}</option>
                  </select>
                </label>
                <label className="text-[11px] font-medium text-zinc-700">
                  {tw("recruitTime")}
                  <input
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                    value={recruitTime}
                    onChange={(e) => setRecruitTime(e.target.value)}
                  />
                </label>
                <label className="text-[11px] font-medium text-zinc-700">
                  {tw("recruitComp")}
                  <input
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                    value={recruitComp}
                    onChange={(e) => setRecruitComp(e.target.value)}
                  />
                </label>
              </div>
            ) : null}
            <label className="block text-[11px] font-medium text-zinc-600">
              {tw("titleLabel")}
              <input
                className="mt-1 w-full rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={tw("titlePlaceholder")}
              />
            </label>
            <label className="block text-[11px] font-medium text-zinc-600">
              {tw("excerptLabel")}
              <input
                className="mt-1 w-full rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder={tw("excerptPlaceholder")}
              />
            </label>
            <label className="block text-[11px] font-medium text-zinc-600">
              {tw("bodyLabel")}
              <textarea
                className="mt-1 min-h-[140px] w-full rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 font-mono text-sm leading-relaxed"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={tw("bodyPlaceholder")}
              />
            </label>
            <button
              type="button"
              onClick={() => setPreviewMd((v) => !v)}
              className="text-[11px] font-semibold text-violet-800 hover:underline"
            >
              {previewMd ? tw("hidePreview") : tw("mdPreview")}
            </button>
            {previewMd && body.trim() ? (
              <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-3">
                <MarkdownPreview source={body} />
              </div>
            ) : null}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-zinc-900">{tw("coverOptional")}</p>
            <label className="block text-[11px] font-medium text-zinc-600">
              {tw("coverUrlLabel")}
              <input
                className="mt-1 w-full rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder={tw("coverPlaceholder")}
              />
            </label>
            <div className="rounded-2xl border border-dashed border-zinc-300/80 bg-gradient-to-br from-brand-50 to-fuchsia-50 p-4 text-xs text-zinc-700">
              <div className="flex items-center gap-2 font-semibold text-zinc-900">
                <ImagePlus className="h-4 w-4" />
                {tw("coverHintTitle")}
              </div>
              <p className="mt-2 leading-relaxed text-zinc-600">{tw("coverHintDesc")}</p>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200/70">
              <NotebookPen className="mt-0.5 h-5 w-5 text-brand-700" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900">{tw("confirmTitle")}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                  {!userReady ? (
                    t("confirmLogin")
                  ) : userId ? (
                    t("confirmAsUser")
                  ) : (
                    <>
                      {t("confirmNeedLogin")}{" "}
                      <Link href="/welcome/login" className="font-semibold text-violet-700 hover:underline">
                        {tCommon("login")}
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </div>
            <LearnPublishHint />
            {err ? <p className="text-xs font-medium text-red-600">{err}</p> : null}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0 || busy}
            className="min-w-[88px] flex-1 rounded-2xl bg-white px-3 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200/80 disabled:opacity-40"
          >
            {tCommon("back")}
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              disabled={(step === 1 && !title.trim()) || busy}
              onClick={next}
              className="min-w-[88px] flex-1 rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
            >
              {tCommon("next")}
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={!title.trim() || busy}
                onClick={() => void submit(true)}
                className="rounded-2xl bg-white px-3 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200/80 disabled:opacity-50"
              >
                {t("saveDraft")}
              </button>
              <button
                type="button"
                disabled={!title.trim() || busy}
                onClick={() => void submit(false)}
                className="min-w-[88px] flex-1 rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-3 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
              >
                {busy ? t("publishing") : t("publishFeed")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
