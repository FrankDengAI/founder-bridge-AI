import { cookies } from "next/headers";
import { COOKIE_DONE, COOKIE_UID } from "./authCookies";

/** 服务端读取当前登录用户 id；未登录返回 null。 */
export function getUserIdFromCookies(): string | null {
  const store = cookies();
  if (store.get(COOKIE_DONE)?.value !== "1") return null;
  const uid = store.get(COOKIE_UID)?.value;
  return uid && uid.length > 0 ? uid : null;
}
