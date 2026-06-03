import { test, expect } from "@playwright/test";

test.describe("App 顶栏与登录弹窗", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test("发现页通知按钮仅一处（顶栏 QuickActions）", async ({ page }) => {
    await page.goto("/home");
    await expect(page.getByRole("button", { name: /通知中心|Notifications/i })).toHaveCount(1);
  });

  test("顶栏单行包含语言切换与发布", async ({ page }) => {
    await page.goto("/home");
    const toolbar = page.getByTestId("app-top-toolbar");
    await expect(toolbar).toBeVisible();
    await expect(toolbar.getByRole("button", { name: /^EN$|中文/i })).toBeVisible();
    await expect(toolbar.getByTestId("topbar-publish")).toBeVisible();
  });

  test("顶栏点击发布弹出紧凑登录层", async ({ page }) => {
    await page.goto("/home");
    await page.getByTestId("topbar-publish").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 10_000 });
    await expect(
      dialog.getByRole("button", { name: /登录后继续|Continue after sign in/i }),
    ).toBeVisible();
    const panel = dialog.getByTestId("login-modal-panel");
    await expect(panel).toBeVisible();
    const box = await panel.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.height).toBeLessThan(844 * 0.72);
    await expect(dialog.locator('input[autocomplete="username"]')).toBeFocused({
      timeout: 5_000,
    });
  });

  test("Esc 可关闭登录弹窗", async ({ page }) => {
    await page.goto("/home");
    await page.getByTestId("topbar-publish").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden({ timeout: 5_000 });
  });

  test("已登录用户在匹配页顶栏仍有发布", async ({ page, request }) => {
    const suffix = String(Date.now()).slice(-6);
    const username = `e2e_ui_${suffix}`;
    const password = "password1234";
    const reg = await request.post("/api/auth/register", {
      data: {
        username,
        password,
        displayName: "E2E UI",
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

    await expect(page.getByTestId("app-top-toolbar").getByTestId("topbar-publish")).toBeVisible();
  });
});
