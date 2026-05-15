import type { Metadata } from "next";
import { LoginBridge } from "@/components/auth/LoginBridge";

export const metadata: Metadata = {
  title: "登录 · VibeCoding",
  description: "通过嵌入演示完成登录，会话与数据在同一站点的 App 区（PostgreSQL）。",
};

export default function LoginPage() {
  return <LoginBridge />;
}
