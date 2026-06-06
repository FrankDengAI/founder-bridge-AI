/**
 * 部署前冒烟：登录后访问受保护页面不得 500
 * 用法：node scripts/smoke-protected-pages.cjs [baseUrl]
 * 默认 http://localhost:3000（与 npm start / Playwright 一致），可用 SMOKE_BASE_URL 覆盖
 */
require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local", override: true });

const base = (process.argv[2] || process.env.SMOKE_BASE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

function parseSessionCookie(setCookie) {
  const m = String(setCookie || "").match(/vbc_session=([^;]+)/);
  return m ? `vbc_session=${m[1]}` : "";
}

async function req(path, cookie) {
  const res = await fetch(`${base}${path}`, {
    headers: cookie ? { Cookie: cookie } : {},
    redirect: "manual",
  });
  const text = await res.text();
  return {
    path,
    status: res.status,
    is500: text.includes("Internal Server Error") || res.status === 500,
    location: res.headers.get("location"),
  };
}

async function main() {
  const health = await req("/api/health");
  console.log("health", health.status, health.is500 ? "FAIL" : "ok");

  const suffix = String(Date.now()).slice(-6);
  const username = `smoke_${suffix}`;
  const password = "password1234";

  const reg = await fetch(`${base}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      displayName: "Smoke",
      role: "ADC",
      interestTags: ["VibeCoding"],
    }),
  });
  if (!reg.ok) {
    console.error("FAIL register", reg.status, await reg.text());
    process.exit(1);
  }

  const login = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const cookie = parseSessionCookie(login.headers.get("set-cookie"));
  if (!login.ok || !cookie) {
    console.error("FAIL login", login.status);
    process.exit(1);
  }
  console.log("OK login");

  const paths = ["/login", "/welcome/login", "/welcome/mode?next=/home", "/home", "/match", "/bounty", "/messages", "/tools"];
  let failed = false;
  for (const p of paths) {
    const r = await req(p, cookie);
    const bad = r.is500;
    console.log(r.path, r.status, bad ? "FAIL_500" : "ok", r.location || "");
    if (bad) failed = true;
  }

  if (failed) {
    console.error("\nSMOKE FAILED: protected pages returned 500");
    process.exit(1);
  }
  console.log("\nALL PASSED");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
