#!/usr/bin/env node
/**
 * Scans app/ and components/ for hardcoded CJK in user-visible JSX.
 * Whitelist: comments, VibeCoding brand, // i18n-ok lines, admin/demo paths.
 */
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const ROOT = join(import.meta.dirname, "..");
const SCAN_DIRS = ["app", "components"];
const CJK = /[\u4e00-\u9fff\u3400-\u4dbf]/;
const SKIP_PATH_PARTS = [
  "/admin/demo/",
  "/demo/product/",
  "scripts/",
  "node_modules/",
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const rel = relative(ROOT, p).replace(/\\/g, "/");
    if (SKIP_PATH_PARTS.some((s) => rel.includes(s))) continue;
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith(".tsx")) out.push(p);
  }
  return out;
}

function isWhitelistedLine(line) {
  const t = line.trim();
  if (!t || t.startsWith("//") || t.startsWith("*") || t.startsWith("/**") || t.startsWith("{/*"))
    return true;
  if (t.includes("i18n-ok")) return true;
  if (/import\s/.test(t)) return true;
  if (/console\.(log|warn|error)/.test(t)) return true;
  if (/throw new Error/.test(t)) return true;
  if (/replace\s*\(\s*\/\[/.test(t)) return true;
  if (/SESSION_SECRET\|数据库/.test(t)) return true;
  if (/CATEGORY_IDS|TAG_DICTIONARY/.test(t)) return true;
  return false;
}

function scanFile(filePath) {
  const rel = relative(ROOT, filePath).replace(/\\/g, "/");
  const lines = readFileSync(filePath, "utf8").split("\n");
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!CJK.test(line)) continue;
    if (isWhitelistedLine(line)) continue;
    hits.push({ line: i + 1, text: line.trim().slice(0, 120) });
  }
  return hits.length ? { rel, hits } : null;
}

const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)));
const results = files.map(scanFile).filter(Boolean);

if (results.length === 0) {
  console.log("check-i18n: OK — no hardcoded CJK in scanned TSX files.");
  process.exit(0);
}

console.error(`check-i18n: found hardcoded Chinese in ${results.length} file(s):\n`);
for (const { rel, hits } of results) {
  console.error(`\n${rel}`);
  for (const h of hits.slice(0, 8)) {
    console.error(`  L${h.line}: ${h.text}`);
  }
  if (hits.length > 8) console.error(`  … and ${hits.length - 8} more`);
}
process.exit(1);
