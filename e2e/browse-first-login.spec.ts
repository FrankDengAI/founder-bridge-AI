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

  test("游客点击 Feed 卡片弹出登录层", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/home");
    const card = page.locator("button[data-author]").first();
    await expect(card).toBeVisible({ timeout: 15_000 });
    await card.click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/\/home/);
  });

  test("从搜索切回发现不出现灵感宇宙 Hero 闪屏", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/home");
    await page.getByRole("button", { name: /^(搜索|Search)$/ }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 10_000 });
    await dialog.getByRole("button", { name: /关闭|Close/i }).click();
    await expect(dialog).toHaveCount(0, { timeout: 5_000 });
    await expect(page).toHaveURL(/\/home/, { timeout: 15_000 });
    await expect(page.getByText(/灵感宇宙|Inspiration Universe/i)).toHaveCount(0);
    await expect(page.getByText(/已解锁成就|Unlocked badges/i)).toHaveCount(0);
  });

  test("游客点击底栏匹配/消息/我的均弹出登录层", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/home");
    const nav = page.getByRole("navigation", { name: /主导航|Main navigation/i });

    const tabLabels = [
      /^(匹配|Match)$/,
      /^(团队消息|消息|Messages)$/,
      /^(我的|Me)$/,
    ];
    for (const label of tabLabels) {
      await page.keyboard.press("Escape").catch(() => {});
      await page.goto("/home");
      await nav.getByRole("button", { name: label }).click();
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
      await expect(page).toHaveURL(/\/home/);
    }
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

  test("搜索页滚动后社区热榜不被吸顶栏遮挡", async ({ page, request }) => {
    test.setTimeout(120_000);
    const suffix = String(Date.now()).slice(-6);
    const username = `e2e_srch_${suffix}`;
    const password = "password1234";

    const reg = await request.post("/api/auth/register", {
      data: {
        username,
        password,
        displayName: "E2E Search",
        role: "ADC",
        interestTags: ["VibeCoding"],
      },
    });
    expect(reg.ok()).toBeTruthy();

    await page.goto(`/welcome/login?next=${encodeURIComponent("/search")}`);
    await page.locator('input[autocomplete="username"]').fill(username);
    await page.locator('input[autocomplete="current-password"]').fill(password);
    await page.getByRole("button", { name: /登录|Log in|Sign in/i }).click();

    await page.waitForURL(/\/welcome\/mode|\/search|\/home/, { timeout: 45_000 });
    if (page.url().includes("/welcome/mode")) {
      await page.getByRole("button", { name: /App|手机|Smartphone/i }).first().click();
    }
    await page.goto("/search");
    await expect(page).toHaveURL(/\/search/, { timeout: 30_000 });

    const trending = page.getByRole("heading", { name: /社区热榜|Community charts/i });
    await expect(trending).toBeVisible({ timeout: 20_000 });

    await page.evaluate(() => window.scrollBy(0, 520));
    await expect(trending).toBeVisible({ timeout: 10_000 });

    const trendingBox = await trending.boundingBox();
    const stickyBar = page.locator(".sticky.top-0").first();
    const stickyBox = await stickyBar.boundingBox();
    expect(trendingBox).not.toBeNull();
    expect(stickyBox).not.toBeNull();
    if (trendingBox && stickyBox) {
      expect(trendingBox.y).toBeGreaterThanOrEqual(stickyBox.y + stickyBox.height - 8);
    }
  });
});
