import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { DEMO_USER_ID } from "../lib/constants";
import { runSeedDatabase } from "../lib/seedRun";

// Prisma CLI 默认只读 .env；Next 常用 .env.local。种子脚本两处都加载，后者优先。
loadEnv({ path: resolve(process.cwd(), ".env") });
loadEnv({ path: resolve(process.cwd(), ".env.local"), override: true });

const prisma = new PrismaClient();

runSeedDatabase(prisma)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Seed OK. Demo user id:", DEMO_USER_ID);
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
