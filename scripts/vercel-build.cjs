/**
 * Vercel / CI / Render 构建入口：
 * - 有 DATABASE_URL 时执行 prisma migrate deploy（生产库与迁移一致）
 * - 无 DATABASE_URL 时跳过迁移（避免首次未配库时整段构建失败），仍执行 generate + next build
 */
require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local", override: true });

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
  // 一次性：若 Neon 上曾因旧版 migration.sql（如带 BOM）失败并留下 P3009，在 Vercel 设
  // PRISMA_RESOLVE_ROLLED_BACK_INIT=1 触发一次 resolve，部署成功后再删掉该变量。
  if (process.env.PRISMA_RESOLVE_ROLLED_BACK_INIT === "1") {
    console.log(
      "[build] PRISMA_RESOLVE_ROLLED_BACK_INIT=1: marking failed init migration as rolled back...",
    );
    const resolve = spawnSync(
      "npx prisma migrate resolve --rolled-back 20260215120000_init_postgres",
      { shell: true, stdio: "inherit", env: process.env },
    );
    const rc = resolve.status === null ? 1 : resolve.status;
    if (rc !== 0) {
      console.warn(
        "[build] migrate resolve exited with",
        rc,
        "(若已无失败记录可忽略)。继续执行 migrate deploy。",
      );
    }
  }

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
