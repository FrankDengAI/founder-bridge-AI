# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browse-first-login.spec.ts >> 先逛后登 >> 游客可进发现页且不卡在模式选择
- Location: e2e\browse-first-login.spec.ts:7:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.goto: Test timeout of 60000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/home", waiting until "domcontentloaded"

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
            - button "Command palette" [ref=e21] [cursor=pointer]:
              - img [ref=e22]
            - button "Search" [ref=e24] [cursor=pointer]:
              - img [ref=e25]
            - button "Publish content" [ref=e28] [cursor=pointer]:
              - img [ref=e29]
          - button "Switch to Web mode" [ref=e32] [cursor=pointer]:
            - img [ref=e33]
          - button "Account menu" [ref=e39] [cursor=pointer]:
            - img [ref=e40]
      - banner [ref=e45]
    - navigation "Main navigation" [ref=e99]:
      - generic [ref=e102]:
        - link "Discover" [ref=e103] [cursor=pointer]:
          - /url: /en/home
          - img [ref=e106]
          - generic [ref=e109]: Discover
        - button "Match" [ref=e110] [cursor=pointer]:
          - img [ref=e112]
          - generic [ref=e114]: Match
        - button "Bounty" [ref=e115] [cursor=pointer]:
          - img [ref=e117]
          - generic [ref=e123]: Bounty
        - button "Messages" [ref=e124] [cursor=pointer]:
          - img [ref=e126]
          - generic [ref=e128]: Messages
        - button "Me" [ref=e129] [cursor=pointer]:
          - img [ref=e131]
          - generic [ref=e134]: Me
  - alert [ref=e135]
```

# Test source

```ts
  1  | import type { Page } from "@playwright/test";
  2  | 
  3  | /** 强制 App 壳层，避免桌面 Web 模式与 E2E 断言不一致 */
  4  | export async function useAppShell(page: Page) {
  5  |   await page.addInitScript(() => {
  6  |     sessionStorage.setItem("vbc_view_mode", "app");
  7  |   });
  8  | }
  9  | 
  10 | const ERROR_SNIPPETS = /Something went wrong|An error occurred|出错了|服务器/i;
  11 | 
  12 | /** 导航并在 Server Component 报错时有限重试（pooler connection_limit:1 下偶发） */
  13 | export async function gotoStable(page: Page, path: string, attempts = 3) {
  14 |   for (let i = 0; i < attempts; i++) {
> 15 |     await page.goto(path, { waitUntil: "domcontentloaded" });
     |                ^ Error: page.goto: Test timeout of 60000ms exceeded.
  16 |     if ((await page.getByText(ERROR_SNIPPETS).count()) === 0) return;
  17 |     await page.waitForTimeout(1500 * (i + 1));
  18 |   }
  19 | }
  20 | 
  21 | export async function expectNoServerError(page: Page) {
  22 |   await page
  23 |     .getByText(ERROR_SNIPPETS)
  24 |     .first()
  25 |     .waitFor({ state: "hidden", timeout: 20_000 })
  26 |     .catch(() => {});
  27 | }
  28 | 
```