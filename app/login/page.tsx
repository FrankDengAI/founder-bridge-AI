import type { Metadata } from "next";
import { LoginBridge } from "@/components/auth/LoginBridge";

export const metadata: Metadata = {
  title: "登录 · VibeCoding 网页端",
  description: "通过嵌入演示 App 完成登录，会话与数据在 App 端（SQLite）。",
};

export default function LoginPage() {
  return <LoginBridge />;
}
