"use client";

import type { EstimationResult, ProductTierId } from "@/lib/estimation-engine";

type Props = {
  result: EstimationResult | null;
  selectedTier: ProductTierId;
  onTierChange: (tier: ProductTierId) => void;
  clientName: string;
  schemeName: string;
};

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);
}

const TIER_LABELS: Record<ProductTierId, string> = {
  tier1: "Tier 1 · Elite",
  tier2: "Tier 2 · Professional",
  tier3: "Tier 3 · Budget",
};

export function ProposalPreview({
  result,
  selectedTier,
  onTierChange,
  clientName,
  schemeName,
}: Props) {
  const tier = result?.tiers.find((t) => t.tier === selectedTier);

  return (
    <section className="kgp-bo-card-dark rounded-xl border p-6">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-50">
            Proposal preview
          </h2>
          <p className="kgp-bo-muted mt-1 text-sm">
            Print-ready B2B quotation layout — toggle tier presentation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["tier1", "tier2", "tier3"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onTierChange(id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedTier === id
                  ? "bg-turquoise text-white"
                  : "kgp-bo-tier-inactive border hover:border-turquoise hover:text-turquoise"
              }`}
            >
              {TIER_LABELS[id]}
            </button>
          ))}
        </div>
      </header>

      <article
        id="kgp-proposal-print"
        className="kgp-proposal rounded-xl border border-charcoal-border bg-surface p-8 text-ink shadow-lg print:shadow-none"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-turquoise pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-turquoise-dark">
              Exterior painting proposal
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold text-ink">
              Krugersdorp Painters
            </h3>
            <p className="mt-1 text-sm text-ink-muted">
              B2B phased exterior programme · PMR 22 aligned
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold text-ink">{new Date().toLocaleDateString("en-ZA")}</p>
            <p className="text-ink-muted">Ref: KGP-{Date.now().toString(36).toUpperCase()}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
              Prepared for
            </p>
            <p className="mt-1 font-semibold text-ink">{clientName || "Trustee / Managing Agent"}</p>
            <p className="text-sm text-ink-muted">{schemeName || "West Rand sectional title scheme"}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
              Specification tier
            </p>
            <p className="mt-1 font-display text-xl font-semibold text-turquoise-dark">
              {tier?.label ?? "—"}
            </p>
            <p className="text-sm text-ink-muted">{tier?.products ?? ""}</p>
          </div>
        </div>

        {tier && result ? (
          <>
            <div className="mt-8 rounded-lg bg-turquoise-light/40 px-4 py-3">
              <p className="text-sm font-medium text-ink">
                <span className="text-turquoise-dark">Operational mandate:</span> Exterior-only
                phased chunking — zero interior access, SANS 10400 moisture verification
                (&lt;8%), 100&nbsp;µm aggregate DFT target on textured systems.
              </p>
            </div>

            <table className="mt-8 w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal-border text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="pb-2 font-semibold">Line item</th>
                  <th className="pb-2 text-right font-semibold">Qty</th>
                  <th className="pb-2 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-border/60">
                <tr>
                  <td className="py-2.5">Topcoat system ({tier.products})</td>
                  <td className="py-2.5 text-right font-mono">
                    {tier.drumAllocation.drums20L}×20L
                    {tier.drumAllocation.buckets5L > 0
                      ? ` + ${tier.drumAllocation.buckets5L}×5L`
                      : ""}
                  </td>
                  <td className="py-2.5 text-right font-mono">{formatZAR(tier.materialCostZAR)}</td>
                </tr>
                <tr>
                  <td className="py-2.5">Primer system</td>
                  <td className="py-2.5 text-right font-mono">{tier.primerLiters} L</td>
                  <td className="py-2.5 text-right font-mono">{formatZAR(tier.primerCostZAR)}</td>
                </tr>
                <tr>
                  <td className="py-2.5">Crack filler (structural)</td>
                  <td className="py-2.5 text-right font-mono">{result.fillerDryKg} kg</td>
                  <td className="py-2.5 text-right font-mono">{formatZAR(tier.fillerCostZAR)}</td>
                </tr>
                <tr>
                  <td className="py-2.5">Masking &amp; drop sheets</td>
                  <td className="py-2.5 text-right font-mono">
                    {result.maskingTapeRolls} rolls · {result.dropSheets} sheets
                  </td>
                  <td className="py-2.5 text-right font-mono">
                    {formatZAR(tier.consumablesCostZAR)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5">Labour ({tier.laborHours} h · 2-person crew)</td>
                  <td className="py-2.5 text-right font-mono">{result.effectiveAreaSqm} m² eff.</td>
                  <td className="py-2.5 text-right font-mono">{formatZAR(tier.laborCostZAR)}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6 flex flex-col items-end gap-1 border-t border-charcoal-border pt-4 text-sm">
              <p className="text-ink-muted">
                Subtotal <span className="ml-4 font-mono text-ink">{formatZAR(tier.subtotalZAR)}</span>
              </p>
              <p className="text-ink-muted">
                Profit margin{" "}
                <span className="ml-4 font-mono text-ink">{formatZAR(tier.profitZAR)}</span>
              </p>
              <p className="font-display text-xl font-bold text-ink">
                Total programme value{" "}
                <span className="ml-2 text-turquoise-dark">{formatZAR(tier.totalZAR)}</span>
              </p>
              <p className="text-xs text-ink-muted">
                {formatZAR(tier.costPerSqmZAR)}/m² gross · {tier.phasedMonths}-month phased drawdown
                · {formatZAR(tier.monthlyReserveDrawdownZAR)}/month reserve accrual
              </p>
            </div>
          </>
        ) : (
          <p className="mt-8 text-center text-sm text-ink-muted">
            Configure the job card simulator to generate a proposal preview.
          </p>
        )}

        <footer className="mt-8 border-t border-charcoal-border pt-4 text-xs text-ink-muted">
          Valid 30 days · Subject to on-site moisture diagnostics · Exterior common property only ·
          Personnel never enter sectional title interiors.
        </footer>
      </article>

      <button
        type="button"
        onClick={() => window.print()}
        className="mt-4 w-full rounded-lg border-2 border-turquoise bg-transparent px-4 py-2.5 text-sm font-semibold text-turquoise transition hover:bg-turquoise hover:text-white print:hidden"
      >
        Print proposal
      </button>
    </section>
  );
}
