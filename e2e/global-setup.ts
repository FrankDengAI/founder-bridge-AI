import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";
import { PrismaClient } from "@prisma/client";

loadEnv({ path: resolve(process.cwd(), ".env") });
loadEnv({ path: resolve(process.cwd(), ".env.local"), override: true });

/** E2E 前确保库内有帖子/热榜数据（空库会导致搜索热榜等用例失败） */
export default async function globalSetup() {
  if (process.env.PLAYWRIGHT_SKIP_SEED === "1") return;
  if (!process.env.DATABASE_URL) {
    console.warn("[e2e globalSetup] DATABASE_URL unset — skip seed");
    return;
  }

  const prisma = new PrismaClient();
  try {
    const posts = await prisma.post.count();
    if (posts >= 5) {
      console.log("[e2e globalSetup] seed skipped — posts already present:", posts);
      return;
    }
    console.log("[e2e globalSetup] seeding database (posts:", posts, ")…");
    execSync("npx prisma db seed", { stdio: "inherit", cwd: process.cwd() });
  } catch (err) {
    console.warn(
      "[e2e globalSetup] seed skipped — database unavailable or seed failed:",
      err instanceof Error ? err.message : err,
    );
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}
