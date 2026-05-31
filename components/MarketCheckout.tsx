"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ShieldCheck, Truck } from "lucide-react";
import clsx from "clsx";

type Props = {
  title: string;
  priceLabel: string;
  itemType: string;
  marketId?: string;
};

const STEP_KEYS = [
  "stepConfirmProduct",
  "stepConfirmOrder",
  "stepPayment",
  "stepComplete",
] as const;

export function MarketCheckout({ title, priceLabel, itemType, marketId }: Props) {
  const t = useTranslations("checkout");
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const orderSent = useRef(false);

  const canNext = useMemo(() => step < STEP_KEYS.length - 1, [step]);

  const next = () => {
    if (!canNext) return;
    const s = step + 1;
    setStep(s);
    if (s === STEP_KEYS.length - 1) {
      setToast(t("paymentSuccess"));
      window.setTimeout(() => setToast(null), 2400);
    }
  };

  useEffect(() => {
    if (step !== STEP_KEYS.length - 1 || !marketId || orderSent.current) return;
    orderSent.current = true;
    void (async () => {
      try {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ marketId }),
        });
      } catch {
        /* ignore */
      }
    })();
  }, [step, marketId]);

  return (
    <div className="space-y-3">
      <div className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-center justify-between gap-2">
          {STEP_KEYS.map((key, i) => (
            <div key={key} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={clsx(
                  "flex h-9 w-9 items-center justify-center rounded-2xl text-[11px] font-bold ring-1",
                  i === step
                    ? "bg-brand-600 text-white ring-brand-500"
                    : i < step
                      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                      : "bg-white text-zinc-500 ring-zinc-200",
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-center text-[10px] font-semibold text-zinc-600">{t(key)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        {step === 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-zinc-950">{title}</p>
            <p className="text-xs text-zinc-600">{t("typeLabel", { type: itemType })}</p>
            <p className="text-lg font-bold text-brand-900">{priceLabel}</p>
            <p className="text-xs leading-relaxed text-zinc-600">{t("demoHint")}</p>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-2 text-sm text-zinc-700">
            <div className="flex items-start gap-2 rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200/70">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-700" />
              <div>
                <p className="font-semibold text-zinc-950">{t("serviceTitle")}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600">{t("serviceDesc")}</p>
              </div>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-2 text-sm text-zinc-700">
            <div className="flex items-start gap-2 rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200/70">
              <Truck className="mt-0.5 h-5 w-5 text-sky-700" />
              <div>
                <p className="font-semibold text-zinc-950">{t("paymentTitle")}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600">{t("paymentDesc")}</p>
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-brand-50 p-4 ring-1 ring-emerald-200/60">
            <p className="text-sm font-semibold text-emerald-950">{t("completeTitle")}</p>
            <p className="mt-2 text-xs leading-relaxed text-emerald-900">{t("completeDesc")}</p>
          </div>
        ) : null}

        {step < STEP_KEYS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-brand-600 to-fuchsia-600 py-3 text-sm font-semibold text-white shadow-glow"
          >
            {t("continue")}
          </button>
        ) : (
          <Link
            href="/orders"
            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-zinc-950 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            {t("viewOrders")}
          </Link>
        )}
      </div>

      {toast ? (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-zinc-950 px-4 py-2 text-xs text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
