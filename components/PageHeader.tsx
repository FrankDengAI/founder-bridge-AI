import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  backHref?: string;
  right?: React.ReactNode;
};

export function PageHeader({ title, subtitle, backHref, right }: Props) {
  return (
    <header className="glass-panel flex items-start justify-between gap-3 rounded-shell border border-white/50 bg-grad-header px-4 py-3 shadow-panel dark:border-zinc-800/80">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex h-8 w-8 items-center justify-center rounded-panel bg-white/70 text-zinc-700 ring-1 ring-zinc-200/80 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="返回"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : null}
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">
              VibeCoding
            </p>
            <h1 className="truncate text-base font-semibold text-zinc-900">{title}</h1>
          </div>
        </div>
        {subtitle ? (
          <p className="mt-1 pl-0 text-xs leading-relaxed text-zinc-600 sm:pl-10">
            {subtitle}
          </p>
        ) : null}
      </div>
      {right ? <div className="shrink-0 pt-1">{right}</div> : null}
    </header>
  );
}
