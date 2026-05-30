/**
 * 生成 README 截图与 GIF：npm run docs:assets
 * 首次请先：npm run docs:assets:install
 */
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import GIFEncoder from "gif-encoder-2";
import sharp from "sharp";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "docs", "assets", "readme");
const BASE_URL = (process.env.DOCS_ASSETS_BASE_URL || "http://localhost:3010").replace(/\/$/, "");
const PORT = Number(new URL(BASE_URL).port || 3010);

dotenv.config({ path: path.join(ROOT, ".env") });
dotenv.config({ path: path.join(ROOT, ".env.local"), override: true });

const HAS_DB = Boolean(process.env.DATABASE_URL?.trim());

/** @type {import("node:child_process").ChildProcess | null} */
let devProc = null;
let startedDev = false;

function log(msg) {
  console.log(`[docs:assets] ${msg}`);
}

function ensureOutDir() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function waitForHealth(timeoutMs = 120_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      if (res.ok) return true;
    } catch {
      /* retry */
    }
    await sleep(800);
  }
  return false;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function startDevServerIfNeeded() {
  if (await waitForHealth(2_000)) {
    log(`server already up at ${BASE_URL}`);
    return;
  }

  log(`starting next dev on port ${PORT}…`);
  devProc = spawn("npx", ["next", "dev", "-p", String(PORT)], {
    cwd: ROOT,
    shell: true,
    stdio: "ignore",
    env: process.env,
  });
  startedDev = true;

  const ok = await waitForHealth(120_000);
  if (!ok) {
    throw new Error(`dev server did not become healthy at ${BASE_URL}`);
  }
  log("dev server ready");
}

function stopDevServer() {
  if (devProc && startedDev) {
    try {
      if (process.platform === "win32") {
        spawnSync("taskkill", ["/pid", String(devProc.pid), "/f", "/t"], { stdio: "ignore" });
      } else {
        devProc.kill("SIGTERM");
      }
    } catch {
      /* ignore */
    }
  }
}

function parseSetCookieHeader(header) {
  const m = String(header || "").match(/^([^=]+)=([^;]*)/);
  if (!m) return null;
  return { name: m[1], value: m[2] };
}

async function ensureSeedData() {
  if (!HAS_DB) return;
  log("running db:seed (non-fatal if already seeded)…");
  spawnSync("npm", ["run", "db:seed"], {
    cwd: ROOT,
    shell: true,
    stdio: "inherit",
    env: process.env,
  });
}

async function loginViaApi() {
  const suffix = String(Date.now()).slice(-6);
  const username = `docs_${suffix}`;
  const password = "password1234";

  const reg = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      displayName: "Docs Capture",
      role: "ADC",
      interestTags: ["VibeCoding"],
      skillKeywords: ["Next.js", "TypeScript"],
      direction: "AI 社交产品",
      intro: "README 自动化截图账号",
    }),
  });
  if (!reg.ok) {
    const text = await reg.text();
    throw new Error(`register failed (${reg.status}): ${text.slice(0, 200)}`);
  }

  const login = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!login.ok) {
    throw new Error(`login failed (${login.status})`);
  }

  const host = new URL(BASE_URL).hostname;
  const cookies = [];
  const raw = login.headers.getSetCookie?.() ?? [];
  const singles = raw.length ? raw : [login.headers.get("set-cookie")].filter(Boolean);
  for (const line of singles) {
    const parsed = parseSetCookieHeader(line);
    if (parsed) {
      cookies.push({
        name: parsed.name,
        value: parsed.value,
        domain: host,
        path: "/",
      });
    }
  }
  return cookies;
}

async function savePng(buffer, filename, opts = {}) {
  const { cropHeight, maxWidth = 1280 } = opts;
  let img = sharp(buffer);
  const meta = await img.metadata();
  if (cropHeight && meta.height && meta.height > cropHeight) {
    img = img.extract({ left: 0, top: 0, width: meta.width, height: cropHeight });
  }
  img = img.resize({ width: maxWidth, withoutEnlargement: true }).png({ quality: 82, compressionLevel: 9 });
  const out = path.join(OUT_DIR, filename);
  await img.toFile(out);
  const stat = fs.statSync(out);
  log(`saved ${filename} (${Math.round(stat.size / 1024)} KB)`);
}

