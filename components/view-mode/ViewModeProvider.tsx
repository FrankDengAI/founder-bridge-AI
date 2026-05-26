"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getViewMode,
  setViewMode as persistViewMode,
  type ViewMode,
} from "@/lib/viewMode";

type ViewModeContextValue = {
  mode: ViewMode | null;
  ready: boolean;
  setMode: (mode: ViewMode) => void;
  isWeb: boolean;
  isApp: boolean;
};

const ViewModeContext = createContext<ViewModeContextValue | null>(null);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ViewMode | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setModeState(getViewMode());
    setReady(true);
  }, []);

  const setMode = useCallback((next: ViewMode) => {
    persistViewMode(next);
    setModeState(next);
  }, []);

  const value = useMemo(
    () => ({
      mode,
      ready,
      setMode,
      isWeb: mode === "web",
      isApp: mode === "app",
    }),
    [mode, ready, setMode],
  );

  return (
    <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const ctx = useContext(ViewModeContext);
  if (!ctx) {
    throw new Error("useViewMode must be used within ViewModeProvider");
  }
  return ctx;
}

export function useViewModeOptional() {
  return useContext(ViewModeContext);
}
