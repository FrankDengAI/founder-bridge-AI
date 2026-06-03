# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browse-first-login.spec.ts >> 先逛后登 >> 游客点击底栏匹配/消息/我的均弹出登录层
- Location: e2e\browse-first-login.spec.ts:37:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.goto: Test timeout of 60000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/home", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]: App 模式
        - toolbar "App shortcuts" [ref=e10]:
          - button "中文" [ref=e11] [cursor=pointer]
          - generic [ref=e12]:
            - button "Notifications" [ref=e14] [cursor=pointer]:
              - img [ref=e15]
              - generic [ref=e20]: "3"
            - button "Team messages" [ref=e21] [cursor=pointer]:
              - img [ref=e22]
            - button "Command palette" [ref=e24] [cursor=pointer]:
              - img [ref=e25]
            - button "Search" [ref=e27] [cursor=pointer]:
              - img [ref=e28]
            - button "Publish content" [ref=e31] [cursor=pointer]:
              - img [ref=e32]
          - button "Switch to Web mode" [ref=e35] [cursor=pointer]:
            - img [ref=e36]
          - button "Account menu" [ref=e42] [cursor=pointer]:
            - img [ref=e43]
      - banner [ref=e48]
    - navigation "Main navigation" [ref=e102]:
      - generic [ref=e105]:
        - link "Discover" [ref=e106] [cursor=pointer]:
          - /url: /en/home
          - img [ref=e109]
          - generic [ref=e112]: Discover
        - button "Match" [ref=e113] [cursor=pointer]:
          - img [ref=e115]
          - generic [ref=e117]: Match
        - button "Messages" [ref=e118] [cursor=pointer]:
          - img [ref=e120]
          - generic [ref=e122]: Messages
        - button "Me" [ref=e123] [cursor=pointer]:
          - img [ref=e125]
          - generic [ref=e128]: Me
  - alert [ref=e129]
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("先逛后登", () => {
  4   |   test.use({ storageState: { cookies: [], origins: [] } });
  5   | 
  6   |   test("游客可进发现页且不卡在模式选择", async ({ page }) => {
  7   |     await page.goto("/home");
  8   |     await expect(page).not.toHaveURL(/\/welcome\/mode/);
  9   |     await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({
  10  |       timeout: 15_000,
  11  |     });
  12  |   });
  13  | 
  14  |   test("游客点击 Feed 卡片弹出登录层", async ({ page }) => {
  15  |     await page.setViewportSize({ width: 390, height: 844 });
  16  |     await page.goto("/home");
  17  |     const card = page.locator("button[data-author]").first();
  18  |     await expect(card).toBeVisible({ timeout: 15_000 });
  19  |     await card.click();
  20  |     await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
  21  |     await expect(page).toHaveURL(/\/home/);
  22  |   });
  23  | 
  24  |   test("从搜索切回发现不出现灵感宇宙 Hero 闪屏", async ({ page }) => {
  25  |     await page.setViewportSize({ width: 390, height: 844 });
  26  |     await page.goto("/home");
  27  |     await page.getByRole("button", { name: /^(搜索|Search)$/ }).first().click();
  28  |     const dialog = page.getByRole("dialog");
  29  |     await expect(dialog).toBeVisible({ timeout: 10_000 });
  30  |     await dialog.getByRole("button", { name: /关闭|Close/i }).click();
  31  |     await expect(dialog).toHaveCount(0, { timeout: 5_000 });
  32  |     await expect(page).toHaveURL(/\/home/, { timeout: 15_000 });
  33  |     await expect(page.getByText(/灵感宇宙|Inspiration Universe/i)).toHaveCount(0);
  34  |     await expect(page.getByText(/已解锁成就|Unlocked badges/i)).toHaveCount(0);
  35  |   });
  36  | 
  37  |   test("游客点击底栏匹配/消息/我的均弹出登录层", async ({ page }) => {
  38  |     await page.setViewportSize({ width: 390, height: 844 });
  39  |     await page.goto("/home");
  40  |     const nav = page.getByRole("navigation", { name: /主导航|Main navigation/i });
  41  | 
  42  |     const tabLabels = [
  43  |       /^(匹配|Match)$/,
  44  |       /^(团队消息|消息|Messages)$/,
  45  |       /^(我的|Me)$/,
  46  |     ];
  47  |     for (const label of tabLabels) {
  48  |       await page.keyboard.press("Escape").catch(() => {});
> 49  |       await page.goto("/home");
      |                  ^ Error: page.goto: Test timeout of 60000ms exceeded.
  50  |       await nav.getByRole("button", { name: label }).click();
  51  |       await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
  52  |       await expect(page).toHaveURL(/\/home/);
  53  |     }
  54  |   });
  55  | 
  56  |   test("直访受保护路径回到 home 并弹出登录层", async ({ page }) => {
  57  |     await page.goto("/match");
  58  |     await expect(page).toHaveURL(/\/home/, { timeout: 15_000 });
  59  |     const dialog = page.getByRole("dialog");
  60  |     await expect(dialog).toBeVisible({ timeout: 10_000 });
  61  |     await expect(dialog.getByRole("heading", { level: 2 })).toBeVisible();
  62  |   });
  63  | 
  64  |   test("注册登录后可进入匹配页", async ({ page, request }) => {
  65  |     test.setTimeout(120_000);
  66  |     const suffix = String(Date.now()).slice(-6);
  67  |     const username = `e2e_${suffix}`;
  68  |     const password = "password1234";
  69  | 
  70  |     const reg = await request.post("/api/auth/register", {
  71  |       data: {
  72  |         username,
  73  |         password,
  74  |         displayName: "E2E User",
  75  |         role: "ADC",
  76  |         interestTags: ["VibeCoding"],
  77  |       },
  78  |     });
  79  |     expect(reg.ok()).toBeTruthy();
  80  | 
  81  |     await page.goto(`/welcome/login?next=${encodeURIComponent("/match")}`);
  82  |     await page.locator('input[autocomplete="username"]').fill(username);
  83  |     await page.locator('input[autocomplete="current-password"]').fill(password);
  84  |     await page.getByRole("button", { name: /登录|Log in|Sign in/i }).click();
  85  | 
  86  |     await page.waitForURL(/\/welcome\/mode|\/match|\/home/, { timeout: 45_000 });
  87  |     if (page.url().includes("/welcome/mode")) {
  88  |       await page.getByRole("button", { name: /App|手机|Smartphone/i }).first().click();
  89  |     }
  90  |     await expect(page).toHaveURL(/\/match/, { timeout: 45_000 });
  91  |   });
  92  | 
  93  |   test("搜索页滚动后社区热榜不被吸顶栏遮挡", async ({ page, request }) => {
  94  |     test.setTimeout(120_000);
  95  |     const suffix = String(Date.now()).slice(-6);
  96  |     const username = `e2e_srch_${suffix}`;
  97  |     const password = "password1234";
  98  | 
  99  |     const reg = await request.post("/api/auth/register", {
  100 |       data: {
  101 |         username,
  102 |         password,
  103 |         displayName: "E2E Search",
  104 |         role: "ADC",
  105 |         interestTags: ["VibeCoding"],
  106 |       },
  107 |     });
  108 |     expect(reg.ok()).toBeTruthy();
  109 | 
  110 |     await page.goto(`/welcome/login?next=${encodeURIComponent("/search")}`);
  111 |     await page.locator('input[autocomplete="username"]').fill(username);
  112 |     await page.locator('input[autocomplete="current-password"]').fill(password);
  113 |     await page.getByRole("button", { name: /登录|Log in|Sign in/i }).click();
  114 | 
  115 |     await page.waitForURL(/\/welcome\/mode|\/search|\/home/, { timeout: 45_000 });
  116 |     if (page.url().includes("/welcome/mode")) {
  117 |       await page.getByRole("button", { name: /App|手机|Smartphone/i }).first().click();
  118 |     }
  119 |     await page.goto("/search");
  120 |     await expect(page).toHaveURL(/\/search/, { timeout: 30_000 });
  121 | 
  122 |     const trending = page.getByRole("heading", { name: /社区热榜|Community charts/i });
  123 |     await expect(trending).toBeVisible({ timeout: 20_000 });
  124 | 
  125 |     await page.evaluate(() => window.scrollBy(0, 520));
  126 |     await expect(trending).toBeVisible({ timeout: 10_000 });
  127 | 
  128 |     const trendingBox = await trending.boundingBox();
  129 |     const stickyBar = page.locator(".sticky.top-0").first();
  130 |     const stickyBox = await stickyBar.boundingBox();
  131 |     expect(trendingBox).not.toBeNull();
  132 |     expect(stickyBox).not.toBeNull();
  133 |     if (trendingBox && stickyBox) {
  134 |       expect(trendingBox.y).toBeGreaterThanOrEqual(stickyBox.y + stickyBox.height - 8);
  135 |     }
  136 |   });
  137 | });
  138 | 
```