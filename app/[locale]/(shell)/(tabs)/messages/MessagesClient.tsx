"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  MessageCircle,
  Send,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
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
          "flex items-start gap-3 rounded-2xl px-3 py-2.5 transition",
          activePeer === thread.peerId
            ? "bg-brand-50 ring-1 ring-brand-200/70"
            : "bg-white/70 hover:bg-white ring-1 ring-zinc-200/70",
        ].join(" ")}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-fuchsia-600 text-white">
          <UserRound className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-zinc-950">{thread.peerName}</p>
            {thread.source === "match" ? (
              <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-bold text-violet-800">
                {t("fromMatch")}
              </span>
            ) : null}
            {thread.unread ? (
              <span className="shrink-0 rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                {t("new")}
              </span>
            ) : null}
          </div>
          <p className="truncate text-[11px] text-zinc-600">{thread.lastMessage || t("noPreview")}</p>
        </div>
      </Link>
    </li>
  );
}

export function MessagesClient() {
  const userId = useClientUserId();
  const t = useTranslations("pages.messages");
  const tMatch = useTranslations("match");
  const tCommon = useTranslations("common");
  const sp = useSearchParams();
  const peer = sp.get("peer") ?? "";
  const intentKey = sp.get("intent") ?? "";

  const { conversations: threads, refresh: refreshThreads } = useConversations(Boolean(userId));
  const [convId, setConvId] = useState<string | null>(null);
  const convIdRef = useRef<string | null>(null);
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<ApiMessage[]>([]);
  const [loadingPeer, setLoadingPeer] = useState(false);

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

  useEffect(() => {
    if (!userId || !peer) {
      setConvId(null);
      setMsgs([]);
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
      const list = await fetchMessages(opened.conversationId);
      if (!cancelled) {
        setMsgs(list);
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
        const list = await fetchMessages(id);
        if (!cancelled) {
          setMsgs(list);
          const last = list[list.length - 1];
          if (last && last.senderId !== userId) {
            await markConversationRead(id);
            notifyConversationsUpdated();
          }
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
  }, [userId, peer, intentKey, refreshThreads, tMatch]);

  const send = async () => {
    const text = draft.trim();
    if (!text || !convId || !userId) return;

    const ok = await sendMessage(convId, text);
    if (!ok) return;

    setDraft("");
    const list = await fetchMessages(convId);
    setMsgs(list);
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
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-white/80 px-2 py-2 ring-1 ring-zinc-200/70">
            <p className="text-lg font-bold text-zinc-900">{threads.length}</p>
            <p className="text-[10px] text-zinc-500">{t("statTotal")}</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-2 py-2 ring-1 ring-zinc-200/70">
            <p className="text-lg font-bold text-violet-700">{matchThreads.length}</p>
            <p className="text-[10px] text-zinc-500">{t("statMatch")}</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-2 py-2 ring-1 ring-zinc-200/70">
            <p className="text-lg font-bold text-rose-600">
              {threads.filter((th) => th.unread).length}
            </p>
            <p className="text-[10px] text-zinc-500">{t("statUnread")}</p>
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
            {msgs.map((m) => {
              const mine = m.senderId === userId;
              return (
                <div
                  key={m.id}
                  className={[
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
                    mine
                      ? "ml-auto bg-gradient-to-r from-brand-600 to-fuchsia-600 text-white"
                      : "mr-auto bg-white text-zinc-900 ring-1 ring-zinc-200/70",
                  ].join(" ")}
                >
                  {m.body}
                </div>
              );
            })}
          </div>

          <div className="border-t border-zinc-200/70 p-3">
            <div className="flex gap-2">
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
