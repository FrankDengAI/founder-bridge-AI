/**
 * 空库时自动 seed（Render 首次部署）。
 * 用法：node scripts/seed-if-empty.cjs  或  npx tsx scripts/seed-if-empty.ts
 */
import { PrismaClient } from "@prisma/client";
import { runSeedDatabase } from "../lib/seedRun";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.user.count();
  if (count > 0) {
    console.log(`[seed-if-empty] ${count} user(s) exist, skip seed`);
    return;
  }
  console.log("[seed-if-empty] empty database, running seed...");
  await runSeedDatabase(prisma);
  console.log("[seed-if-empty] done");
}

main()
  .catch((e) => {
    console.error("[seed-if-empty] failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
