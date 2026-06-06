"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ImagePlus,
  MessageCircle,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { completeMission, MESSAGE_INTENT_TEMPLATES } from "@/lib/retention";
import { prependLocalNotif } from "@/lib/notificationsLocal";
import {
  fetchMessages,
  markConversationRead,
  sendMessage,
  startConversation,
  type ApiMessage,
  type ApiThread,
} from "@/lib/chat/client";
import { completeActivationStep } from "@/lib/activation";
import { recordGamifyEvent } from "@/lib/gamification";
import { useClientUserId } from "@/lib/hooks/useClientUserId";
import {
  notifyConversationsUpdated,
  useConversations,
} from "@/lib/hooks/useConversationStats";

const MSG_POLL_VISIBLE_MS = 5000;
const MSG_POLL_HIDDEN_MS = 20000;

function sortThreads(threads: ApiThread[]): ApiThread[] {
  return [...threads].sort((a, b) => {
    if (a.unread !== b.unread) return a.unread ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });
}

function ThreadRow({
  thread,
  activePeer,
  t,
}: {
  thread: ApiThread;
  activePeer: string;
  t: (key: string) => string;
}) {
  return (
    <li>
      <Link
        href={`/messages?peer=${encodeURIComponent(thread.peerId)}`}
        className={[
          "relative flex items-start gap-3 rounded-2xl px-3 py-2.5 transition",
          thread.unread ? "border-l-4 border-l-rose-500 pl-2" : "",
          activePeer === thread.peerId
            ? "bg-brand-50 ring-1 ring-brand-200/70"
            : "bg-white/70 hover:bg-white ring-1 ring-zinc-200/70",
        ].join(" ")}
      >
        <UserAvatar userId={thread.peerId} displayName={thread.peerName} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={[
                "truncate text-sm text-zinc-950",
                thread.unread ? "font-bold" : "font-semibold",
              ].join(" ")}
            >
              {thread.peerName}
            </p>
            {thread.source === "match" ? (
              <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-bold text-violet-800">
                {t("fromMatch")}
              </span>
            ) : null}
            {thread.unread ? (
              <span className="shrink-0 rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                {t("unreadBadge")}
              </span>
            ) : null}
          </div>
          <p className="truncate text-[11px] text-zinc-600">{thread.lastMessage || t("noPreview")}</p>
        </div>
      </Link>
    </li>
  );
}

function MessageBubble({
  m,
  mine,
  peerLastReadAt,
  t,
}: {
  m: ApiMessage;
  mine: boolean;
  peerLastReadAt: number | null;
  t: (key: string) => string;
}) {
  const meta = m.meta ?? {};
  const isImage = meta.type === "image" && typeof meta.url === "string";
  const read =
    mine && peerLastReadAt !== null && peerLastReadAt >= m.createdAt;

  return (
    <div className={mine ? "ml-auto max-w-[85%]" : "mr-auto max-w-[85%]"}>
      <div
        className={[
          "rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
          mine
            ? "bg-gradient-to-r from-brand-600 to-fuchsia-600 text-white"
            : "bg-white text-zinc-900 ring-1 ring-zinc-200/70",
        ].join(" ")}
      >
        {isImage ? (
          <a href={meta.url as string} target="_blank" rel="noopener noreferrer">
            <Image
              src={meta.url as string}
              alt=""
              width={240}
              height={180}
              className="max-h-48 rounded-xl object-cover"
              unoptimized
            />
          </a>
        ) : null}
        {m.body && m.body !== "[image]" ? (
          <p className={isImage ? "mt-2" : ""}>{m.body}</p>
        ) : null}
      </div>
      {read ? (
        <p className="mt-0.5 text-right text-[9px] text-zinc-400">{t("readReceipt")}</p>
      ) : null}
    </div>
  );
}

