/**
 * Prisma schema 需要 DATABASE_URL 与 DIRECT_URL。
 * - Render / 单连接串部署：未设 DIRECT_URL 时回退为 DATABASE_URL
 * - 本地 npm install 无 .env：可选占位串，仅用于 prisma generate（不连库）
 */
require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local", override: true });

const PLACEHOLDER =
  "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder?schema=public";

function ensurePrismaEnv({ allowPlaceholder = false } = {}) {
  const dbUrl = (process.env.DATABASE_URL || "").trim();
  const directUrl = (process.env.DIRECT_URL || "").trim();

  if (dbUrl && !directUrl) {
    process.env.DIRECT_URL = dbUrl;
    console.log("[prisma-env] DIRECT_URL 未设置，已回退为 DATABASE_URL");
    return;
  }

  if (!dbUrl && !directUrl && allowPlaceholder) {
    process.env.DATABASE_URL = PLACEHOLDER;
    process.env.DIRECT_URL = PLACEHOLDER;
    console.warn(
      "[prisma-env] DATABASE_URL / DIRECT_URL 均未设置，使用占位连接串（仅 prisma generate）",
    );
  }
}

module.exports = { ensurePrismaEnv };

if (require.main === module) {
  ensurePrismaEnv({ allowPlaceholder: process.argv.includes("--allow-placeholder") });
}
