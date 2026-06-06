"use client";

import type { StoredEngineOverrides } from "@/lib/backoffice-storage";

type Props = {
  values: StoredEngineOverrides;
  onChange: (values: StoredEngineOverrides) => void;
  onReset: () => void;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
      {children}
    </span>
  );
}

export function EngineOverridePanel({ values, onChange, onReset }: Props) {
  function patch(partial: Partial<StoredEngineOverrides>) {
    onChange({ ...values, ...partial });
  }

  return (
    <section className="rounded-xl border border-charcoal-border bg-surface p-6">
      <header className="mb-6 border-b border-charcoal-border pb-4">
        <h2 className="font-display text-lg font-semibold text-ink">
          Rates &amp; margins
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Labour rate, paint prices &amp; profit margin — updates the quote instantly.
        </p>
      </header>

      <div className="space-y-6">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <FieldLabel>Base labour rate</FieldLabel>
            <span className="font-mono text-sm font-semibold text-turquoise-dark">
              R{values.bibcHourlyRateZAR}/hr
            </span>
          </div>
          <input
            type="range"
            min={60}
            max={150}
            step={1}
            value={values.bibcHourlyRateZAR}
            onChange={(e) =>
              patch({ bibcHourlyRateZAR: Number(e.target.value) })
            }
            className="mt-2 w-full accent-turquoise"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {(
            [
              ["tier1DrumPrice", "Tier 1 · Micatex 20L"],
              ["tier2DrumPrice", "Tier 2 · Wall & All 20L"],
              ["tier3DrumPrice", "Tier 3 · Polvin 20L"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <FieldLabel>{label}</FieldLabel>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-600">
                  R
                </span>
                <input
                  type="number"
                  min={500}
                  max={5000}
                  step={50}
                  value={values[key]}
                  onChange={(e) => patch({ [key]: Number(e.target.value) })}
                  className="w-full rounded-lg border border-charcoal-border py-2 pl-7 pr-3 text-sm text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/20"
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-2">
            <FieldLabel>Consumables markup</FieldLabel>
            <span className="font-mono text-sm font-semibold text-turquoise-dark">
              {values.consumablesMarkupPct}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={values.consumablesMarkupPct}
            onChange={(e) =>
              patch({ consumablesMarkupPct: Number(e.target.value) })
            }
            className="mt-2 w-full accent-turquoise"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-2">
            <FieldLabel>Terminal profit margin</FieldLabel>
            <span className="font-mono text-sm font-semibold text-turquoise-dark">
              {values.profitMarginPct}%
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={40}
            step={1}
            value={values.profitMarginPct}
            onChange={(e) =>
              patch({ profitMarginPct: Number(e.target.value) })
            }
            className="mt-2 w-full accent-turquoise"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 text-sm font-medium text-slate-600 underline-offset-2 hover:text-turquoise-dark hover:underline"
      >
        Reset to engine defaults
      </button>
    </section>
  );
}
