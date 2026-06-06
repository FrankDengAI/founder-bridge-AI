"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { HandCoins, Plus, Search, UserRound } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { startConversation } from "@/lib/chat/client";
import { getRoleLabel } from "@/lib/labels";
import { isRole } from "@/lib/domain/role";
import { useClientUserId } from "@/lib/hooks/useClientUserId";

type BountyItem = {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  budgetLabel: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  createdAt: number;
};

type SearchUser = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
  score: number;
  skillKeywords: string[];
  intro: string;
};

type SearchBounty = BountyItem & { score: number };

export function BountyExperience() {
  const t = useTranslations("pages.bounty");
  const tRoles = useTranslations("roles");
  const userId = useClientUserId();
  const router = useRouter();

  const [tab, setTab] = useState<"browse" | "search" | "publish">("browse");
  const [items, setItems] = useState<BountyItem[]>([]);
  const [query, setQuery] = useState("");
  const [searchUsers, setSearchUsers] = useState<SearchUser[]>([]);
  const [searchBounties, setSearchBounties] = useState<SearchBounty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetLabel, setBudgetLabel] = useState("");
  const [kwInput, setKwInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  const loadBrowse = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bounty", { credentials: "include" });
      if (!res.ok) throw new Error("load fail");
      const data = (await res.json()) as { items: BountyItem[] };
      setItems(data.items);
    } catch {
      setError(t("loadFail"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (tab === "browse") void loadBrowse();
  }, [tab, loadBrowse]);

  const runSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bounty/search?q=${encodeURIComponent(q)}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("search fail");
      const data = (await res.json()) as {
        users: SearchUser[];
        bounties: SearchBounty[];
      };
      setSearchUsers(data.users);
      setSearchBounties(data.bounties);
    } catch {
      setError(t("searchFail"));
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = () => {
    const v = kwInput.trim();
    if (!v || keywords.includes(v)) return;
    setKeywords((k) => [...k, v]);
    setKwInput("");
  };

  const publish = async () => {
    if (!userId) {
      setError(t("loginRequired"));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bounty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description, keywords, budgetLabel }),
      });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        if (body.error === "profanity") {
          setError(t("profanityWarning"));
          return;
        }
        throw new Error("publish fail");
      }
      setTitle("");
      setDescription("");
      setBudgetLabel("");
      setKeywords([]);
      setTab("browse");
      await loadBrowse();
    } catch {
      setError(t("publishFail"));
    } finally {
      setLoading(false);
    }
  };

  const contactAuthor = (authorId: string, contextTitle: string) => {
    void startConversation(authorId, {
      source: "collab",
      contextTitle,
    }).then(() => {
      router.push(`/messages?peer=${encodeURIComponent(authorId)}&intent=collab`);
    });
  };

  return (
    <div className="space-y-4 pb-28">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["browse", t("tabBrowse")],
            ["search", t("tabSearch")],
            ["publish", t("tabPublish")],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
              tab === key
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white text-zinc-700 ring-1 ring-zinc-200/80 hover:bg-violet-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "browse" ? (
        <div className="space-y-3">
          {loading ? <p className="text-sm text-zinc-500">{t("loading")}</p> : null}
          {items.length === 0 && !loading ? (
            <p className="rounded-2xl bg-white/80 p-4 text-sm text-zinc-600 ring-1 ring-zinc-200">
              {t("emptyBrowse")}
            </p>
          ) : null}
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl bg-white/90 p-4 shadow-soft ring-1 ring-zinc-200/70"
            >
              <div className="flex items-start gap-3">
                <UserAvatar
                  userId={item.authorId}
                  displayName={item.authorName}
                  avatarUrl={item.authorAvatar}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-zinc-950">{item.title}</h3>
                  <p className="mt-1 text-[11px] text-zinc-500">{item.authorName}</p>
                  {item.budgetLabel ? (
                    <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-900 ring-1 ring-amber-200/80">
                      <HandCoins className="h-3 w-3" />
                      {item.budgetLabel}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs leading-relaxed text-zinc-700">
                    {item.description || t("noDescription")}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.keywords.map((k) => (
                      <span
                        key={k}
                        className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => contactAuthor(item.authorId, item.title)}
                    className="mt-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2 text-[11px] font-semibold text-white hover:opacity-95"
                  >
                    {t("interested")}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {tab === "search" ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
              placeholder={t("searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void runSearch()}
            />
            <button
              type="button"
              onClick={() => void runSearch()}
              className="inline-flex items-center gap-1 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:opacity-95"
            >
              <Search className="h-3.5 w-3.5" />
              {t("searchBtn")}
            </button>
          </div>

          {searchBounties.length > 0 ? (
            <section className="space-y-2">
              <p className="text-xs font-semibold text-zinc-800">{t("searchBounties")}</p>
              {searchBounties.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200/70"
                >
                  <p className="text-sm font-semibold text-zinc-900">{b.title}</p>
                  <p className="mt-1 text-[11px] text-zinc-600">{b.description}</p>
                  <button
                    type="button"
                    onClick={() => contactAuthor(b.authorId, b.title)}
                    className="mt-2 text-[11px] font-semibold text-violet-700"
                  >
                    {t("interested")}
                  </button>
                </div>
              ))}
            </section>
          ) : null}

          {searchUsers.length > 0 ? (
            <section className="space-y-2">
              <p className="text-xs font-semibold text-zinc-800">{t("searchPeople")}</p>
              {searchUsers.map((u) => (
                <div
                  key={u.userId}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-zinc-200/70"
                >
                  <UserAvatar
                    userId={u.userId}
                    displayName={u.displayName}
                    avatarUrl={u.avatarUrl}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-900">{u.displayName}</p>
                    <p className="text-[11px] text-zinc-500">
                      {isRole(u.role) ? getRoleLabel(tRoles, u.role) : u.role}
                      {" · "}
                      {Math.round(u.score * 100)}%
                    </p>
                    <p className="mt-1 line-clamp-1 text-[11px] text-zinc-600">{u.intro}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => contactAuthor(u.userId, t("searchPeople"))}
                    className="shrink-0 rounded-xl bg-violet-100 px-2 py-1.5 text-[10px] font-semibold text-violet-900"
                  >
                    <UserRound className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </section>
          ) : null}

          {!loading &&
          query.trim() &&
          searchUsers.length === 0 &&
          searchBounties.length === 0 ? (
            <p className="text-sm text-zinc-500">{t("searchEmpty")}</p>
          ) : null}
        </div>
      ) : null}

      {tab === "publish" ? (
        <div className="space-y-4 rounded-3xl bg-white/80 p-4 shadow-soft ring-1 ring-white/70">
          <p className="text-xs font-semibold text-zinc-900">{t("publishTitle")}</p>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            placeholder={t("titlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="min-h-[100px] w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            placeholder={t("descPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            placeholder={t("budgetPlaceholder")}
            value={budgetLabel}
            onChange={(e) => setBudgetLabel(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              placeholder={t("kwPlaceholder")}
              value={kwInput}
              onChange={(e) => setKwInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addKeyword()}
            />
            <button
              type="button"
              onClick={addKeyword}
              className="rounded-xl bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-800"
            >
              {t("addKw")}
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {keywords.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKeywords((xs) => xs.filter((x) => x !== k))}
                className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] text-violet-900"
              >
                {k} ×
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={() => void publish()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {t("publishBtn")}
          </button>
          <p className="text-[10px] leading-relaxed text-zinc-500">{t("disclaimer")}</p>
        </div>
      ) : null}

      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      <p className="rounded-2xl border border-amber-200/80 bg-amber-50/50 px-3 py-2 text-[10px] leading-relaxed text-amber-950">
        {t("disclaimer")}
      </p>
    </div>
  );
}
