/**
 * 生成 README 截图与 GIF：npm run docs:assets
 * 首次请先：npm run docs:assets:install（或使用本机 Chrome / Edge，脚本会自动检测）
 *
 * 可选参数：
 *   --only=png|gif|marketing|app   仅生成部分资源
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
const MAX_GIF_KB = 1500;
const MAX_PNG_KB = 400;

const ONLY = (() => {
  const arg = process.argv.find((a) => a.startsWith("--only="));
  return arg ? arg.split("=")[1] : "all";
})();

dotenv.config({ path: path.join(ROOT, ".env") });
dotenv.config({ path: path.join(ROOT, ".env.local"), override: true });

const HAS_DB = Boolean(process.env.DATABASE_URL?.trim());

/** @type {import("node:child_process").ChildProcess | null} */
let devProc = null;
let startedDev = false;

/** @type {{ file: string; bytes: number; kind: string }[]} */
const manifest = [];

function log(msg) {
  console.log(`[docs:assets] ${msg}`);
}

function shouldRun(kind) {
  if (ONLY === "all") return true;
  if (ONLY === kind) return true;
  if (ONLY === "png" && kind === "png") return true;
  if (ONLY === "gif" && kind === "gif") return true;
  if (ONLY === "marketing" && kind === "png-marketing") return true;
  if (ONLY === "app" && (kind === "png-app" || kind === "gif")) return true;
  return false;
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
  if (!ok) throw new Error(`dev server did not become healthy at ${BASE_URL}`);
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
  log("running db:seed…");
  spawnSync("npm", ["run", "db:seed"], {
    cwd: ROOT,
    shell: true,
    stdio: "inherit",
    env: process.env,
  });
}

async function loginViaApi() {
  const host = new URL(BASE_URL).hostname;

  async function tryLoginBody(body) {
    const login = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!login.ok) return null;
    const cookies = [];
    const raw = login.headers.getSetCookie?.() ?? [];
    const singles = raw.length ? raw : [login.headers.get("set-cookie")].filter(Boolean);
    for (const line of singles) {
      const parsed = parseSetCookieHeader(line);
      if (parsed) cookies.push({ name: parsed.name, value: parsed.value, domain: host, path: "/" });
    }
    return cookies.length ? cookies : null;
  }

  const demo = await tryLoginBody({ userId: "user_demo_vibe", demoMode: true, password: "demo" });
  if (demo) {
    log("logged in as seed demo user");
    return demo;
  }

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

  const cookies = await tryLoginBody({ username, password });
  if (!cookies) throw new Error("login failed after register");
  log("logged in via fresh docs account");
  return cookies;
}

function trackManifest(filename, kind) {
  const out = path.join(OUT_DIR, filename);
  const bytes = fs.statSync(out).size;
  manifest.push({ file: filename, bytes, kind });
  const kb = Math.round(bytes / 1024);
  const warn = kind === "gif" && kb > MAX_GIF_KB ? " (large)" : kind === "png" && kb > MAX_PNG_KB ? " (large)" : "";
  log(`saved ${filename} (${kb} KB${warn})`);
}

async function savePng(buffer, filename, opts = {}) {
  const { cropHeight, maxWidth = 1280 } = opts;
  let img = sharp(buffer);
  const meta = await img.metadata();
  if (cropHeight && meta.height && meta.height > cropHeight) {
    img = img.extract({ left: 0, top: 0, width: meta.width, height: cropHeight });
  }
  img = img
    .resize({ width: maxWidth, withoutEnlargement: true })
    .png({ quality: 80, compressionLevel: 9, palette: true });
  const out = path.join(OUT_DIR, filename);
  await img.toFile(out);
  trackManifest(filename, "png");
}

async function gotoPage(page, url, waitMs = 1500) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForTimeout(waitMs);
}

async function scrollToSection(page, sectionId, waitMs = 1200) {
  await gotoPage(page, `${BASE_URL}/`, 800);
  const section = page.locator(`#${sectionId}`);
  await section.scrollIntoViewIfNeeded({ timeout: 15_000 });
  await page.waitForTimeout(waitMs);
}

async function captureScreenshot(page, filename, opts = {}) {
  const { url, waitMs = 1500, fullPage = false, clip } = opts;
  if (url) await gotoPage(page, url, waitMs);
  const buffer = await page.screenshot({ type: "png", fullPage, clip });
  await savePng(buffer, filename, opts);
}

async function captureSection(page, sectionId, filename, waitMs = 1500) {
  await scrollToSection(page, sectionId, waitMs);
  const section = page.locator(`#${sectionId}`);
  const buffer = await section.screenshot({ type: "png" });
  await savePng(buffer, filename, { maxWidth: 1280 });
}

async function framesToGif(frames, filename, { width = 420, delay = 150, quality = 12 } = {}) {
  if (!frames.length) throw new Error("no frames for gif");

  const firstMeta = await sharp(frames[0]).metadata();
  const scale = width / (firstMeta.width || width);
  const height = Math.round((firstMeta.height || 900) * scale);

  const encoder = new GIFEncoder(width, height);
  encoder.setDelay(delay);
  encoder.setRepeat(0);
  encoder.setQuality(quality);
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
  trackManifest(filename, "gif");
}

async function captureGif(page, filename, recordFn, opts = {}) {
  let { frameCount = 20, intervalMs = 150, width = 420 } = opts;
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

  const out = path.join(OUT_DIR, filename);
  let kb = fs.statSync(out).size / 1024;
  if (kb > MAX_GIF_KB) {
    log(`optimizing ${filename} (${Math.round(kb)} KB → target ≤${MAX_GIF_KB} KB)`);
    const sparse = frames.filter((_, i) => i % 2 === 0);
    width = Math.round(width * 0.85);
    await framesToGif(sparse, filename, { width, delay: intervalMs + 30, quality: 18 });
  }
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
    colorScheme: "light",
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
  return { browser, page };
}

