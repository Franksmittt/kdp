"use client";

import { useLeadAssessmentOptional } from "@/components/b2b/LeadAssessmentContext";

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "header" | "turquoise" | "unstyled";
  onActivate?: () => void;
};

export function LeadAssessmentTrigger({
  children,
  className = "",
  variant = "primary",
  onActivate,
}: Props) {
  const ctx = useLeadAssessmentOptional();

  const base =
    variant === "unstyled"
      ? ""
      : variant === "header"
      ? "kgp-header__cta-secondary"
      : variant === "secondary"
        ? "kgp-hero__btn-secondary"
        : variant === "turquoise"
          ? "rounded-lg bg-turquoise px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-turquoise-dark"
          : "btn-default btn-highlighted";

  if (!ctx) {
    return (
      <a href="/contact" className={`${base} ${className}`.trim()}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={`${base} ${className}`.trim()}
      onClick={() => {
        onActivate?.();
        ctx.open();
      }}
    >
      {children}
    </button>
  );
}
