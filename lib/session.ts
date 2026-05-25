import "server-only";
import { getUserIdFromSession } from "@/lib/auth/sessionStore";

/** 从签名 Session Cookie 解析当前用户 id，未登录返回 null。 */
export async function getUserIdFromCookies(): Promise<string | null> {
  return getUserIdFromSession();
}
