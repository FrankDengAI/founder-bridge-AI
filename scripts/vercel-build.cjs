/**
 * Vercel / CI 构建入口：
 * - 有 DATABASE_URL 时执行 prisma migrate deploy（生产库与迁移一致）
 * - 无 DATABASE_URL 时跳过迁移（避免首次未配库时整段构建失败），仍执行 generate + next build
 */
const { spawnSync } = require("node:child_process");

function run(cmd) {
  const result = spawnSync(cmd, {
    shell: true,
    stdio: "inherit",
    env: process.env,
  });
  const code = result.status === null ? 1 : result.status;
  if (code !== 0) process.exit(code);
}

const dbUrl = (process.env.DATABASE_URL || "").trim();

if (dbUrl) {
  console.log("[build] DATABASE_URL is set, running prisma migrate deploy...");
  run("npx prisma migrate deploy");
} else {
  console.warn(
    "[build] DATABASE_URL is not set; skipping prisma migrate deploy.",
  );
  console.warn(
    "[build] Add a Postgres DATABASE_URL in Vercel → Environment Variables, then redeploy so migrations apply.",
  );
}

console.log("[build] prisma generate...");
run("npx prisma generate");

console.log("[build] next build...");
run("npx next build");
