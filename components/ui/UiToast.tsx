"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  message: string | null;
  className?: string;
};

export function UiToast({ message, className }: Props) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 2200);
    return () => window.clearTimeout(t);
  }, [message]);

  return (
    <AnimatePresence>
      {visible && message ? (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className={clsx(
            "pointer-events-none fixed bottom-24 left-1/2 z-[60] max-w-[90vw] -translate-x-1/2 rounded-2xl bg-white/95 px-4 py-2.5 text-center text-xs font-medium text-zinc-900 shadow-lg ring-1 ring-zinc-200/80 backdrop-blur-md sm:bottom-8",
            className,
          )}
          role="status"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
