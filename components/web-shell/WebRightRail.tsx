"use client";

import { useEffect, useState } from "react";
import {
  Compass,
  Cpu,
  GraduationCap,
  MessageCircle,
  PenLine,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { HomeCommunityHub } from "@/components/home/HomeCommunityHub";
import { LearnProgressCard } from "@/components/learn/LearnProgressCard";
import { TodayMissionStrip } from "@/components/home/TodayMissionStrip";
import { stripLocalePrefix } from "@/lib/localePath";
import { useConversationStats } from "@/lib/hooks/useConversationStats";
import { useClientUserId } from "@/lib/hooks/useClientUserId";
import { RAIL_MISSIONS } from "@/lib/webModuleMission";
import { RailHotList } from "@/components/web-shell/rail/RailHotList";
import { RailLearnProgress } from "@/components/web-shell/rail/RailLearnProgress";
import { RailMatchTips } from "@/components/web-shell/rail/RailMatchTips";
import { RailPanel, RailSkeleton } from "@/components/web-shell/rail/RailPanel";
import { RailQuickActions, type QuickLink } from "@/components/web-shell/rail/RailQuickActions";
import { RailRecentPaths } from "@/components/web-shell/rail/RailRecentPaths";

type RailData = {
  modelCount: number;
  reviewCount: number;
  hotPosts: { id: string; title: string; likes: number }[];
  hotTools: { id: string; name: string; avgRating: number }[];
  hotModels: {
    id: string;
    name: string;
    provider: string;
    avgRating: number;
    rankScore: number;
    reviewCount: number;
  }[];
};

const globalQuickLinks: QuickLink[] = [
  { href: "/match", label: "开始匹配", icon: Sparkles, tone: "from-violet-600 to-fuchsia-600" },
  { href: "/publish", label: "发布笔记", icon: PenLine, tone: "from-sky-600 to-cyan-600" },
  { href: "/learn/step/1", label: "学习路线", icon: GraduationCap, tone: "from-emerald-600 to-teal-600" },
  { href: "/tools", label: "工具商城", icon: Cpu, tone: "from-amber-500 to-orange-600" },
];

type RailKind = "home" | "match" | "tools" | "models" | "learn" | "messages" | "default";

function railKind(pathname: string): RailKind {
  const p = stripLocalePrefix(pathname.split("?")[0] || "/home");
  if (p === "/home" || p.startsWith("/home/")) return "home";
  if (p.startsWith("/match")) return "match";
  if (p.startsWith("/tools") || p.startsWith("/market")) return "tools";
  if (p.startsWith("/models")) return "models";
  if (p.startsWith("/learn")) return "learn";
  if (p.startsWith("/messages")) return "messages";
  return "default";
}

export function WebRightRail({ pathname: pathnameProp }: { pathname?: string }) {
  const pathnameHook = usePathname() ?? "/home";
  const pathname = pathnameProp ?? pathnameHook;
  const kind = railKind(pathname);
  const userId = useClientUserId();
  const { unread: msgUnread } = useConversationStats(Boolean(userId));
  const [data, setData] = useState<RailData | null>(null);
  const [loading, setLoading] = useState(false);

  const needsRailApi = kind === "home" || kind === "tools" || kind === "models" || kind === "default";

  useEffect(() => {
    if (!needsRailApi) {
      setData(null);
      return;
    }
    setLoading(true);
    void fetch("/api/home/rail")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: RailData | null) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [needsRailApi, kind]);

  return (
    <aside className="hidden w-[300px] shrink-0 lg:block xl:w-[320px]">
      <div className="sticky top-[4.5rem] max-h-[calc(100vh-5.5rem)] space-y-4 overflow-y-auto pb-6 pr-1 scrollbar-thin">
        {kind === "home" ? (
          <>
            <div className="web-panel rounded-2xl p-3 transition duration-300 hover:border-violet-300/70 hover:shadow-md">
              <HomeCommunityHub
                modelCount={data?.modelCount ?? 0}
                reviewCount={data?.reviewCount ?? 0}
              />
            </div>
            <RailPanel
              title={RAIL_MISSIONS.todayMission.title}
              purpose={RAIL_MISSIONS.todayMission.purpose}
              index={1}
            >
              <TodayMissionStrip />
            </RailPanel>
            <RailPanel
              title={RAIL_MISSIONS.learnProgress.title}
              purpose={RAIL_MISSIONS.learnProgress.purpose}
              index={2}
            >
              <LearnProgressCard variant="compact" />
            </RailPanel>
            {loading ? <RailSkeleton index={3} /> : null}
            {data ? (
              <RailHotList
                hotPosts={data.hotPosts}
                hotTools={data.hotTools}
                hotModels={data.hotModels}
                index={3}
              />
            ) : null}
          </>
        ) : null}

        {kind === "match" ? (
          <>
            <RailMatchTips />
            <RailQuickActions
              links={[
                globalQuickLinks[0]!,
                {
                  href: "/messages",
                  label: "查看消息",
                  icon: MessageCircle,
                  tone: "from-rose-500 to-pink-600",
                },
              ]}
              index={2}
            />
          </>
        ) : null}

        {kind === "tools" || kind === "models" ? (
          <>
            <RailPanel
              title={kind === "tools" ? "工具商城" : "模型社区"}
              purpose={
                kind === "tools"
                  ? "真实评分帮你少踩坑——在 Vibe Coding 全流程里快速找到趁手的 AI 与生产力工具。"
                  : "按场景看真实短评：编程、写作、性价比下的体感，比官方榜更贴近创业实战。"
              }
              icon={<Wrench className="h-4 w-4 text-amber-600" />}
              index={0}
            >
              <Link
                href={kind === "tools" ? "/models" : "/tools"}
                className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-800 ring-1 ring-violet-200/70 transition hover:bg-violet-100"
              >
                {kind === "tools" ? "去看模型榜 →" : "去看工具商城 →"}
              </Link>
            </RailPanel>
            {loading ? <RailSkeleton index={1} /> : null}
            {data ? (
              <RailHotList
                hotPosts={kind === "models" ? [] : data.hotPosts.slice(0, 3)}
                hotTools={kind === "tools" ? data.hotTools : data.hotTools.slice(0, 3)}
                hotModels={kind === "models" ? data.hotModels : data.hotModels.slice(0, 3)}
                index={2}
              />
            ) : null}
          </>
        ) : null}

        {kind === "learn" ? (
          <>
            <RailLearnProgress />
            <RailPanel
              title="学习路线"
              purpose="17 步 Vibe Coding 实战：从环境搭建到上线部署，降低「不知道从哪开始」的焦虑。"
              index={1}
            >
              <Link
                href="/learn/github"
                className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                GitHub 协作指南 →
              </Link>
            </RailPanel>
          </>
        ) : null}

        {kind === "messages" ? (
          <>
            <RailPanel
              title="消息中心"
              purpose="私聊是协作的起点——来自匹配的会话带标签，减少破冰，直接聊项目。"
              icon={<MessageCircle className="h-4 w-4 text-rose-500" />}
              index={0}
            >
              {msgUnread > 0 ? (
                <p className="text-sm font-semibold text-zinc-900">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="pulse-dot text-rose-500" aria-hidden />
                    {msgUnread} 条未读会话
                  </span>
                </p>
              ) : (
                <p className="text-xs leading-relaxed text-zinc-600">
                  暂无未读。去匹配页认识新伙伴，或回复社区里感兴趣的人。
                </p>
              )}
              <Link
                href="/match"
                className="mt-3 inline-flex text-xs font-semibold text-violet-700 hover:underline"
              >
                去匹配 →
              </Link>
            </RailPanel>
            <RailQuickActions links={globalQuickLinks.slice(0, 3)} index={1} />
          </>
        ) : null}

        {kind === "default" ? (
          <>
            <RailPanel
              title={RAIL_MISSIONS.explore.title}
              purpose={RAIL_MISSIONS.explore.purpose}
              icon={<Compass className="h-4 w-4 text-violet-600" />}
              index={0}
            >
              <Link
                href="/home"
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-110"
              >
                回到发现页 →
              </Link>
            </RailPanel>
            <RailQuickActions links={globalQuickLinks} index={1} />
            {loading ? <RailSkeleton index={2} /> : null}
            {data ? (
              <RailHotList
                hotPosts={data.hotPosts.slice(0, 3)}
                hotTools={data.hotTools.slice(0, 3)}
                hotModels={data.hotModels.slice(0, 3)}
                index={2}
              />
            ) : null}
            <RailRecentPaths index={3} />
          </>
        ) : null}

        {kind !== "default" && kind !== "home" ? <RailRecentPaths index={4} /> : null}
      </div>
    </aside>
  );
}
