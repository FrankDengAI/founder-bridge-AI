/**
 * 生产环境缺少 SESSION_SECRET 时自动生成临时密钥（零配置可登录）。
 * 可选：在 Render Environment 配置固定 SESSION_SECRET，避免重启后全员掉线。
 */
const crypto = require("node:crypto");

function ensureSessionSecret() {
  const s = (process.env.SESSION_SECRET || "").trim();
  if (s.length >= 16) return false;

  process.env.SESSION_SECRET = crypto.randomBytes(32).toString("hex");
  console.warn("[session-secret] SESSION_SECRET 未设置，已自动生成（重启后需重新登录）。");
  return true;
}

module.exports = { ensureSessionSecret };

if (require.main === module) {
  ensureSessionSecret();
}