async function gotoPage(page, url, waitMs = 1500) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForTimeout(waitMs);
}

async function captureScreenshot(page, filename, opts = {}) {
  const { url, waitMs = 1500, clip, fullPage = false } = opts;
  if (url) await gotoPage(page, url, waitMs);
  const buffer = await page.screenshot({ type: "png", fullPage, clip });
  await savePng(buffer, filename, opts);
}

async function framesToGif(frames, filename, { width = 640, delay = 100 } = {}) {
  if (!frames.length) throw new Error("no frames for gif");

  const firstMeta = await sharp(frames[0]).metadata();
  const scale = width / (firstMeta.width || width);
  const height = Math.round((firstMeta.height || 900) * scale);

  const encoder = new GIFEncoder(width, height);
  encoder.setDelay(delay);
  encoder.setRepeat(0);
  encoder.setQuality(10);
  encoder.start();

  for (const frame of frames) {
    const rgba = await sharp(frame)
      .resize(width, height, { fit: "fill" })
      .ensureAlpha()
      .raw()
      .toBuffer();
    encoder.addFrame(rgba);
  }

  encoder.finish();
  const out = path.join(OUT_DIR, filename);
  fs.writeFileSync(out, encoder.out.getData());
  const stat = fs.statSync(out);
  log(`saved ${filename} (${Math.round(stat.size / 1024)} KB, ${frames.length} frames)`);
}

async function captureGif(page, filename, recordFn, { frameCount = 36, intervalMs = 100, width = 640 } = {}) {
  const frames = [];
  const captureLoop = (async () => {
    for (let i = 0; i < frameCount; i++) {
      frames.push(await page.screenshot({ type: "png" }));
      await sleep(intervalMs);
    }
  })();
  await recordFn();
  await captureLoop;
  await framesToGif(frames, filename, { width, delay: intervalMs });
}

const CHROME_PATHS = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

async function launchBrowser() {
  for (const channel of ["chrome", "msedge"]) {
    try {
      return await chromium.launch({ headless: true, channel });
    } catch {
      /* try next */
    }
  }
  for (const exe of CHROME_PATHS) {
    if (exe && fs.existsSync(exe)) {
      return await chromium.launch({ headless: true, executablePath: exe });
    }
  }
  return await chromium.launch({ headless: true });
}

async function setupBrowser(cookies = []) {
  const browser = await launchBrowser();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    locale: "zh-CN",
  });
  if (cookies.length) await context.addCookies(cookies);
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("vbc_view_mode", "web");
    } catch {
      /* ignore */
    }
  });
  const page = await context.newPage();
  return { browser, context, page };
}

async function captureMarketing(page) {
  await captureScreenshot(page, "hero-cover.png", {
    url: `${BASE_URL}/`,
    waitMs: 2500,
    cropHeight: 1280,
  });

  await captureScreenshot(page, "marketing-bento.png", {
    url: `${BASE_URL}/#features`,
    waitMs: 2000,
  });
}

