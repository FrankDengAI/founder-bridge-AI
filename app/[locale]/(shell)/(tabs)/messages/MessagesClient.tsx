"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Send, UserRound } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { completeMission, MESSAGE_INTENT_TEMPLATES } from "@/lib/retention";
import { prependLocalNotif } from "@/lib/notificationsLocal";
import {
  fetchMessages,
  markConversationRead,
  sendMessage,
  startConversation,
  type ApiMessage,
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

export function MessagesClient() {
  const userId = useClientUserId();
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
    () => threads.find((t) => t.peerId === peer) ?? null,
    [peer, threads],
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
        contextTitle: intentKey === "match" ? "创业伙伴匹配" : undefined,
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
  }, [userId, peer, intentKey, refreshThreads]);

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
      title: "消息已发出",
      body: "对方可能稍后回复，记得回来查看会话。",
      at: "刚刚",
    });
  };

  if (!userId) {
    return (
      <div className="space-y-3 pb-4">
        <PageHeader title="消息" subtitle="登录后可使用私聊" backHref="/home" />
        <p className="rounded-2xl bg-white/80 p-4 text-sm text-zinc-600 ring-1 ring-zinc-200">
          请先{" "}
          <Link href="/welcome/login" className="font-semibold text-violet-700 hover:underline">
            登录
          </Link>{" "}
          后再查看消息。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-4">
      <PageHeader title="消息" subtitle="会话保存在服务器，多端同步。" backHref="/home" />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <aside className="glass-panel rounded-3xl p-3 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between px-1 pb-2">
            <p className="text-xs font-semibold text-zinc-900">会话</p>
            <Link href="/match" className="text-[11px] font-semibold text-brand-800 hover:underline">
              去匹配
            </Link>
          </div>
          <ul className="space-y-2">
            {threads.length === 0 ? (
              <li className="rounded-2xl bg-white/70 p-3 text-xs text-zinc-600 ring-1 ring-zinc-200/70">
                还没有会话。去「匹配」点「发起沟通」会自动创建一条。
              </li>
            ) : null}
            {threads.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/messages?peer=${encodeURIComponent(t.peerId)}`}
                  className={[
                    "flex items-start gap-3 rounded-2xl px-3 py-2 transition",
                    peer === t.peerId
                      ? "bg-brand-50 ring-1 ring-brand-200/70"
                      : "bg-white/70 hover:bg-white ring-1 ring-zinc-200/70",
                  ].join(" ")}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-fuchsia-600 text-white">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-zinc-950">{t.peerName}</p>
                      {t.unread ? (
                        <span className="shrink-0 rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          新
                        </span>
                      ) : null}
                    </div>
                    <p className="truncate text-[11px] text-zinc-600">{t.lastMessage}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <section className="glass-panel flex min-h-[520px] flex-col rounded-3xl shadow-soft ring-1 ring-white/70 lg:col-span-3">
          <div className="border-b border-zinc-200/70 px-4 py-3">
            <p className="text-sm font-semibold text-zinc-950">
              {peer ? active?.peerName || "会话" : "请选择会话"}
            </p>
            <p className="text-[11px] text-zinc-500">
              {peer
                ? loadingPeer
                  ? "加载中…"
                  : active?.contextTitle
                    ? `上下文：${active.contextTitle}`
                    : `peerId: ${peer}`
                : "从左侧选择会话，或通过匹配页发起沟通。"}
            </p>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
            {!peer ? (
              <div className="mt-10 text-center text-sm text-zinc-600">
                <MessageCircle className="mx-auto mb-2 h-8 w-8 text-zinc-400" />
                选择左侧会话开始聊天。
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
                placeholder={peer ? "输入消息…" : "先选择会话"}
                className="flex-1 rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm outline-none disabled:opacity-50"
              />
              <button
                type="button"
                disabled={!peer || !convId}
                onClick={() => void send()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-white disabled:opacity-40"
                aria-label="发送"
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