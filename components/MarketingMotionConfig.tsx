"use client";

import { MotionConfig } from "framer-motion";

/**
 * 品牌站动效：关闭全局 initial 入场动画，避免 SSR 与客户端首屏 DOM/样式不一致导致 hydration 报错。
 * whileInView 等滚动动效仍可在客户端正常工作。
 */
export function MarketingMotionConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig initial={false}>{children}</MotionConfig>;
}
