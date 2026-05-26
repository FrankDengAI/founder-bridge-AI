import type { Metadata } from "next";
import { WelcomeShell } from "./WelcomeShell";

export const metadata: Metadata = {
  title: "欢迎 · VibeCoding",
};

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WelcomeShell>{children}</WelcomeShell>;
}
