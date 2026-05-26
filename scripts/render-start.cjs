/**
 * Render 启动：migrate deploy → 空库 seed → next start
 */
require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local", override: true });

const { ensurePrismaEnv } = require("./ensure-prisma-env.cjs");
ensurePrismaEnv();

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

console.log("[render-start] prisma migrate deploy...");
run("npx prisma migrate deploy");

if (process.env.DATABASE_URL) {
  console.log("[render-start] seed-if-empty (when no users)...");
  const seed = spawnSync("npx tsx scripts/seed-if-empty.ts", {
    shell: true,
    stdio: "inherit",
    env: process.env,
  });
  if (seed.status !== 0) {
    console.warn("[render-start] seed-if-empty failed (non-fatal), continuing...");
  }
}

console.log("[render-start] next start...");
run("npm start");
