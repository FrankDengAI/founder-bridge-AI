"use client";

import { Link } from "@/i18n/navigation";
import { useProtectedNav } from "@/lib/hooks/useProtectedNav";

type Props = {
  href: string;
  reason?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export function AuthLoginLink({ href, reason, className, children, onClick }: Props) {
  const { authed, guardNav } = useProtectedNav();

  if (authed) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClick?.();
        guardNav(href, reason);
      }}
    >
      {children}
    </button>
  );
}
