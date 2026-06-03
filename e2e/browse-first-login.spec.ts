import { test, expect } from "@playwright/test";

test.describe("先逛后登", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("游客可进发现页且不卡在模式选择", async ({ page }) => {
    await page.goto("/home");
    await expect(page).not.toHaveURL(/\/welcome\/mode/);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("直访受保护路径回到 home 并弹出登录层", async ({ page }) => {
    await page.goto("/match");
    await expect(page).toHaveURL(/\/home/, { timeout: 15_000 });
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 10_000 });
    await expect(dialog.getByRole("heading", { level: 2 })).toBeVisible();
  });

  test("注册登录后可进入匹配页", async ({ page, request }) => {
    test.setTimeout(120_000);
    const suffix = String(Date.now()).slice(-6);
    const username = `e2e_${suffix}`;
    const password = "password1234";

    const reg = await request.post("/api/auth/register", {
      data: {
        username,
        password,
        displayName: "E2E User",
        role: "ADC",
        interestTags: ["VibeCoding"],
      },
    });
    expect(reg.ok()).toBeTruthy();

    await page.goto(`/welcome/login?next=${encodeURIComponent("/match")}`);
    await page.locator('input[autocomplete="username"]').fill(username);
    await page.locator('input[autocomplete="current-password"]').fill(password);
    await page.getByRole("button", { name: /登录|Log in|Sign in/i }).click();

    await page.waitForURL(/\/welcome\/mode|\/match|\/home/, { timeout: 45_000 });
    if (page.url().includes("/welcome/mode")) {
      await page.getByRole("button", { name: /App|手机|Smartphone/i }).first().click();
    }
    await expect(page).toHaveURL(/\/match/, { timeout: 45_000 });
  });
});
