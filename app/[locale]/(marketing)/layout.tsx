import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Syne } from "next/font/google";
import { getTranslations } from "next-intl/server";
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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("marketing.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 ${syne.variable} ${dmSans.variable} ${jetbrains.variable} font-sans`}
    >
      <MarketingMotionConfig>
        <WebAurora />
        <div className="relative z-10 min-h-screen">{children}</div>
      </MarketingMotionConfig>
    </div>
  );
}
