import type { Role } from "@/lib/domain/role";
import { DEMO_USER_ID } from "@/lib/constants";

/** 种子演示账号统一登录密码（`npm run db:seed` 写入 passwordHash） */
export const DEMO_SEED_PASSWORD = "12345678";

export const DEMO_EXTRA_USER_IDS = ["user_demo_01", "user_demo_02", "user_demo_03"] as const;

export type DemoLoginSeedUser = {
  id: string;
  username: string;
  displayName: string;
  role: Role;
};

/** demo1–demo3：与主演示号同密码，便于账号密码登录 */
export const DEMO_LOGIN_SEED_USERS: DemoLoginSeedUser[] = [
  {
    id: "user_demo_01",
    username: "demo1",
    displayName: "演示账号 1",
    role: "JUNGLE",
  },
  {
    id: "user_demo_02",
    username: "demo2",
    displayName: "演示账号 2",
    role: "SUPPORT",
  },
  {
    id: "user_demo_03",
    username: "demo3",
    displayName: "演示账号 3",
    role: "ADC",
  },
];

export function allDemoSeedUserIds(): string[] {
  return [DEMO_USER_ID, ...DEMO_EXTRA_USER_IDS];
}
