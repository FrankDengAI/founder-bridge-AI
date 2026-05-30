"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { PageHeader } from "@/components/PageHeader";
import { useClientUserId } from "@/lib/hooks/useClientUserId";
import type { Role } from "@/lib/domain/role";
import { ROLES, isRole } from "@/lib/domain/role";
import { ROLE_LABEL } from "@/lib/labels";
import {
  getDirectionPresets,
  getKeywordSuggestions,
} from "@/lib/matchUiCopy";
import { completeActivationStep } from "@/lib/activation";
import {
  completeMission,
  profileCompletenessScore,
} from "@/lib/retention";

export function ProfileEditor() {
  const t = useTranslations("pages.profileEdit");
  const router = useRouter();
  const userId = useClientUserId();
  const [role, setRole] = useState<Role>("ADC");
  const [intro, setIntro] = useState("");
  const [direction, setDirection] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [remoteOk, setRemoteOk] = useState(false);
  const [skillKeywords, setSkillKeywords] = useState<string[]>([]);
  const [kwInput, setKwInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    const res = await fetch(`/api/profile?userId=${encodeURIComponent(userId)}`, {
      credentials: "include",
    });
    if (!res.ok) return;
    const data = (await res.json()) as {
      profile: {
        role: string;
        intro: string;
        direction: string;
        skillKeywords: string[];
        remoteOk?: boolean;
        githubUrl?: string;
      };
    };
    if (isRole(data.profile.role)) setRole(data.profile.role);
    setIntro(data.profile.intro);
    setDirection(data.profile.direction);
    setSkillKeywords(data.profile.skillKeywords);
    setRemoteOk(Boolean(data.profile.remoteOk));
    setGithubUrl(data.profile.githubUrl ?? "");
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (!userId) {
      setMsg("请先登录后再保存");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          role,
          intro,
          direction,
          skillKeywords,
          remoteOk,
          githubUrl,
        }),
      });
      if (!res.ok) throw new Error("保存失败");
      const score = profileCompletenessScore({
        role,
        intro,
        direction,
        skillKeywords,
      });
      if (score >= 60) completeActivationStep("profile_60");
      if (score >= 80) completeMission("profile_ok");
      setMsg(score >= 80 ? `已保存 · 资料完善度 ${score}%` : `已保存 · 完善度 ${score}%`);
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "保存失败");
    } finally {
      setBusy(false);
    }
  };

  const suggestions = getKeywordSuggestions(role);
  const directions = getDirectionPresets(role);

  return (
    <div className="space-y-4 pb-10">
      <PageHeader title={t("title")} backHref="/me" />
      {!userId ? (
        <p className="rounded-2xl bg-white/80 p-4 text-sm text-zinc-600 ring-1 ring-zinc-200">
          请先{" "}
          <Link href="/welcome/login" className="font-semibold text-violet-700 hover:underline">
            登录
          </Link>{" "}
          后再编辑资料。
        </p>
      ) : (
        <>
          <p className="text-xs text-zinc-600">
            独立于匹配页的资料编辑。完善主页可提升匹配质量与他人信任感。
          </p>

          <div className="glass-panel space-y-4 rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <section className="space-y-2">
          <p className="text-xs font-semibold text-zinc-900">角色</p>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-medium ${
                  role === r
                    ? "border-violet-400 bg-violet-50 text-violet-900"
                    : "border-zinc-200 text-zinc-600"
                }`}
              >
                {ROLE_LABEL[r]}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-xs font-semibold text-zinc-900">创业方向</p>
          <div className="flex flex-wrap gap-1.5">
            {directions.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDirection(d)}
                className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-medium text-zinc-600 hover:border-violet-200"
              >
                {d}
              </button>
            ))}
          </div>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
          />
        </section>

        <section className="space-y-2">
          <p className="text-xs font-semibold text-zinc-900">技能关键词</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.slice(0, 10).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() =>
                  setSkillKeywords((k) => (k.includes(s) ? k : [...k, s]))
                }
                className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-700"
              >
                + {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              value={kwInput}
              onChange={(e) => setKwInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && kwInput.trim()) {
                  setSkillKeywords((k) => [...k, kwInput.trim()]);
                  setKwInput("");
                }
              }}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {skillKeywords.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setSkillKeywords((x) => x.filter((t) => t !== k))}
                className="rounded-full bg-violet-100 px-2 py-1 text-[10px] text-violet-900"
              >
                {k} ×
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-xs font-semibold text-zinc-900">简介</p>
          <textarea
            className="min-h-[88px] w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
          />
        </section>

        <section className="space-y-2">
          <p className="text-xs font-semibold text-zinc-900">GitHub / 作品链接</p>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
          />
          <label className="flex items-center gap-2 text-xs text-zinc-700">
            <input
              type="checkbox"
              checked={remoteOk}
              onChange={(e) => setRemoteOk(e.target.checked)}
            />
            接受远程协作
          </label>
        </section>

        <button
          type="button"
          disabled={busy}
          onClick={() => void save()}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? "保存中…" : "保存主页"}
        </button>
        {msg ? <p className="text-xs text-emerald-700">{msg}</p> : null}
        <Link
          href="/match"
          className="block text-center text-xs font-semibold text-violet-800 hover:underline"
        >
          前往匹配页调整期望伙伴类型 →
        </Link>
          </div>
        </>
      )}
    </div>
  );
}
