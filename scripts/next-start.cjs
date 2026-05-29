/**
 * 生产启动：缺少 SESSION_SECRET 时自动生成，再启动 next start。
 * 供 npm start 与 render-start 共用，无需在 Render 手动配置 SESSION_SECRET。
 */
require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local", override: true });

const { ensureSessionSecret } = require("./ensure-session-secret.cjs");
ensureSessionSecret();

const { spawnSync } = require("node:child_process");

const result = spawnSync("npx next start", {
  shell: true,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status === null ? 1 : result.status);
