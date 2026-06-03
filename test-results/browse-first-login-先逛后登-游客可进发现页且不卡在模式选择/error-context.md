# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browse-first-login.spec.ts >> 先逛后登 >> 游客可进发现页且不卡在模式选择
- Location: e2e\browse-first-login.spec.ts:6:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { level: 1 }).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByRole('heading', { level: 1 }).first()

```

```yaml
- complementary:
  - link "VibeCoding":
    - /url: /en/home
  - paragraph: Web mode
  - navigation "Main navigation":
    - link "Discover":
      - /url: /en/home
      - img
      - text: Discover
    - button "Match":
      - img
      - text: Match
    - button "Messages":
      - img
      - text: Messages
    - button "Me":
      - img
      - text: Me
  - button "Publish":
    - img
    - text: Publish
  - button "Settings":
    - img
    - text: Settings
  - button "Switch to App mode":
    - img
    - text: Switch to App mode
- banner:
  - paragraph: Discover
  - paragraph: Stay first, then meet the right people
  - link "Search notes, tools, people…":
    - /url: /en/search
    - img
    - text: Search notes, tools, people…
  - text: Web mode
  - button "中文"
  - button "Switch to App mode":
    - img
  - button "Account menu":
    - img
    - img
  - button "Notifications":
    - img
    - text: "3"
- main:
  - paragraph: Something went wrong
  - paragraph: "Invalid `prisma.post.count()` invocation: Timed out fetching a new connection from the connection pool. More info: http://pris.ly/d/connection-pool (Current connection pool timeout: 30, connection limit: 1)"
  - button "Retry"
- complementary:
  - paragraph: Community hub
  - heading "No partner yet? Start here" [level=2]
  - link "Model reputation board Read real short reviews and pick by coding, writing, or value — not just spec sheets. Go to ratings":
    - /url: /en/models
    - img
    - paragraph: Model reputation board
    - paragraph: Read real short reviews and pick by coding, writing, or value — not just spec sheets.
    - text: Go to ratings
    - img
  - link "Find complementary partners Tech × product × growth — role-complement matching so newcomers can start chatting. Start matching":
    - /url: /en/match
    - img
    - paragraph: Find complementary partners
    - paragraph: Tech × product × growth — role-complement matching so newcomers can start chatting.
    - text: Start matching
    - img
  - link "Start a model discussion Is Claude good for frontend? Is DeepSeek worth it? Share what you learned the hard way. Write a post":
    - /url: /en/publish?type=MODEL_DISCUSSION
    - img
    - paragraph: Start a model discussion
    - paragraph: Is Claude good for frontend? Is DeepSeek worth it? Share what you learned the hard way.
    - text: Write a post
    - img
- alert
- img
- text: 1 error
- button "Hide Errors":
  - img
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
> 9   |     await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({
      |                                                                   ^ Error: expect(locator).toBeVisible() failed
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
  49  |       await page.goto("/home");
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
```