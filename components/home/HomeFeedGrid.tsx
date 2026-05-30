"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useViewModeOptional } from "@/components/view-mode/ViewModeProvider";

export function HomeFeedGrid({ children }: { children: React.ReactNode }) {
  const viewMode = useViewModeOptional();
  const isWeb = viewMode?.isWeb ?? false;

  return (
    <motion.div
      initial={isWeb ? { opacity: 0 } : false}
      animate={isWeb ? { opacity: 1 } : undefined}
      transition={{ duration: 0.5, delay: 0.15 }}
      className={clsx(
        "gap-2 space-y-2 [column-fill:_balance]",
        isWeb ? "columns-2 md:columns-3 lg:columns-3 xl:columns-4" : "columns-2",
      )}
    >
      {children}
    </motion.div>
  );
}
