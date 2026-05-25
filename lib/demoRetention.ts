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

  localStorage.setItem(FLAG, "1");
  window.dispatchEvent(new Event("vibe-checkin-updated"));
}
