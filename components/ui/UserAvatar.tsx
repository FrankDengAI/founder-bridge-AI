"use client";

import Image from "next/image";
import clsx from "clsx";
import {
  getAvatarStyle,
  getInitials,
  shapeClassName,
} from "@/lib/avatarFallback";

type Props = {
  userId: string;
  displayName?: string;
  avatarUrl?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
};

const SIZE_MAP = {
  xs: { box: "h-8 w-8", text: "text-sm", img: 32 },
  sm: { box: "h-10 w-10", text: "text-base", img: 40 },
  md: { box: "h-14 w-14", text: "text-xl", img: 56 },
  lg: { box: "h-16 w-16", text: "text-2xl", img: 64 },
  xl: { box: "h-20 w-20", text: "text-3xl", img: 80 },
} as const;

export function UserAvatar({
  userId,
  displayName = "",
  avatarUrl,
  size = "sm",
  className,
}: Props) {
  const dim = SIZE_MAP[size];
  const url = avatarUrl?.trim();

  if (url) {
    return (
      <div
        className={clsx(
          "relative shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/80",
          dim.box,
          className,
        )}
      >
        <Image
          src={url}
          alt={displayName || "avatar"}
          width={dim.img}
          height={dim.img}
          className="h-full w-full object-cover"
          unoptimized={url.startsWith("http") && !url.includes("localhost")}
        />
      </div>
    );
  }

  const style = getAvatarStyle(userId);
  const shape = shapeClassName(style.shape);

  return (
    <div
      className={clsx(
        "relative flex shrink-0 items-center justify-center ring-1 ring-white/80",
        dim.box,
        shape,
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${style.bgFrom}, ${style.bgTo})`,
      }}
      aria-hidden={!displayName}
      title={displayName || undefined}
    >
      <span className={clsx("select-none leading-none", dim.text)}>
        {style.emoji}
      </span>
      <span className="sr-only">{getInitials(displayName)}</span>
    </div>
  );
}
