/** 开发演示：?demo=retention 注入走查数据 */

import { todayKey } from "@/lib/retention";

const FLAG = "vibe_demo_retention_done";

export function injectDemoRetentionState() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  if (params.get("demo") !== "retention") return;
  if (localStorage.getItem(FLAG)) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = todayKey(yesterday);

  localStorage.setItem(
    "vibe_checkin",
    JSON.stringify({ lastDate: yKey, streak: 5 }),
  );
  localStorage.setItem("vibe_checkin_history", JSON.stringify([yKey]));

  localStorage.setItem(
    "vibe_pending_reply",
    JSON.stringify({
      peerId: "user_seed_01",
      peerName: "演示伙伴",
      preview: "你好！看到你的消息了，我们可以约个时间聊聊合作细节。",
      at: Date.now(),
      dismissed: false,
    }),
  );

  const threads = [
    {
      peerId: "user_seed_01",
      peerName: "演示伙伴",
      lastMessage: "你好！看到你的消息了…",
      updatedAt: Date.now(),
      unread: true,
      source: "match" as const,
    },
  ];
  localStorage.setItem("vibe_threads", JSON.stringify(threads));

  localStorage.setItem(FLAG, "1");
  window.dispatchEvent(new Event("vibe-checkin-updated"));
  window.dispatchEvent(new Event("vibe-reply-pending"));
  window.dispatchEvent(new Event("vibe-threads-updated"));
}
