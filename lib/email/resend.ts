import { Resend } from "resend";
import { appBaseUrl } from "@/lib/auth/config";

function getResend() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

function emailFrom(): string {
  return process.env.EMAIL_FROM?.trim() || "VibeCoding <onboarding@resend.dev>";
}

export async function sendVerificationEmail(to: string, rawToken: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set; verification link:", `${appBaseUrl()}/welcome/verify-email?token=${rawToken}`);
    return false;
  }
  const link = `${appBaseUrl()}/welcome/verify-email?token=${encodeURIComponent(rawToken)}`;
  const { error } = await resend.emails.send({
    from: emailFrom(),
    to,
    subject: "验证你的 VibeCoding 邮箱",
    html: `<p>欢迎加入 VibeCoding！</p><p><a href="${link}">点击验证邮箱</a></p><p>链接 24 小时内有效。</p>`,
  });
  if (error) {
    console.error("[email] verification failed", error);
    return false;
  }
  return true;
}

export async function sendPasswordResetEmail(to: string, rawToken: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set; reset link:", `${appBaseUrl()}/welcome/reset-password?token=${rawToken}`);
    return false;
  }
  const link = `${appBaseUrl()}/welcome/reset-password?token=${encodeURIComponent(rawToken)}`;
  const { error } = await resend.emails.send({
    from: emailFrom(),
    to,
    subject: "重置 VibeCoding 密码",
    html: `<p>你申请了密码重置。</p><p><a href="${link}">设置新密码</a></p><p>链接 1 小时内有效。如非本人操作请忽略。</p>`,
  });
  if (error) {
    console.error("[email] reset failed", error);
    return false;
  }
  return true;
}
