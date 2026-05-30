"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type Props = {
  title?: string;
  /** 模块服务宗旨 —— 告诉用户「为什么这块在这里」 */
  purpose?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** 右栏 stagger 入场序号 */
  index?: number;
};

export function RailPanel({ title, purpose, icon, children, className, index = 0 }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        "web-panel group rounded-2xl p-4 shadow-sm transition duration-300 hover:border-violet-300/70 hover:shadow-md",
        className,
      )}
    >
      {title ? (
        <div className="mb-3">
          <div className="flex items-center gap-2">
            {icon}
            <p className="text-sm font-bold text-zinc-900">{title}</p>
          </div>
          {purpose ? (
            <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">{purpose}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </motion.section>
  );
}

export function RailSkeleton({ className, index = 0 }: { className?: string; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.07 }}
      className={clsx("web-panel h-36 animate-pulse rounded-2xl bg-zinc-100/80", className)}
    />
  );
}
