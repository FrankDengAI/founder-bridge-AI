"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderGit2 } from "lucide-react";
import { FeedCard } from "@/components/FeedCard";
import type { Role } from "@/lib/domain/role";
import { isRole } from "@/lib/domain/role";
import { ROLE_LABEL } from "@/lib/labels";

type PostRow = {
  id: string;
  authorId: string;
  type: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  likes: number;
  saves: number;
};

type ProjectRow = {
  id: string;
  name: string;
  description: string;
  stage: string;
  stack: string[];
  teamNeeds: string;
};

type Props = {
  userId: string;
  displayName: string;
  intro: string;
  direction: string;
  role: Role | null;
  skillKeywords: string[];
  desiredPartnerRoles: Role[];
  remoteOk: boolean;
  githubUrl: string;
  verified: boolean;
  posts: PostRow[];
  projects: ProjectRow[];
};

const TABS = ["动态", "项目", "关于"] as const;

export function UserPageTabs(props: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("动态");

  return (
    <div className="space-y-3">
      <div className="flex gap-1 rounded-2xl bg-zinc-100/80 p-1 ring-1 ring-zinc-200/60">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition ${
              tab === t
                ? "bg-white text-violet-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "动态" ? (
        <div className="columns-2 gap-2 space-y-2 [column-fill:_balance]">
          {props.posts.map((p) => (
            <div key={p.id} className="mb-2 break-inside-avoid">
              <FeedCard
                id={p.id}
                authorId={p.authorId}
                type={p.type}
                title={p.title}
                excerpt={p.excerpt}
                coverUrl={p.coverUrl}
                authorName={props.displayName}
                likes={p.likes}
                saves={p.saves}
              />
            </div>
          ))}
          {props.posts.length === 0 ? (
            <p className="glass-panel col-span-2 rounded-2xl p-4 text-xs text-zinc-600">
              暂无笔记。
            </p>
          ) : null}
        </div>
      ) : null}

      {tab === "项目" ? (
        <div className="space-y-2">
          {props.projects.map((proj) => (
            <Link
              key={proj.id}
              href={`/project/${proj.id}`}
              className="glass-panel block rounded-2xl p-4 shadow-sm ring-1 ring-white/70 transition hover:-translate-y-0.5 hover:ring-violet-200/80"
            >
              <p className="text-sm font-semibold text-zinc-950">{proj.name}</p>
              {proj.stage ? (
                <p className="mt-1 text-[10px] font-medium text-violet-700">{proj.stage}</p>
              ) : null}
              {proj.description ? (
                <p className="mt-2 line-clamp-2 text-[11px] text-zinc-600">{proj.description}</p>
              ) : null}
              {proj.teamNeeds ? (
                <p className="mt-2 text-[10px] text-amber-800">招募：{proj.teamNeeds}</p>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-1">
                {proj.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-700 ring-1 ring-zinc-200/70"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-violet-800">
                <FolderGit2 className="h-3.5 w-3.5" />
                查看项目主页
              </span>
            </Link>
          ))}
          {props.projects.length === 0 ? (
            <p className="glass-panel rounded-2xl p-4 text-xs text-zinc-600">暂无项目。</p>
          ) : null}
        </div>
      ) : null}

      {tab === "关于" ? (
        <div className="glass-panel space-y-3 rounded-2xl p-4 text-sm shadow-sm ring-1 ring-white/70">
          <p className="leading-relaxed text-zinc-700">
            {props.intro || "这位创作者还没有写简介。"}
          </p>
          {props.direction ? (
            <p className="text-xs text-zinc-500">
              方向：<span className="font-medium text-zinc-800">{props.direction}</span>
            </p>
          ) : null}
          {props.role ? (
            <p className="text-xs text-zinc-500">
              角色：<span className="font-medium">{ROLE_LABEL[props.role]}</span>
            </p>
          ) : null}
          {props.remoteOk ? (
            <span className="inline-block rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-semibold text-cyan-900 ring-1 ring-cyan-200/70">
              接受远程协作
            </span>
          ) : null}
          {props.verified ? (
            <span className="ml-2 inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-900 ring-1 ring-emerald-200/70">
              已验证链接
            </span>
          ) : null}
          {props.githubUrl ? (
            <a
              href={props.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="block text-xs font-semibold text-violet-800 hover:underline"
            >
              GitHub / 作品链接
            </a>
          ) : null}
          {props.skillKeywords.length > 0 ? (
            <div>
              <p className="mb-1.5 text-xs font-semibold text-zinc-900">技能标签</p>
              <div className="flex flex-wrap gap-1.5">
                {props.skillKeywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-900 ring-1 ring-violet-200/50"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {props.desiredPartnerRoles.length > 0 ? (
            <div>
              <p className="mb-1.5 text-xs font-semibold text-zinc-900">合作意向</p>
              <div className="flex flex-wrap gap-1.5">
                {props.desiredPartnerRoles.map((r) => (
                  <span
                    key={r}
                    className="rounded-full bg-fuchsia-50 px-2.5 py-1 text-[11px] font-medium text-fuchsia-900 ring-1 ring-fuchsia-200/50"
                  >
                    寻找 {ROLE_LABEL[r]}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