async function captureMarketing(page) {
  await captureScreenshot(page, "hero-cover.png", {
    url: `${BASE_URL}/`,
    waitMs: 2800,
    cropHeight: 1280,
  });

  await captureSection(page, "features", "marketing-bento.png", 1800);
  await captureSection(page, "match", "marketing-match-radar.png", 2000);
  await captureSection(page, "pulse", "marketing-pulse.png", 2000);
}

async function triggerMatchResults(page) {
  await gotoPage(page, `${BASE_URL}/match`, 1800);
  const matchBtn = page.getByRole("button", { name: /开始匹配|保存画像并开始匹配/ }).first();
  if (await matchBtn.isVisible().catch(() => false)) {
    await matchBtn.click();
    await page.waitForTimeout(4500);
  }
  const expandBtn = page.locator('[class*="rounded-3xl"]').getByRole("button").first();
  if (await expandBtn.isVisible().catch(() => false)) {
    await expandBtn.click().catch(() => {});
    await page.waitForTimeout(600);
  }
}

async function captureAppPages(page) {
  const pages = [
    { file: "app-home-feed.png", url: `${BASE_URL}/home`, waitMs: 2500 },
    { file: "app-tools-market.png", url: `${BASE_URL}/tools`, waitMs: 2000 },
    { file: "app-workspace.png", url: `${BASE_URL}/workspace`, waitMs: 2000 },
    { file: "app-models-rank.png", url: `${BASE_URL}/models`, waitMs: 2000 },
    { file: "app-messages.png", url: `${BASE_URL}/messages`, waitMs: 2000 },
    { file: "app-learn.png", url: `${BASE_URL}/learn`, waitMs: 2000 },
    { file: "app-publish.png", url: `${BASE_URL}/publish`, waitMs: 2000 },
  ];
  for (const p of pages) {
    await captureScreenshot(page, p.file, { url: p.url, waitMs: p.waitMs });
  }

  await triggerMatchResults(page);
  await savePng(await page.screenshot({ type: "png" }), "app-match-results.png");

  if (!(await page.locator("text=匹配分").first().isVisible().catch(() => false))) {
    log("match sparse — fallback #match section");
    await captureSection(page, "match", "app-match-results.png", 1500);
  }
}

async function captureGifs(page) {
  const gifOpts = { frameCount: 20, intervalMs: 150, width: 420 };

  await gotoPage(page, `${BASE_URL}/home`, 1200);
  await captureGif(
    page,
    "demo-locale-switch.gif",
    async () => {
      const enBtn = page.getByRole("button", { name: "EN" }).first();
      await enBtn.waitFor({ state: "visible", timeout: 10_000 });
      await sleep(300);
      await enBtn.click();
      await sleep(1000);
      const zhBtn = page.getByRole("button", { name: /中文|ZH/ }).first();
      if (await zhBtn.isVisible().catch(() => false)) await zhBtn.click();
    },
    gifOpts,
  );

  await gotoPage(page, `${BASE_URL}/home`, 800);
  await captureGif(
    page,
    "demo-command-palette.gif",
    async () => {
      await page.keyboard.press("Control+KeyK");
      await page.waitForTimeout(350);
      await page.keyboard.type("匹配");
      await page.waitForTimeout(1400);
    },
    gifOpts,
  );

  await gotoPage(page, `${BASE_URL}/match`, 1000);
  await captureGif(
    page,
    "demo-match-flow.gif",
    async () => {
      const btn = page.getByRole("button", { name: /开始匹配|保存画像并开始匹配/ }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        await sleep(4000);
      }
    },
    { ...gifOpts, frameCount: 24 },
  );

  await gotoPage(page, `${BASE_URL}/home`, 1000);
  await captureGif(
    page,
    "demo-feed-scroll.gif",
    async () => {
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollBy({ top: 480, behavior: "smooth" }));
        await sleep(850);
      }
    },
    gifOpts,
  );
}

function writeManifest() {
  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    count: manifest.length,
    totalBytes: manifest.reduce((s, m) => s + m.bytes, 0),
    assets: manifest.sort((a, b) => a.file.localeCompare(b.file)),
  };
  fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(payload, null, 2));
  log(`manifest.json — ${manifest.length} assets, ${Math.round(payload.totalBytes / 1024)} KB total`);
}

async function main() {
  ensureOutDir();
  log(`output → ${OUT_DIR} (only=${ONLY})`);

  await startDevServerIfNeeded();

  if (HAS_DB) await ensureSeedData();
  else log("WARN: no DATABASE_URL — marketing PNG only");

  let cookies = [];
  if (HAS_DB) {
    try {
      cookies = await loginViaApi();
    } catch (e) {
      log(`WARN: login failed — ${e instanceof Error ? e.message : e}`);
    }
  }

  const { browser, page } = await setupBrowser(cookies);
  try {
    if (shouldRun("png-marketing") || shouldRun("png")) {
      await captureMarketing(page);
    }

    if (HAS_DB && cookies.length) {
      if (shouldRun("png-app") || shouldRun("png")) {
        await captureAppPages(page);
      }
      if (shouldRun("gif")) {
        await captureGifs(page);
      }
    }
  } finally {
    await browser.close();
  }

  writeManifest();

  const files = fs.readdirSync(OUT_DIR).filter((f) => /\.(png|gif)$/i.test(f));
  log(`done — ${files.length} assets`);
  if (files.length < 5 && ONLY === "all") {
    log("WARN: few assets; check DATABASE_URL");
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
