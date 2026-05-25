/**
 * Render 启动：先 migrate deploy 再 next start，避免构建阶段未跑迁移导致注册/登录 500。
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

console.log("[render-start] prisma migrate deploy...");
run("npx prisma migrate deploy");

console.log("[render-start] next start...");
run("npm start");
