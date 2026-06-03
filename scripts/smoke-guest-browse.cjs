/**
 * 游客「先逛后登」冒烟：middleware 放行 /home，受保护路径重定向并带 auth=login
 * 用法：node scripts/smoke-guest-browse.cjs [baseUrl]
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
    location: res.headers.get("location") || "",
  };
}

function assertGuestRedirect(r, expectedNext) {
  if (r.is500) return `500 on ${r.path}`;
  if (r.status !== 307 && r.status !== 302) return `expected redirect, got ${r.status}`;
  if (!r.location.includes("auth=login")) return `missing auth=login in ${r.location}`;
  if (expectedNext && !r.location.includes(`next=${encodeURIComponent(expectedNext)}`)) {
    return `missing next=${expectedNext} in ${r.location}`;
  }
  if (!r.location.includes("/home")) return `expected redirect to /home, got ${r.location}`;
  return null;
}

async function main() {
  let failed = false;
  const fail = (msg) => {
    console.error("FAIL", msg);
    failed = true;
  };

  const health = await req("/api/health");
  console.log("health", health.status, health.is500 ? "FAIL" : "ok");
  if (health.is500) fail("health 500");

  for (const p of ["/home", "/en/home"]) {
    const r = await req(p);
    const bad =
      r.is500 ||
      r.status >= 400 ||
      r.location.includes("/welcome") ||
      r.location.includes("auth=login");
    console.log("guest", p, r.status, bad ? "FAIL" : "ok", r.location || "");
    if (bad) fail(`${p} should be browsable without login redirect`);
  }

  for (const [p, next] of [
    ["/match", "/match"],
    ["/search", "/search"],
    ["/publish", "/publish"],
  ]) {
    const r = await req(p);
    const err = assertGuestRedirect(r, next);
    console.log("guest", p, r.status, err ? "FAIL" : "ok", r.location || "");
    if (err) fail(`${p}: ${err}`);
  }

  const loginPage = await req("/welcome/login");
  console.log("welcome/login", loginPage.status, loginPage.is500 ? "FAIL" : "ok");
  if (loginPage.is500 || loginPage.status >= 400) fail("/welcome/login not ok");

  const posts = await fetch(`${base}/api/posts?limit=1`);
  const postsOk = posts.ok;
  console.log("api/posts guest", posts.status, postsOk ? "ok" : "FAIL");
  if (!postsOk) fail("GET /api/posts should work for guests");

  const suffix = String(Date.now()).slice(-6);
  const username = `guest_smoke_${suffix}`;
  const password = "password1234";

  const reg = await fetch(`${base}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      displayName: "GuestSmoke",
      role: "ADC",
      interestTags: ["VibeCoding"],
    }),
  });
  if (!reg.ok) {
    fail(`register ${reg.status}`);
  } else {
    const login = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const cookie = parseSessionCookie(login.headers.get("set-cookie"));
    if (!login.ok || !cookie) {
      fail("login after register");
    } else {
      const match = await req("/match", cookie);
      const bad = match.is500 || match.location.includes("auth=login");
      console.log("logged-in /match", match.status, bad ? "FAIL" : "ok", match.location || "");
      if (bad) fail("logged-in user should access /match");
    }
  }

  if (failed) {
    console.error("\nSMOKE GUEST FAILED");
    process.exit(1);
  }
  console.log("\nALL GUEST SMOKE PASSED");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
