"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type LeadAssessmentContextValue = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const LeadAssessmentContext = createContext<LeadAssessmentContextValue | null>(
  null,
);

export function LeadAssessmentProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ open, close, isOpen }),
    [open, close, isOpen],
  );

  return (
    <LeadAssessmentContext.Provider value={value}>
      {children}
    </LeadAssessmentContext.Provider>
  );
}

export function useLeadAssessment() {
  const ctx = useContext(LeadAssessmentContext);
  if (!ctx) {
    throw new Error("useLeadAssessment must be used within LeadAssessmentProvider");
  }
  return ctx;
}

/** Safe hook for optional provider (e.g. backoffice without modal) */
export function useLeadAssessmentOptional() {
  return useContext(LeadAssessmentContext);
}
