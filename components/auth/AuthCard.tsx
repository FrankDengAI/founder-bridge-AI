import clsx from "clsx";

export function AuthCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-[1.25rem] border border-zinc-200/90 bg-white/95 p-6 text-zinc-900 shadow-[0_24px_64px_-24px_rgba(15,23,42,0.16)] backdrop-blur-sm [color-scheme:light] sm:rounded-[1.5rem] sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
