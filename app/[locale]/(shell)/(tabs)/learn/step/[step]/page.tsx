import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { LEARN_STEPS } from "@/lib/learnSteps";

type Props = { params: { step: string } };

export default function LearnStepPage({ params }: Props) {
  const n = Number(params.step);
  if (!Number.isFinite(n) || n < 1 || n > LEARN_STEPS.length) notFound();
  const idx = n - 1;
  const s = LEARN_STEPS[idx];

  return (
    <div className="space-y-4 pb-10">
      <PageHeader
        title={`第 ${n} 步 · ${s.title}`}
        subtitle={s.summary}
        backHref="/home"
      />

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <p className="text-xs font-semibold text-brand-900">行动清单</p>
        <ul className="mt-3 space-y-2">
          {s.checklist.map((c) => (
            <li
              key={c}
              className="flex gap-2 rounded-2xl bg-white/70 px-3 py-2 text-sm text-zinc-800 ring-1 ring-zinc-200/70"
            >
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-brand-600 to-fuchsia-600" />
              <span className="leading-relaxed">{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {n > 1 ? (
          <Link
            href={`/learn/step/${n - 1}`}
            className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-zinc-50"
          >
            上一步
          </Link>
        ) : (
          <span />
        )}
        {n < LEARN_STEPS.length ? (
          <Link
            href={`/learn/step/${n + 1}`}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-glow"
          >
            下一步
          </Link>
        ) : (
          <Link
            href="/publish"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
          >
            去发布第一条笔记
          </Link>
        )}
      </div>
    </div>
  );
}
