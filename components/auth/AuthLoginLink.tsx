"use client";

import { Link } from "@/i18n/navigation";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

type Props = {
  href: string;
  reason?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export function AuthLoginLink({ href, reason, className, children, onClick }: Props) {
  const { isAuthenticated, requireAuth } = useRequireAuth();

  if (isAuthenticated) {
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
        requireAuth({ next: href, reason });
      }}
    >
      {children}
    </button>
  );
}
