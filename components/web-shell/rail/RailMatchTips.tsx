"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Sparkles, Target, Users } from "lucide-react";
import { RAIL_MISSIONS } from "@/lib/webModuleMission";
import { RailPanel } from "./RailPanel";

const ROLES = [
  { role: "产品/全栈", pct: 38, color: "bg-violet-500" },
  { role: "增长/运营", pct: 28, color: "bg-fuchsia-500" },
  { role: "设计/内容", pct: 34, color: "bg-cyan-500" },
] as const;

export function RailMatchTips() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <RailPanel
        title={RAIL_MISSIONS.matchTips.title}
        purpose={RAIL_MISSIONS.matchTips.purpose}
        icon={<Sparkles className="h-4 w-4 text-violet-600" />}
        index={0}
      >
        <ul className="space-y-2.5 text-xs text-zinc-600">
          <li className="flex items-start gap-2 rounded-xl bg-violet-50/80 p-2.5 ring-1 ring-violet-100">
            <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fuchsia-500" />
            <span>
              <strong className="text-zinc-800">产品 × 运营</strong> 组合通过率更高——一个出产品，一个撑增长。
            </span>
          </li>
          <li className="flex items-start gap-2 rounded-xl bg-sky-50/80 p-2.5 ring-1 ring-sky-100">
            <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" />
            <span>
              方向一致 + 技能互补 = 更高匹配分；资料越完整，结果越准。
            </span>
          </li>
        </ul>
        <Link
          href="/settings/profile"
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-violet-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-violet-700"
        >
          完善资料，提高匹配率 →
        </Link>
      </RailPanel>

      <RailPanel
        title={RAIL_MISSIONS.roleDistribution.title}
        purpose={RAIL_MISSIONS.roleDistribution.purpose}
        index={1}
      >
        <div className="space-y-3">
          {ROLES.map((r, i) => (
            <div key={r.role}>
              <div className="flex justify-between text-[10px] text-zinc-600">
                <span>{r.role}</span>
                <span className="font-mono font-semibold tabular-nums">{r.pct}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100">
                <motion.div
                  className={`h-full rounded-full ${r.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: mounted ? `${r.pct}%` : 0 }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
      </RailPanel>
    </>
  );
}
