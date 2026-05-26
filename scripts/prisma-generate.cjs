const { spawnSync } = require("node:child_process");
const { ensurePrismaEnv } = require("./ensure-prisma-env.cjs");

ensurePrismaEnv({ allowPlaceholder: true });

const result = spawnSync("npx prisma generate", {
  shell: true,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status === null ? 1 : result.status);
