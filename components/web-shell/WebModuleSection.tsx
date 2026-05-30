"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type Props = {
  title: string;
  purpose: string;
  children: React.ReactNode;
  className?: string;
  /** 侧栏等窄区域用更紧凑的标题 */
  compact?: boolean;
  delay?: number;
};

export function WebModuleSection({
  title,
  purpose,
  children,
  className,
  compact = false,
  delay = 0,
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={clsx("web-module-section", className)}
    >
      <header className={clsx(compact ? "mb-3" : "mb-4")}>
        <div className="flex items-center gap-2">
          <span className="pulse-dot text-emerald-500" aria-hidden />
          <h2
            className={clsx(
              "font-bold tracking-tight text-zinc-900",
              compact ? "text-sm" : "text-base lg:text-lg",
            )}
          >
            {title}
          </h2>
        </div>
        <p
          className={clsx(
            "mt-1.5 leading-relaxed text-zinc-500",
            compact ? "text-[11px]" : "max-w-2xl text-xs",
          )}
        >
          {purpose}
        </p>
      </header>
      {children}
    </motion.section>
  );
}
