"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Send, UserRound } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  completeMission,
  dismissPendingReply,
  MESSAGE_INTENT_TEMPLATES,
  recordPendingReply,
} from "@/lib/retention";
import { prependLocalNotif } from "@/lib/notificationsLocal";
import {
  loadThreads,
  markThreadRead,
  upsertThread,
  type Thread,
} from "@/lib/threads";
import { completeActivationStep } from "@/lib/activation";
import { hasBackAndForthChat, threadWarmth, WARMTH_LABEL } from "@/lib/chatRetention";
import { recordGamifyEvent } from "@/lib/gamification";

type ChatMsg = { id: string; from: "me" | "peer"; text: string; t: number };

const CHAT_KEY = "vibe_chat_messages";

function loadChat(peerId: string): ChatMsg[] {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as Record<string, ChatMsg[]>;
    return Array.isArray(all[peerId]) ? all[peerId] : [];
  } catch {
    return [];
  }
}

function saveChat(peerId: string, msgs: ChatMsg[]) {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    const all = (raw ? JSON.parse(raw) : {}) as Record<string, ChatMsg[]>;
    all[peerId] = msgs.slice(-200);
    localStorage.setItem(CHAT_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function MessagesClient() {
  const sp = useSearchParams();
  const peer = sp.get("peer") ?? "";
  const intentKey = sp.get("intent") ?? "";

  const [threads, setThreads] = useState<Thread[]>([]);
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);

  const active = useMemo(
    () => threads.find((t) => t.peerId === peer) ?? null,
    [peer, threads],
  );

  useEffect(() => {
    const refresh = () => setThreads(loadThreads());
    refresh();
    window.addEventListener("vibe-threads-updated", refresh);
    return () => window.removeEventListener("vibe-threads-updated", refresh);
  }, []);

  useEffect(() => {
    if (!peer) {
      setMsgs([]);
      return;
    }
    markThreadRead(peer);
    dismissPendingReply();
    setThreads(loadThreads());
    setMsgs(loadChat(peer));
    const threads = loadThreads();
    const row = threads.find((t) => t.peerId === peer);
    if (row?.draftMessage && !loadChat(peer).length) {
      setDraft(row.draftMessage);
    } else if (intentKey && MESSAGE_INTENT_TEMPLATES[intentKey]) {
      setDraft(MESSAGE_INTENT_TEMPLATES[intentKey]);
    }
  }, [peer, intentKey]);

  const send = () => {
    const text = draft.trim();
    if (!text || !peer) return;
    const next: ChatMsg = {
      id: `m_${Date.now()}`,
      from: "me",
      text,
      t: Date.now(),
    };
    const merged = [...msgs, next];
    setMsgs(merged);
    saveChat(peer, merged);
    upsertThread({
      peerId: peer,
      peerName: active?.peerName || "对方",
      lastMessage: text,
      updatedAt: Date.now(),
    });
    setThreads(loadThreads());
    setDraft("");
    completeMission("send_message");
    recordGamifyEvent("first_message");
    completeActivationStep("first_message");
    prependLocalNotif({
      id: `msg_sent_${Date.now()}`,
      title: "消息已发出",
      body: "对方可能稍后回复，记得回来查看会话。",
      at: "刚刚",
    });
    const peerName = active?.peerName || "对方";
    window.setTimeout(() => {
      const reply: ChatMsg = {
        id: `m_peer_${Date.now()}`,
        from: "peer",
        text: `你好！我是${peerName}，看到你的消息了，我们可以约个时间聊聊合作细节。`,
        t: Date.now(),
      };
      const withReply = [...merged, reply];
      setMsgs(withReply);
      saveChat(peer, withReply);
      upsertThread({
        peerId: peer,
        peerName,
        lastMessage: reply.text,
        updatedAt: Date.now(),
        unread: true,
      });
      recordPendingReply({
        peerId: peer,
        peerName,
        preview: reply.text,
      });
      if (hasBackAndForthChat(peer)) recordGamifyEvent("chat_back_and_forth");
      setThreads(loadThreads());
      prependLocalNotif({
        id: `msg_reply_${Date.now()}`,
        title: `${peerName} 回复了你`,
        body: reply.text.slice(0, 48) + (reply.text.length > 48 ? "…" : ""),
        at: "刚刚",
      });
    }, 2200);
  };

  return (
    <div className="space-y-3 pb-4">
      <PageHeader
        title="消息"
        subtitle="演示：会话保存在浏览器 localStorage。"
        backHref="/home"
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <aside className="glass-panel rounded-3xl p-3 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between px-1 pb-2">
            <p className="text-xs font-semibold text-zinc-900">会话</p>
            <Link
              href="/match"
              className="text-[11px] font-semibold text-brand-800 hover:underline"
            >
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
              <li key={t.peerId}>
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
                      {(() => {
                        const w = threadWarmth(t.peerId);
                        return (
                          <span
                            className={
                              w === "hot"
                                ? "shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-[9px] font-bold text-orange-800"
                                : w === "warm"
                                  ? "shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-800"
                                  : "shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-bold text-zinc-600"
                            }
                          >
                            {WARMTH_LABEL[w]}
                          </span>
                        );
                      })()}
                      {t.source === "match" ? (
                        <span className="shrink-0 rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-violet-800 ring-1 ring-violet-200/70">
                          匹配
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
              {active?.contextTitle
                ? `上下文：${active.contextTitle}`
                : peer
                  ? `peerId: ${peer}`
                  : "从左侧选择会话，或通过匹配/项目页发起沟通。"}
            </p>
            {peer && active?.source === "match" ? (
              <Link
                href="/match"
                className="mt-2 inline-flex text-[11px] font-semibold text-violet-800 hover:underline"
              >
                ← 返回匹配页继续找人
              </Link>
            ) : null}
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
            {!peer ? (
              <div className="mt-10 text-center text-sm text-zinc-600">
                <MessageCircle className="mx-auto mb-2 h-8 w-8 text-zinc-400" />
                选择左侧会话开始聊天（演示）。
              </div>
            ) : null}
            {msgs.map((m) => (
              <div
                key={m.id}
                className={[
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
                  m.from === "me"
                    ? "ml-auto bg-gradient-to-r from-brand-600 to-fuchsia-600 text-white"
                    : "mr-auto bg-white text-zinc-900 ring-1 ring-zinc-200/70",
                ].join(" ")}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200/70 p-3">
            <div className="flex gap-2">
              <input
                disabled={!peer}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={peer ? "输入消息…" : "先选择会话"}
                className="flex-1 rounded-2xl border border-zinc-200/90 bg-white/80 px-3 py-2 text-sm outline-none disabled:opacity-50"
              />
              <button
                type="button"
                disabled={!peer}
                onClick={send}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-white disabled:opacity-40"
                aria-label="发送"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              {Object.entries(MESSAGE_INTENT_TEMPLATES).map(([k, text]) => (
                <button
                  key={k}
                  type="button"
                  disabled={!peer}
                  onClick={() => setDraft(text)}
                  className="rounded-full bg-violet-50 px-2.5 py-1 font-semibold text-violet-900 ring-1 ring-violet-200/70 disabled:opacity-40"
                >
                  {k === "match" ? "合作" : k === "interview" ? "采访" : "项目"}
                </button>
              ))}
              <Link className="text-brand-800 hover:underline" href="/tools">
                工具
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
