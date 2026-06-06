"use client";

import type { EstimationResult, ProductTierId } from "@/lib/estimation-engine";
import type { QuickQuoteJob, QuickQuoteResult } from "@/types/quick-quote";

type Props = {
  job: QuickQuoteJob;
  result: QuickQuoteResult;
  onPrint: () => void;
};

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);
}

const TIER_LABELS: Record<ProductTierId, string> = {
  tier1: "Elite textured",
  tier2: "Professional acrylic",
  tier3: "Budget grade",
};

export function QuoteProposalPreview({ job, result, onPrint }: Props) {
  const enabledItems = result.lineItems.filter(
    (i) => !job.disabledLineItemIds.includes(i.id),
  );

  return (
    <section className="kgp-bo-card-dark rounded-xl border p-6">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-50">
            Quote preview
          </h2>
          <p className="kgp-bo-muted mt-1 text-sm">
            {job.unitCount}× {job.unitLabel} — print or send to client
          </p>
        </div>
        <button
          type="button"
          onClick={onPrint}
          className="rounded-lg border-2 border-turquoise px-4 py-2 text-sm font-semibold text-turquoise transition hover:bg-turquoise hover:text-white print:hidden"
        >
          Print quote
        </button>
      </header>

      <article
        id="kgp-proposal-print"
        className="kgp-proposal rounded-xl border border-charcoal-border bg-surface p-8 text-ink shadow-lg print:shadow-none"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-turquoise pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-turquoise-dark">
              Exterior quotation
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold text-ink">
              Krugersdorp Painters
            </h3>
            <p className="mt-1 text-sm text-ink-muted">Exterior-only · sectional title &amp; complex work</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold text-ink">{new Date().toLocaleDateString("en-ZA")}</p>
            <p className="text-ink-muted">Ref: {job.jobRef}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Prepared for</p>
            <p className="mt-1 font-semibold text-ink">{job.clientName || "Client / Body Corporate"}</p>
            <p className="text-sm text-ink-muted">{job.schemeName || "Complex / estate name"}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Scope</p>
            <p className="mt-1 font-semibold text-ink">
              {job.unitCount} identical units — {job.unitLabel}
            </p>
            <p className="text-sm text-ink-muted">{TIER_LABELS[job.productTier]}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-lg bg-turquoise-light/40 px-4 py-3 text-sm sm:grid-cols-3">
          <p>
            <span className="font-semibold text-turquoise-dark">Walls:</span>{" "}
            {result.takeoff.paintableWallSqm} m² paintable
          </p>
          <p>
            <span className="font-semibold text-turquoise-dark">Roof:</span>{" "}
            {result.takeoff.roofSlopeSqm} m² slope
          </p>
          <p>
            <span className="font-semibold text-turquoise-dark">Membrane:</span>{" "}
            {result.takeoff.membraneLinearM} lm
          </p>
        </div>

        {enabledItems.length > 0 ? (
          <>
            <table className="mt-8 w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal-border text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="pb-2 font-semibold">Line item</th>
                  <th className="pb-2 text-right font-semibold">Per unit</th>
                  <th className="pb-2 text-right font-semibold">× {job.unitCount}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-border/60">
                {enabledItems.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5">{item.description}</td>
                    <td className="py-2.5 text-right font-mono text-xs text-ink-muted">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2.5 text-right font-mono">
                      {formatZAR(item.totalPriceZAR * (item.perUnit ? job.unitCount : 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex flex-col items-end gap-1 border-t border-charcoal-border pt-4 text-sm">
              <p className="text-ink-muted">
                Cost (excl. profit){" "}
                <span className="ml-4 font-mono text-ink">
                  {formatZAR(result.project.subtotalZAR)}
                </span>
              </p>
              <p className="text-ink-muted">
                Nett profit{" "}
                <span className="ml-4 font-mono text-emerald-700">
                  {formatZAR(result.project.profitZAR)}
                </span>
              </p>
              <p className="font-display text-xl font-bold text-ink">
                Total quote{" "}
                <span className="ml-2 text-turquoise-dark">
                  {formatZAR(result.project.totalZAR)}
                </span>
              </p>
              <p className="text-xs text-ink-muted">
                {result.project.laborHours} labour hours · ~{result.project.calendarDays} working
                days with {job.crewSize} people
              </p>
            </div>
          </>
        ) : (
          <p className="mt-8 text-center text-sm text-ink-muted">
            Enable at least one line item to generate a quote.
          </p>
        )}

        <footer className="mt-8 border-t border-charcoal-border pt-4 text-xs text-ink-muted">
          Valid 30 days · Subject to on-site verification · Exterior work only
        </footer>
      </article>
    </section>
  );
}

// Keep legacy export name unused — satisfies any stale imports
export type LegacyEstimationResult = EstimationResult;
