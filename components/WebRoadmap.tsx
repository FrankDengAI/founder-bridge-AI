"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Rocket, Sparkles } from "lucide-react";

const milestones = [
  {
    phase: "P0",
    status: "shipped" as const,
    title: "信息流 · 命令面板 · 收藏闭环",
    items: [
      "/home /search /tools 骨架屏",
      "(tabs)/error.tsx 错误边界",
      "命令面板、通知中心、底部导航",
      "Feed 收藏可达性增强 + 发布 Toast",
    ],
  },
  {
    phase: "P1",
    status: "shipped" as const,
    title: "关系链与互动幂等",
    items: [
      "Prisma Follow / Comment / PostLike / PostSave",
      "/api/follow /api/comment 幂等接口",
      "用户主页关注计数",
      "消息「来自匹配」标签联动",
    ],
  },
  {
    phase: "P2",
    status: "shipped" as const,
    title: "For You 推荐 · 创作者中心",
    items: [
      "/home?view=for-you 规则推荐",
      "搜索历史 + 热词骨架",
      "/creator 创作者中心入口",
      "view=saved 本地收藏视图",
    ],
  },
  {
    phase: "P3",
    status: "shipped" as const,
    title: "工具商城 · 心愿单 · 学习进度",
    items: [
      "WishlistItem / DemoOrder",
      "UserLessonProgress 学习进度",
      "商品详情模拟支付写库",
      "成就字段本地对齐",
    ],
  },
  {
    phase: "P4",
    status: "in_progress" as const,
    title: "匹配引擎 v2 · 7 维加权 · 雷达可视化",
    items: [
      "加入兴趣向量 / 地域 / 活跃度三维",
      "雷达图前端可视化",
      "匹配卡片可解释 reason chips",
      "匹配 → 直接进入私聊一跳",
    ],
  },
  {
    phase: "P5",
    status: "planned" as const,
    title: "AI 内容协同 · 多人协作工作区",
    items: [
      "@AI 在评论中召唤草稿助手",
      "项目工作区共享白板",
      "GitHub Co-author 自动同步",
      "团队空间与权限",
    ],
  },
];

const statusBadge = {
  shipped: {
    icon: CheckCircle2,
    cls: "border-emerald-200 bg-emerald-50 text-emerald-800",
    label: "已上线",
  },
  in_progress: {
    icon: Clock,
    cls: "border-amber-200 bg-amber-50 text-amber-800",
    label: "进行中",
  },
  planned: {
    icon: Rocket,
    cls: "border-zinc-200 bg-zinc-50 text-zinc-600",
    label: "已规划",
  },
};

export function WebRoadmap() {
  return (
    <section
      id="roadmap"
      className="marketing-section relative py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="chip mb-3">
              <Sparkles className="h-3 w-3 text-cyan-600" />
              ROADMAP · 2026
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
              <span className="text-gradient-cool">从 P0 到 P5</span>
              <br className="sm:hidden" /> · 6 个里程碑
            </h2>
            <p className="mt-3 max-w-xl text-zinc-600">
              我们不画大饼。下面 4 个里程碑都在 main 分支上跑着；
              P4 进行中，P5 是 2026 H2 的方向。
            </p>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            updated · 2026 · Q2
          </div>
        </div>

        <div className="relative mt-14">
          {/* 时间线 */}
          <div
            aria-hidden
            className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-violet-400/40 via-fuchsia-400/30 to-transparent sm:left-1/2"
          />

          <ul className="space-y-6 sm:space-y-10">
            {milestones.map((m, i) => {
              const badge = statusBadge[m.status];
              const Badge = badge.icon;
              const leftSide = i % 2 === 0;
              return (
                <motion.li
                  key={m.phase}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="relative pl-12 sm:pl-0"
                >
                  {/* 时间节点 */}
                  <div className="absolute left-0 top-2 flex h-8 w-8 items-center justify-center sm:left-1/2 sm:-translate-x-1/2">
                    <div className="relative">
                      <div className="relative h-8 w-8 rounded-full border border-violet-300 bg-white shadow-sm backdrop-blur" />
                      {m.status === "shipped" ? (
                        <CheckCircle2 className="absolute inset-0 m-auto h-4 w-4 text-emerald-600" />
                      ) : m.status === "in_progress" ? (
                        <>
                          <Clock className="absolute inset-0 m-auto h-4 w-4 text-amber-600" />
                          <span className="absolute inset-0 rounded-full border border-amber-300 animate-ping-slow" />
                        </>
                      ) : (
                        <Rocket className="absolute inset-0 m-auto h-4 w-4 text-zinc-500" />
                      )}
                    </div>
                  </div>

                  {/* 卡片 */}
                  <div
                    className={`sm:flex sm:gap-0 ${
                      leftSide ? "" : "sm:flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`sm:w-[calc(50%-2.5rem)] ${
                        leftSide ? "sm:pr-10" : "sm:pl-10"
                      }`}
                    >
                      <div className="glass-v2 rounded-2xl p-5 transition hover:border-violet-300">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-violet-700">
                            {m.phase}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${badge.cls}`}
                          >
                            <Badge className="h-3 w-3" />
                            {badge.label}
                          </span>
                        </div>
                        <h3 className="mt-2 text-base font-bold text-zinc-900 sm:text-lg">
                          {m.title}
                        </h3>
                        <ul className="mt-3 space-y-1.5">
                          {m.items.map((it) => (
                            <li
                              key={it}
                              className="flex gap-2 text-[12px] leading-relaxed text-zinc-600"
                            >
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400/70" />
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
