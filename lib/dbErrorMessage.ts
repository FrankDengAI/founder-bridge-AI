import { Prisma } from "@prisma/client";

const isProd = process.env.NODE_ENV === "production";

export function authConfigErrorMessage(err: unknown): string | null {
  if (!(err instanceof Error)) return null;
  if (/SESSION_SECRET is required/i.test(err.message)) {
    return isProd
      ? "服务未配置 SESSION_SECRET：请在 Render Dashboard → Environment 添加至少 16 位随机字符串后重新部署"
      : "请在 .env.local 配置 SESSION_SECRET（至少 16 位）";
  }
  return null;
}

export function dbErrorMessage(err: unknown): string {
  const authMsg = authConfigErrorMessage(err);
  if (authMsg) return authMsg;

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return isProd
      ? "数据库未连接：请在 Render 环境变量中配置 DATABASE_URL 并重新部署"
      : "数据库未连接：请在 .env.local 配置 DATABASE_URL，并执行 npx prisma migrate deploy";
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") return "该账号已被占用";
    if (err.code === "P1017") {
      return isProd
        ? "数据库连接中断，请稍后重试或检查 Render 数据库状态"
        : "数据库连接中断：请检查 DATABASE_URL 与网络，或确认 Neon 库未休眠";
    }
    if (err.code === "P2024") {
      return "数据库连接繁忙，请稍后重试（若本地开发可改用直连 URL 或增大 pooler connection_limit）";
    }
    if (err.code === "P2021" || err.code === "P2022") {
      return isProd
        ? "数据库表结构未就绪：请在 Render 部署日志中确认 prisma migrate deploy 已成功"
        : "数据库结构未就绪：请执行 npx prisma migrate deploy";
    }
  }
  if (
    err instanceof Error &&
    /connection pool|Timed out fetching a new connection/i.test(err.message)
  ) {
    return "数据库连接繁忙，请稍后重试";
  }
  if (err instanceof Error && /Environment variable not found: DATABASE_URL/i.test(err.message)) {
    return isProd
      ? "数据库未连接：请在 Render 环境变量中配置 DATABASE_URL"
      : "数据库未连接：请在 .env.local 配置 DATABASE_URL";
  }
  if (err instanceof Error && /Environment variable not found: DIRECT_URL/i.test(err.message)) {
    return isProd
      ? "迁移配置不完整：使用 Neon 时请在 Render 同时配置 DIRECT_URL（非 pooler 直连）"
      : "请在 .env.local 配置 DIRECT_URL（Neon 直连，非 pooler）";
  }
  return "服务暂时不可用，请稍后重试";
}
