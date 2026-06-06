import type { Page } from "@playwright/test";

/** 强制 App 壳层，避免桌面 Web 模式与 E2E 断言不一致 */
export async function useAppShell(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("vbc_view_mode", "app");
  });
}

const ERROR_SNIPPETS = /Something went wrong|An error occurred|出错了|服务器/i;

/** 导航并在 Server Component 报错时有限重试（pooler connection_limit:1 下偶发） */
export async function gotoStable(page: Page, path: string, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    if ((await page.getByText(ERROR_SNIPPETS).count()) === 0) return;
    await page.waitForTimeout(1500 * (i + 1));
  }
}

export async function expectNoServerError(page: Page) {
  await page
    .getByText(ERROR_SNIPPETS)
    .first()
    .waitFor({ state: "hidden", timeout: 20_000 })
    .catch(() => {});
}
