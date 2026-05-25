/**
 * 本地/CI 冒烟：健康检查 + 注册 + 登录
 * 用法：node scripts/auth-smoke-test.cjs [baseUrl]
 */
const base = (process.argv[2] || "http://localhost:3003").replace(/\/$/, "");

async function req(path, init) {
  const res = await fetch(`${base}${path}`, init);
  const text = await res.text();
  let json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json };
}

async function main() {
  const health = await req("/api/health");
  if (health.status !== 200 || health.json.auth !== "ready") {
    console.error("FAIL health", health);
    process.exit(1);
  }
  console.log("OK health", health.json);

  const suffix = String(Date.now()).slice(-6);
  const username = `smoke_${suffix}`;
  const password = "password1234";

  const reg = await req("/api/auth/register", {
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
  if (reg.status !== 200 || !reg.json.userId) {
    console.error("FAIL register", reg);
    process.exit(1);
  }
  console.log("OK register", reg.json.userId);

  const login = await req("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (login.status !== 200 || !login.json.userId) {
    console.error("FAIL login", login);
    process.exit(1);
  }
  console.log("OK login", login.json.userId);

  const bad = await req("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password: "wrong" }),
  });
  if (bad.status !== 401) {
    console.error("FAIL bad-password should be 401", bad);
    process.exit(1);
  }
  console.log("OK bad-password 401");

  console.log("ALL PASSED");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
