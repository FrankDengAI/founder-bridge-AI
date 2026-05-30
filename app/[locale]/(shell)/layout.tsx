import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppShell } from "@/components/AppShell";
import clsx from "clsx";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "VibeCoding 创业社交",
  description: "学习、展示、工具与创业伙伴匹配",
};

export default function ShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={clsx(
        "app-shell-scope mesh-bg mesh-bg-animate min-h-screen text-slate-900",
        geistSans.variable,
        geistMono.variable,
      )}
    >
      {children}
      <AppShell />
    </div>
  );
}
