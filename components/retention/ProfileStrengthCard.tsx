"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gauge } from "lucide-react";
import { DEMO_USER_ID } from "@/lib/constants";
import { useClientUserId } from "@/lib/hooks/useClientUserId";
import { profileCompletenessScore } from "@/lib/retention";

export function ProfileStrengthCard() {
  const userId = useClientUserId(DEMO_USER_ID);
  const [score, setScore] = useState(0);

  useEffect(() => {
    void fetch(`/api/profile?userId=${encodeURIComponent(userId)}`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        const p = (j as { profile?: Parameters<typeof profileCompletenessScore>[0] })
          ?.profile;
        setScore(profileCompletenessScore(p ?? null));
      })
      .catch(() => setScore(0));
  }, [userId]);

  if (score >= 80) return null;

  return (
    <section className="rounded-2xl bg-gradient-to-r from-violet-50 to-fuchsia-50 p-3 ring-1 ring-violet-200/60">
      <div className="flex items-start gap-3">
        <Gauge className="h-5 w-5 shrink-0 text-violet-700" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-violet-950">资料完善度 {score}%</p>
          <p className="mt-0.5 text-[10px] text-violet-900/80">
            完善至 80% 可提升匹配推荐质量与人脉可信度
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/80">
            <div
              className="h-full rounded-full bg-violet-600 transition-all"
              style={{ width: `${score}%` }}
            />
          </div>
          <Link
            href="/settings/profile"
            className="mt-2 inline-flex rounded-xl bg-violet-600 px-3 py-1.5 text-[11px] font-semibold text-white"
          >
            去完善
          </Link>
        </div>
      </div>
    </section>
  );
}
