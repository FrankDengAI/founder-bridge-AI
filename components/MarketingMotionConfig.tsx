"use client";

import { MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * 品牌站动效：首屏（SSR + hydration）强制 reducedMotion，避免 motion 入场样式不一致。
 * 挂载后恢复 user，保留 whileInView 等滚动动效。
 */
export function MarketingMotionConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <MotionConfig reducedMotion={mounted ? "user" : "always"}>
      {children}
    </MotionConfig>
  );
}