export function MessagesClient() {
  const userId = useClientUserId();
  const t = useTranslations("pages.messages");
  const tMod = useTranslations("moderation");
  const tMatch = useTranslations("match");
  const tCommon = useTranslations("common");
  const sp = useSearchParams();
  const peer = sp.get("peer") ?? "";
  const intentKey = sp.get("intent") ?? "";
  const fileRef = useRef<HTMLInputElement>(null);

  const { conversations: rawThreads, refresh: refreshThreads } = useConversations(
    Boolean(userId),
  );
  const threads = useMemo(() => sortThreads(rawThreads), [rawThreads]);

  const [convId, setConvId] = useState<string | null>(null);
  const convIdRef = useRef<string | null>(null);
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<ApiMessage[]>([]);
  const [peerLastReadAt, setPeerLastReadAt] = useState<number | null>(null);
  const [loadingPeer, setLoadingPeer] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const active = useMemo(
    () => threads.find((th) => th.peerId === peer) ?? null,
    [peer, threads],
  );

  const matchThreads = useMemo(
    () => threads.filter((th) => th.source === "match"),
    [threads],
  );
  const otherThreads = useMemo(
    () => threads.filter((th) => th.source !== "match"),
    [threads],
  );

  useEffect(() => {
    convIdRef.current = convId;
  }, [convId]);

  useEffect(() => {
    setDraft("");
  }, [peer, intentKey]);

  const loadMessages = async (id: string) => {
    const { messages: list, peerLastReadAt: plr } = await fetchMessages(id);
    setMsgs(list);
    setPeerLastReadAt(plr);
    return list;
  };

  useEffect(() => {
    if (!userId || !peer) {
      setConvId(null);
      setMsgs([]);
      setPeerLastReadAt(null);
      return;
    }

    let cancelled = false;
    setLoadingPeer(true);

    void (async () => {
      const opened = await startConversation(peer, {
        source: intentKey === "match" ? "match" : undefined,
        contextTitle: intentKey === "match" ? tMatch("title") : undefined,
      });
      if (cancelled || !opened) {
        setLoadingPeer(false);
        return;
      }

      setConvId(opened.conversationId);
      convIdRef.current = opened.conversationId;
      await markConversationRead(opened.conversationId);
      notifyConversationsUpdated();
      const list = await loadMessages(opened.conversationId);
      if (!cancelled) {
        if (intentKey && MESSAGE_INTENT_TEMPLATES[intentKey] && list.length === 0) {
          setDraft(MESSAGE_INTENT_TEMPLATES[intentKey]);
        }
        setLoadingPeer(false);
      }
      await refreshThreads();
    })();

    let intervalId = 0;
    const armPoll = () => {
      window.clearInterval(intervalId);
      const ms = document.hidden ? MSG_POLL_HIDDEN_MS : MSG_POLL_VISIBLE_MS;
      intervalId = window.setInterval(async () => {
        const id = convIdRef.current;
        if (!id || cancelled) return;
        const list = await loadMessages(id);
        const last = list[list.length - 1];
        if (last && last.senderId !== userId) {
          await markConversationRead(id);
          notifyConversationsUpdated();
        }
      }, ms);
    };
    armPoll();
    const onVisibility = () => armPoll();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- peer/intent drive reload
  }, [userId, peer, intentKey, refreshThreads, tMatch]);

  const send = async () => {
    const text = draft.trim();
    if (!text || !convId || !userId) return;
    setSendError(null);

    const res = await fetch(`/api/conversations/${convId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ body: text }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (body.error === "profanity") {
        setSendError(tMod("warning"));
        return;
      }
      return;
    }

    setDraft("");
    await loadMessages(convId);
    await refreshThreads();
    notifyConversationsUpdated();
    completeMission("send_message");
    recordGamifyEvent("first_message");
    completeActivationStep("first_message");
    prependLocalNotif({
      id: `msg_sent_${Date.now()}`,
      title: t("sent"),
      body: t("sentHint"),
      at: t("justNow"),
    });
  };

  const uploadImage = async (file: File) => {
    if (!convId || !userId) return;
    setSendError(null);
    if (file.size > 2 * 1024 * 1024) {
      setSendError(t("imageTooLarge"));
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setSendError(t("imageTypeInvalid"));
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    const up = await fetch("/api/upload", { method: "POST", credentials: "include", body: fd });
    if (!up.ok) {
      setSendError(t("imageTypeInvalid"));
      return;
    }
    const { url } = (await up.json()) as { url: string };
    const ok = await sendMessage(convId, "", { type: "image", url });
    if (!ok) return;
    await loadMessages(convId);
    await refreshThreads();
    notifyConversationsUpdated();
  };

  if (!userId) {
    return (
      <div className="space-y-3 pb-4">
        <PageHeader title={t("title")} subtitle={t("loginRequired")} backHref="/home" />
        <p className="rounded-2xl bg-white/80 p-4 text-sm text-zinc-600 ring-1 ring-zinc-200">
          {t("loginHint")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <PageHeader title={t("title")} subtitle={t("teamSubtitle")} />

      <div className="rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-50/80 via-white to-fuchsia-50/50 p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-zinc-950">
              <Users className="h-4 w-4 text-violet-600" />
              {t("teamHubTitle")}
            </p>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-zinc-600">{t("teamHubDesc")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/match"
              className="inline-flex items-center gap-1 rounded-xl bg-violet-600 px-3 py-2 text-[11px] font-semibold text-white hover:opacity-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t("goMatch")}
            </Link>
            <Link
              href="/publish?type=RECRUIT"
              className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-[11px] font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              {t("postRecruit")}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <aside className="glass-panel rounded-3xl p-3 shadow-sm lg:col-span-2">
          <p className="px-1 pb-2 text-xs font-semibold text-zinc-900">{t("conversations")}</p>

          {threads.length === 0 ? (
            <p className="rounded-2xl bg-white/70 p-3 text-xs leading-relaxed text-zinc-600 ring-1 ring-zinc-200/70">
              {t("noConversations")}
            </p>
          ) : null}

          {matchThreads.length > 0 ? (
            <div className="mb-3">
              <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-wide text-violet-700">
                {t("sectionMatch")}
              </p>
              <ul className="space-y-2">
                {matchThreads.map((thread) => (
                  <ThreadRow key={thread.id} thread={thread} activePeer={peer} t={t} />
                ))}
              </ul>
            </div>
          ) : null}

          {otherThreads.length > 0 ? (
            <div>
              <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                {t("sectionOther")}
              </p>
              <ul className="space-y-2">
                {otherThreads.map((thread) => (
                  <ThreadRow key={thread.id} thread={thread} activePeer={peer} t={t} />
                ))}
              </ul>
            </div>
          ) : null}
        </aside>

        <section className="glass-panel flex min-h-[520px] flex-col rounded-3xl shadow-soft ring-1 ring-white/70 lg:col-span-3">
          <div className="border-b border-zinc-200/70 px-4 py-3">
            <p className="text-sm font-semibold text-zinc-950">
              {peer ? active?.peerName || t("chatTitle") : t("selectConversation")}
            </p>
            <p className="text-[11px] text-zinc-500">
              {peer
                ? loadingPeer
                  ? tCommon("loading")
                  : active?.contextTitle
                    ? t("context", { title: active.contextTitle })
                    : t("chatHint")
                : t("selectHint")}
            </p>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
            {!peer ? (
              <div className="mt-10 text-center text-sm text-zinc-600">
                <MessageCircle className="mx-auto mb-2 h-8 w-8 text-zinc-400" />
                {t("selectToChat")}
              </div>
            ) : null}
            {msgs.map((m) => (
              <MessageBubble
                key={m.id}
                m={m}
                mine={m.senderId === userId}
                peerLastReadAt={peerLastReadAt}
                t={t}
              />
            ))}
          </div>

          <div className="border-t border-zinc-200/70 p-3">
            {sendError ? <p className="mb-2 text-xs text-red-600">{sendError}</p> : null}
            <div className="flex gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadImage(f);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                disabled={!peer || !convId}
                onClick={() => fileRef.current?.click()}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 disabled:opacity-40"
                aria-label={t("attachImage")}
              >
                <ImagePlus className="h-4 w-4" />
              </button>
              <input
                disabled={!peer || !convId}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void send()}
                placeholder={peer ? t("inputPlaceholder") : t("selectFirst")}
                className="flex-1 rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm outline-none disabled:opacity-50"
              />
              <button
                type="button"
                disabled={!peer || !convId}
                onClick={() => void send()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-white disabled:opacity-40"
                aria-label={t("send")}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
