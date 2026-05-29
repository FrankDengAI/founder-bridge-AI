/**
 * 构建后检查：middleware 不得打包 Node.js crypto（Edge 会直接 500）。
 */
const fs = require("node:fs");
const path = require("node:path");

const middlewarePath = path.join(__dirname, "..", ".next", "server", "middleware.js");

if (!fs.existsSync(middlewarePath)) {
  console.warn("[verify-middleware-edge] skip: middleware.js not found (run next build first)");
  process.exit(0);
}

const src = fs.readFileSync(middlewarePath, "utf8");
const forbidden = [
  "createHmac",
  "node:crypto",
  "randomBytes",
  "timingSafeEqual",
  "lib/auth/sessionCookie.ts",
  "lib/auth/config.ts",
];

const hits = forbidden.filter((token) => src.includes(token));
if (hits.length) {
  console.error("[verify-middleware-edge] FAIL: middleware bundles forbidden modules:");
  for (const h of hits) console.error("  -", h);
  process.exit(1);
}

console.log("[verify-middleware-edge] OK: no Node crypto in middleware bundle");
