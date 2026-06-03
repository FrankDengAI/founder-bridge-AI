import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** Neon/PgBouncer pooler 需 pgbouncer=true，否则易出现 connection_limit:1 池超时 */
function normalizeDatabaseUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  const isPooler = /pooler|pgbouncer/i.test(url);
  if (!isPooler) return url;
  if (/[?&]pgbouncer=true/i.test(url)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}pgbouncer=true`;
}

const databaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    ...(databaseUrl
      ? { datasources: { db: { url: databaseUrl } } }
      : {}),
  });

globalForPrisma.prisma = prisma;
