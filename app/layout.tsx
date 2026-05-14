import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Syne } from "next/font/google";
import { WebAurora } from "@/components/WebAurora";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VibeCoding — 创业社交 · 网页端",
  description:
    "连接创始人、创作者与增长伙伴。网页端品牌站：更沉浸的视觉与产品叙事；完整交互演示请使用小程序/App 壳端。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable} font-sans min-h-screen`}
      >
        <WebAurora />
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
