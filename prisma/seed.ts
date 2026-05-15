import { PrismaClient } from "@prisma/client";
import { DEMO_USER_ID } from "../lib/constants";
import { runSeedDatabase } from "../lib/seedRun";

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
