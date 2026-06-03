import { test, expect } from "@playwright/test";

function attachPoolGuard(page: import("@playwright/test").Page) {
  const bad: string[] = [];
  page.on("response", (res) => {
    const url = res.url();
    if (!url.includes("/api/")) return;
    if (res.status() >= 500) bad.push(`${res.status()} ${url}`);
  });
  return () => {
    expect(bad, bad.join("\n")).toEqual([]);
  };
}

async function registerAndLogin(
  page: import("@playwright/test").Page,
  request: import("@playwright/test").APIRequestContext,
  next = "/home",
) {
  const suffix = String(Date.now()).slice(-6);
  const username = `e2e_smoke_${suffix}`;
  const password = "password1234";

  const reg = await request.post("/api/auth/register", {
    data: {
      username,
      password,
      displayName: "E2E Smoke",
      role: "ADC",
      interestTags: ["VibeCoding"],
    },
  });
  expect(reg.ok()).toBeTruthy();

  await page.goto(`/welcome/login?next=${encodeURIComponent(next)}`);
  await page.locator('input[autocomplete="username"]').fill(username);
  await page.locator('input[autocomplete="current-password"]').fill(password);
  await page.getByRole("button", { name: /登录|Log in|Sign in/i }).click();
  await page.waitForURL(/\/welcome\/mode|\/home|\/search|\/match/, { timeout: 45_000 });
  if (page.url().includes("/welcome/mode")) {
    await page.getByRole("button", { name: /App|手机|Smartphone/i }).first().click();
  }
  return username;
}

test.describe("全站冒烟（无连接池 500）", () => {
  test.describe("游客", () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test("发现页与受保护入口", async ({ page }) => {
      test.setTimeout(90_000);
      const assertNoPool = attachPoolGuard(page);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/home");
      await expect(page).toHaveURL(/\/home/, { timeout: 20_000 });

      const card = page.locator("button[data-author]").first();
      if (await card.isVisible().catch(() => false)) {
        await card.click();
        await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
        await page.getByRole("button", { name: /关闭|Close/i }).click();
      }

      await page.getByRole("button", { name: /^(搜索|Search)$/ }).first().click();
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
      await page.getByRole("button", { name: /关闭|Close/i }).click();

      const nav = page.getByRole("navigation", { name: /主导航|Main navigation/i });
      for (const label of [/^(匹配|Match)$/, /^(团队消息|消息|Messages)$/, /^(我的|Me)$/]) {
        await nav.getByRole("button", { name: label }).click();
        await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
        await page.keyboard.press("Escape");
      }

      assertNoPool();
    });
  });

  test.describe("已登录", () => {
    test("顺序访问主要 Tab 与首页刷新", async ({ page, request }) => {
      test.setTimeout(180_000);
      const assertNoPool = attachPoolGuard(page);
      await page.setViewportSize({ width: 390, height: 844 });
      await registerAndLogin(page, request, "/home");
      await expect(page).toHaveURL(/\/home/, { timeout: 30_000 });

      const routes = ["/home", "/search", "/match", "/messages", "/me", "/tools", "/models"];
      for (const path of routes) {
        await page.goto(path);
        await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
        await expect(page).toHaveURL(new RegExp(path.replace("/", "\\/")), { timeout: 20_000 });
      }

      for (let i = 0; i < 3; i++) {
        await page.goto("/home");
        await page.waitForLoadState("domcontentloaded");
        await page.waitForTimeout(1500);
      }

      assertNoPool();
    });
  });
});