async function captureAppPages(page) {
  const pages = [
    { file: "app-home-feed.png", url: `${BASE_URL}/home`, waitMs: 2500 },
    { file: "app-tools-market.png", url: `${BASE_URL}/tools`, waitMs: 2000 },
    { file: "app-workspace.png", url: `${BASE_URL}/workspace`, waitMs: 2000 },
    { file: "app-models-rank.png", url: `${BASE_URL}/models`, waitMs: 2000 },
  ];
  for (const p of pages) {
    await captureScreenshot(page, p.file, { url: p.url, waitMs: p.waitMs });
  }

  await gotoPage(page, `${BASE_URL}/match`, 1500);
  const matchBtn = page.getByRole("button", { name: /开始匹配|保存画像并开始匹配/ }).first();
  if (await matchBtn.isVisible().catch(() => false)) {
    await matchBtn.click();
    await page.waitForTimeout(4000);
    const expand = page.locator("button").filter({ has: page.locator("svg") }).nth(0);
    const chevron = page.getByRole("button").filter({ hasText: /展开|详情|雷达|维度/ }).first();
    if (await chevron.isVisible().catch(() => false)) {
      await chevron.click();
      await page.waitForTimeout(800);
    }
  }
  await savePng(await page.screenshot({ type: "png" }), "app-match-results.png");

  if (!(await page.locator("text=匹配分").first().isVisible().catch(() => false))) {
    log("match results sparse — fallback marketing match preview");
    await captureScreenshot(page, "app-match-results.png", {
      url: `${BASE_URL}/#match`,
      waitMs: 2000,
    });
  }
}

async function captureGifs(page) {
  const gifOpts = { frameCount: 24, intervalMs: 150, width: 480 };
  await gotoPage(page, `${BASE_URL}/home`, 1200);

  await captureGif(
    page,
    "demo-locale-switch.gif",
    async () => {
      const enBtn = page.getByRole("button", { name: "EN" }).first();
      await enBtn.waitFor({ state: "visible", timeout: 10_000 });
      await sleep(400);
      await enBtn.click();
      await sleep(1200);
      const zhBtn = page.getByRole("button", { name: /中文|ZH/ }).first();
      if (await zhBtn.isVisible().catch(() => false)) await zhBtn.click();
    },
    { ...gifOpts },
  );

  await gotoPage(page, `${BASE_URL}/home`, 800);
  await captureGif(
    page,
    "demo-command-palette.gif",
    async () => {
      await page.keyboard.press("Control+KeyK");
      await page.waitForTimeout(400);
      await page.keyboard.type("匹配");
      await page.waitForTimeout(1600);
    },
    { ...gifOpts },
  );

  await gotoPage(page, `${BASE_URL}/match`, 1000);
  await captureGif(
    page,
    "demo-match-flow.gif",
    async () => {
      const btn = page.getByRole("button", { name: /开始匹配|保存画像并开始匹配/ }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        await sleep(4500);
      }
    },
    { ...gifOpts, frameCount: 28 },
  );

  await gotoPage(page, `${BASE_URL}/home`, 1000);
  await captureGif(
    page,
    "demo-feed-scroll.gif",
    async () => {
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollBy({ top: 500, behavior: "smooth" }));
        await sleep(900);
      }
    },
    { ...gifOpts },
  );
}

async function main() {
  ensureOutDir();
  log(`output → ${OUT_DIR}`);

  await startDevServerIfNeeded();

  if (HAS_DB) {
    await ensureSeedData();
  } else {
    log("WARN: no DATABASE_URL — skipping app pages & gifs that need auth");
  }

  let cookies = [];
  if (HAS_DB) {
    try {
      cookies = await loginViaApi();
      log("logged in via API");
    } catch (e) {
      log(`WARN: login failed — ${e instanceof Error ? e.message : e}`);
    }
  }

  const { browser, page } = await setupBrowser(cookies);
  try {
    await captureMarketing(page);

    if (HAS_DB && cookies.length) {
      await captureAppPages(page);
      await captureGifs(page);
    }
  } finally {
    await browser.close();
  }

  const files = fs.readdirSync(OUT_DIR).filter((f) => /\.(png|gif)$/i.test(f));
  log(`done — ${files.length} assets in docs/assets/readme/`);
  if (files.length < 5) {
    log("WARN: few assets generated; check DATABASE_URL and run docs:assets:install");
    process.exitCode = 1;
  }
}

main()
  .catch((e) => {
    console.error("[docs:assets] FAILED", e);
    process.exitCode = 1;
  })
  .finally(() => {
    stopDevServer();
  });
