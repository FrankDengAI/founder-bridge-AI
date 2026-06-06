/**
 * API 集成冒烟：匹配 / 悬赏 / 违禁词 / 资料
 * 用法：node scripts/smoke-api-features.cjs [baseUrl]
 */
require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local", override: true });

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");

function parseSessionCookie(setCookie) {
  const m = String(setCookie || "").match(/vbc_session=([^;]+)/);
  return m ? `vbc_session=${m[1]}` : "";
}

async function json(path, opts = {}) {
  const res = await fetch(`${base}${path}`, opts);
  const text = await res.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { status: res.status, body, ok: res.ok };
}

async function main() {
  const health = await json("/api/health");
  console.log("health", health.status);
  if (!health.ok) {
    console.error("FAIL health");
    process.exit(1);
  }

  const suffix = String(Date.now()).slice(-6);
  const username = `api_smoke_${suffix}`;
  const password = "password1234";

  const reg = await json("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      displayName: "API Smoke",
      role: "ADC",
      interestTags: ["VibeCoding"],
    }),
  });
  if (!reg.ok) {
    console.error("FAIL register", reg.status, reg.body);
    process.exit(1);
  }

  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const cookie = parseSessionCookie(loginRes.headers.get("set-cookie"));
  if (!loginRes.ok || !cookie) {
    console.error("FAIL login", loginRes.status);
    process.exit(1);
  }
  const auth = { headers: { "Content-Type": "application/json", Cookie: cookie } };
  console.log("OK login");

  const me = await json("/api/me", { headers: { Cookie: cookie } });
  const userId = me.body?.userId ?? me.body?.user?.id;
  if (!userId) {
    console.error("FAIL me", me.body);
    process.exit(1);
  }

  const profanity = await json("/api/profile", {
    method: "PUT",
    ...auth,
    body: JSON.stringify({ intro: "测试傻逼内容" }),
  });
  if (profanity.status !== 422 || profanity.body?.error !== "profanity") {
    console.error("FAIL profanity profile", profanity.status, profanity.body);
    process.exit(1);
  }
  console.log("OK profanity blocked on profile");

  const profileOk = await json("/api/profile", {
    method: "PUT",
    ...auth,
    body: JSON.stringify({
      role: "ADC",
      intro: "API smoke test profile",
      direction: "Developer tools",
      skillKeywords: ["Next.js", "TypeScript"],
      desiredPartnerRoles: ["JUNGLE"],
      matchIntent: "PARTNER",
      budgetTier: 2,
    }),
  });
  if (!profileOk.ok) {
    console.error("FAIL profile save", profileOk.body);
    process.exit(1);
  }
  console.log("OK profile save");

  const match = await json("/api/match", {
    method: "POST",
    ...auth,
    body: JSON.stringify({ limit: 3 }),
  });
  if (!match.ok) {
    console.error("FAIL match", match.body);
    process.exit(1);
  }
  const count = match.body?.candidates?.length ?? 0;
  if (count > 3) {
    console.error("FAIL match limit", count);
    process.exit(1);
  }
  console.log("OK match limit", count);

  const bounty = await json("/api/bounty", {
    method: "POST",
    ...auth,
    body: JSON.stringify({
      title: "Need a login page built",
      description: "VibeCoding style auth flow",
      keywords: ["Next.js", "auth"],
      budgetLabel: "Equity split",
    }),
  });
  if (!bounty.ok) {
    console.error("FAIL bounty create", bounty.body);
    process.exit(1);
  }
  console.log("OK bounty create", bounty.body?.id);

  const search = await json("/api/bounty/search?q=Next.js", {
    headers: { Cookie: cookie },
  });
  if (!search.ok) {
    console.error("FAIL bounty search", search.body);
    process.exit(1);
  }
  console.log(
    "OK bounty search",
    search.body?.bounties?.length ?? 0,
    "bounties",
    search.body?.users?.length ?? 0,
    "users",
  );

  const list = await json("/api/bounty", { headers: { Cookie: cookie } });
  if (!list.ok || !Array.isArray(list.body?.items)) {
    console.error("FAIL bounty list", list.body);
    process.exit(1);
  }
  console.log("OK bounty list", list.body.items.length);

  console.log("\nALL API SMOKE PASSED");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
