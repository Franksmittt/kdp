"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLeadAssessment } from "@/components/b2b/LeadAssessmentContext";
import { BUSINESS } from "@/config/site";

type FormState = {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  scheme: string;
  message: string;
};

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  organisation: "",
  scheme: "",
  message: "",
};

export function LeadAssessmentModal() {
  const { isOpen, close } = useLeadAssessment();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
      document.body.classList.add("kgp-modal-open");
    } else {
      dialog.close();
      document.body.classList.remove("kgp-modal-open");
    }
  }, [isOpen]);

  function handleClose() {
    setSubmitted(false);
    setForm(INITIAL);
    close();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="kgp-lead-modal fixed inset-0 z-[10000] m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-charcoal/80"
      onClose={handleClose}
      aria-labelledby="lead-modal-title"
    >
      <div
        className="flex min-h-full items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div className="w-full max-w-lg rounded-2xl border border-charcoal-border bg-surface shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-charcoal-border px-6 py-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-turquoise-dark">
                B2B lead capture
              </p>
              <h2
                id="lead-modal-title"
                className="mt-1 font-display text-xl font-semibold text-ink"
              >
                Request a phased maintenance assessment
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg p-2 text-ink-muted hover:bg-surface-muted hover:text-ink"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>

          <div className="px-6 py-5">
            {!submitted ? (
              <>
                <p className="mb-5 text-sm leading-relaxed text-ink-muted">
                  Our specialized teams utilize calibrated moisture diagnostics and
                  structural analysis to deliver your tailored, phased maintenance
                  proposal — not a self-service quote.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                        Full name *
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        className="mt-1.5 w-full rounded-lg border border-charcoal-border px-3 py-2.5 text-sm text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        className="mt-1.5 w-full rounded-lg border border-charcoal-border px-3 py-2.5 text-sm text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                        className="mt-1.5 w-full rounded-lg border border-charcoal-border px-3 py-2.5 text-sm text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                        Organisation
                      </label>
                      <input
                        value={form.organisation}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, organisation: e.target.value }))
                        }
                        placeholder="Managing agent / body corporate"
                        className="mt-1.5 w-full rounded-lg border border-charcoal-border px-3 py-2.5 text-sm text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                        Scheme / estate
                      </label>
                      <input
                        value={form.scheme}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, scheme: e.target.value }))
                        }
                        placeholder="e.g. Chancliff Ridge"
                        className="mt-1.5 w-full rounded-lg border border-charcoal-border px-3 py-2.5 text-sm text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/20"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                        Site notes
                      </label>
                      <textarea
                        rows={3}
                        value={form.message}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, message: e.target.value }))
                        }
                        placeholder="Damp zones, block phasing, access constraints…"
                        className="mt-1.5 w-full resize-none rounded-lg border border-charcoal-border px-3 py-2.5 text-sm text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/20"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-turquoise px-4 py-3 text-sm font-semibold text-white transition hover:bg-turquoise-dark"
                  >
                    Schedule structural site inspection
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-turquoise-light text-turquoise-dark">
                  <i className="fa-solid fa-check text-lg" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  Assessment request received
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  Rico will contact you within one business day to confirm a physical
                  site walk-through and moisture diagnostics schedule.
                </p>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <a
                    href={`tel:${BUSINESS.phone}`}
                    className="rounded-lg bg-turquoise px-4 py-2.5 text-sm font-semibold text-white hover:bg-turquoise-dark"
                  >
                    Call {BUSINESS.phoneDisplay}
                  </a>
                  <Link
                    href="/contact"
                    className="rounded-lg border border-charcoal-border px-4 py-2.5 text-sm font-semibold text-ink hover:border-turquoise"
                    onClick={handleClose}
                  >
                    Full contact page
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
