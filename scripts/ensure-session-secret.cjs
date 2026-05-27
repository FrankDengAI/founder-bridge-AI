/**
 * 生产环境缺少 SESSION_SECRET 时自动生成临时密钥，避免登录 API 直接 503。
 * 固定密钥仍应在 Render Dashboard → Environment 配置，否则每次重启会使全员掉线。
 */
const crypto = require("node:crypto");

function ensureSessionSecret() {
  const s = (process.env.SESSION_SECRET || "").trim();
  if (s.length >= 16) return false;

  process.env.SESSION_SECRET = crypto.randomBytes(32).toString("hex");
  console.warn("[session-secret] SESSION_SECRET 未设置或过短，已自动生成临时密钥。");
  console.warn(
    "[session-secret] 请在 Render Dashboard → Environment 添加固定 SESSION_SECRET（≥16 位）后重新部署。",
  );
  return true;
}

module.exports = { ensureSessionSecret };

if (require.main === module) {
  ensureSessionSecret();
}
