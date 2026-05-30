"use client";

import { useViewModeOptional } from "@/components/view-mode/ViewModeProvider";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  /** 侧栏窄列：单列堆叠，避免 2～3 列 grid 挤在一起 */
  variant?: "default" | "sidebar";
};

/** Web 模式：Retention 组件网格；App 模式：垂直堆叠 */
export function HomeRetentionStack({ children, variant = "default" }: Props) {
  const isWeb = useViewModeOptional()?.isWeb ?? false;

  return (
    <div
      className={clsx(
        !isWeb && "space-y-3.5",
        isWeb &&
          variant === "sidebar" &&
          "flex flex-col gap-3 [&>*]:transition [&>*]:duration-300 [&>*]:hover:-translate-y-0.5",
        isWeb && variant === "default" && "grid grid-cols-2 gap-3 xl:grid-cols-3",
      )}
    >
      {children}
    </div>
  );
}
