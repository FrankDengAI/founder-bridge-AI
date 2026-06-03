#!/usr/bin/env node
/**
 * README checks for GitHub rendering (anchors, mermaid, assets).
 */
import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const mdPath = path.join(root, "README.md");
const md = fs.readFileSync(mdPath, "utf8");

/** GitHub-compatible heading slug (GFM, CJK preserved). */
function githubSlug(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const headers = [];
for (const m of md.matchAll(/^(#{1,6})\s+(.+)$/gm)) {
  const title = m[2].trim();
  headers.push({ level: m[1].length, title, slug: githubSlug(title) });
}

const slugSet = new Set(headers.map((h) => h.slug));
const slugCounts = {};
for (const h of headers) slugCounts[h.slug] = (slugCounts[h.slug] || 0) + 1;

const dupes = Object.entries(slugCounts).filter(([, c]) => c > 1);
console.log("=== Duplicate heading slugs ===");
if (dupes.length) dupes.forEach(([s, c]) => console.log(`  ${s} (${c}x)`));
else console.log("  none");

const links = [...md.matchAll(/\]\(#([^)]+)\)/g)].map((m) => m[1]);
const broken = [...new Set(links.filter((id) => !slugSet.has(id)))];
console.log("\n=== Broken internal # links ===");
if (broken.length) broken.forEach((b) => console.log(`  #${b}`));
else console.log(`  none (${links.length} links checked)`);

// Suggest fixes for broken
if (broken.length) {
  console.log("\n=== Closest slug matches ===");
  for (const b of broken) {
    const partial = headers
      .map((h) => h.slug)
      .filter((s) => s.includes(b.slice(0, 4)) || b.includes(s.slice(0, 4)));
    console.log(`  #${b} ->`, partial.slice(0, 3).join(", ") || "(no guess)");
  }
}

console.log("\n=== Mermaid blocks ===");
const blocks = [...md.matchAll(/```mermaid\n([\s\S]*?)```/g)];
let mermaidIssues = 0;
blocks.forEach((m, i) => {
  const body = m[1];
  const n = i + 1;
  body.split("\n").forEach((line, ln) => {
    // % starts comment unless inside quotes — heuristic
    if (/^[^"]*%/.test(line.trim()) && !line.trim().startsWith("%%")) {
      console.log(`  block ${n} L${ln + 1}: % comment risk: ${line.trim().slice(0, 70)}`);
      mermaidIssues++;
    }
  });
  if (/%%\{init/.test(body)) {
    console.log(`  block ${n}: contains %%{init}`);
    mermaidIssues++;
  }
  // subgraph id API without quotes can clash in some parsers
  if (/^\s*subgraph\s+API\s/m.test(body)) {
    console.log(`  block ${n}: subgraph id 'API' may clash — use quoted id`);
    mermaidIssues++;
  }
});
if (!mermaidIssues) console.log(`  ${blocks.length} blocks, no obvious issues`);

console.log("\n=== Images ===");
const mdImgs = [...md.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1]);
const htmlImgs = [...md.matchAll(/<img[^>]+src=["']([^"']+)["']/g)].map((m) => m[1]);
const imgs = [...mdImgs, ...htmlImgs];
const missing = imgs.filter((src) => {
  if (src.startsWith("http")) return false;
  const p = path.join(root, src.replace(/^\.\//, ""));
  return !fs.existsSync(p);
});
if (missing.length) {
  console.log(`  WARN: ${missing.length} missing (README will show broken images on GitHub):`);
  missing.slice(0, 8).forEach((p) => console.log(`    ${p}`));
  if (missing.length > 8) console.log(`    ... and ${missing.length - 8} more`);
} else console.log(`  all ${imgs.length} local images exist`);

console.log("\n=== HTML tags ===");
const detailsOpen = (md.match(/<details>/g) || []).length;
const detailsClose = (md.match(/<\/details>/g) || []).length;
console.log(
  `  details: ${detailsOpen} open, ${detailsClose} close`,
  detailsOpen === detailsClose ? "OK" : "MISMATCH",
);

// Fence parity (only lines that are exactly ```)
const fenceLines = md.split("\n").filter((l) => /^```/.test(l.trim()));
const ok = fenceLines.length % 2 === 0;
console.log("\n=== Code fences ===");
console.log(`  ${fenceLines.length} fence lines`, ok ? "OK" : "ODD — unclosed block");

// Missing screenshots are a warning only (generated via npm run docs:assets)
process.exit(broken.length || !ok || dupes.length ? 1 : 0);
