"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { readLearnStepsDone } from "@/lib/appHub";
import { LEARN_STEPS } from "@/lib/learnSteps";

export function useLearnProgress() {
  const [done, setDone] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/learn/progress");
      const data = (await res.json()) as { steps: number[]; anonymous?: boolean };
      if (data.anonymous) {
        setDone(readLearnStepsDone());
      } else {
        setDone(new Set(data.steps));
      }
    } catch {
      setDone(readLearnStepsDone());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const nextStep = useMemo(() => {
    for (let i = 1; i <= LEARN_STEPS.length; i++) {
      if (!done.has(i)) return i;
    }
    return LEARN_STEPS.length;
  }, [done]);

  const pct = Math.round((done.size / LEARN_STEPS.length) * 100);
  const complete = done.size >= LEARN_STEPS.length;

  return { done, loading, nextStep, pct, complete, stepCount: LEARN_STEPS.length };
}
