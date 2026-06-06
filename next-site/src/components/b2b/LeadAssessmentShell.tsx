"use client";

import { LeadAssessmentProvider } from "@/components/b2b/LeadAssessmentContext";
import { LeadAssessmentModal } from "@/components/b2b/LeadAssessmentModal";

export function LeadAssessmentShell({ children }: { children: React.ReactNode }) {
  return (
    <LeadAssessmentProvider>
      {children}
      <LeadAssessmentModal />
    </LeadAssessmentProvider>
  );
}
