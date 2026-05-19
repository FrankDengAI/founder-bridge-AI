import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Syne } from "next/font/google";
import { MarketingMotionConfig } from "@/components/MarketingMotionConfig";
import { WebAurora } from "@/components/WebAurora";

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
    "连接创始人、创作者与增长伙伴。品牌站与 App 演示已合并为同一站点。",
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`dark min-h-screen bg-ink-950 text-slate-100 ${syne.variable} ${dmSans.variable} ${jetbrains.variable} font-sans`}
    >
      <MarketingMotionConfig>
        <WebAurora />
        <div className="relative z-10 min-h-screen">{children}</div>
      </MarketingMotionConfig>
    </div>
  );
}
