"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SUBSTRATE_PROFILES,
  runEstimation,
  type EngineOverrides,
  type SubstrateProfileId,
} from "@/lib/estimation-engine";

type Props = {
  engineOverrides: EngineOverrides;
  selectedTier: "tier1" | "tier2" | "tier3";
  onTierChange: (tier: "tier1" | "tier2" | "tier3") => void;
  onResultChange?: (result: ReturnType<typeof runEstimation> | null) => void;
};

const SUBSTRATE_OPTIONS: SubstrateProfileId[] = [
  "smooth_plaster",
  "bagged_brickwork",
  "rough_cast",
];

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function JobCardSimulator({
  engineOverrides,
  selectedTier,
  onTierChange,
  onResultChange,
}: Props) {
  const [areaSqm, setAreaSqm] = useState(2200);
  const [substrate, setSubstrate] = useState<SubstrateProfileId>("bagged_brickwork");
  const [windowDoorPerimeterM, setWindowDoorPerimeterM] = useState(180);
  const [crackLinearM, setCrackLinearM] = useState(45);
  const [wallBoundaryRunM, setWallBoundaryRunM] = useState(220);

  const result = useMemo(() => {
    try {
      return runEstimation(
        {
          grossWallAreaSqm: areaSqm,
          substrate,
          crackLinearM,
          windowDoorPerimeterM,
          wallBoundaryRunM,
          degradationIndex: crackLinearM > 40 ? 3 : 2,
          applicationMethod: areaSqm > 3000 ? "spray" : "roller",
          schemeScale: areaSqm > 5000 ? "large" : "medium",
        },
        engineOverrides,
      );
    } catch {
      return null;
    }
  }, [
    areaSqm,
    substrate,
    crackLinearM,
    windowDoorPerimeterM,
    wallBoundaryRunM,
    engineOverrides,
  ]);

  useEffect(() => {
    onResultChange?.(result);
  }, [result, onResultChange]);

  const activeTier = result?.tiers.find((t) => t.tier === selectedTier);

  return (
    <section className="rounded-xl border border-charcoal-border bg-surface p-6">
      <header className="mb-6 border-b border-charcoal-border pb-4">
        <h2 className="font-display text-lg font-semibold text-ink">
          Job card simulator
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Mock an active on-site card — volumetrics and labour update live.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Gross wall area (m²)
          </label>
          <input
            type="number"
            min={100}
            max={20000}
            value={areaSqm}
            onChange={(e) => setAreaSqm(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-charcoal-border px-3 py-2 text-sm text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/20"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Substrate profile
          </label>
          <select
            value={substrate}
            onChange={(e) => setSubstrate(e.target.value as SubstrateProfileId)}
            className="mt-1.5 w-full rounded-lg border border-charcoal-border px-3 py-2 text-sm text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/20"
          >
            {SUBSTRATE_OPTIONS.map((id) => (
              <option key={id} value={id}>
                {SUBSTRATE_PROFILES[id].label} (α {SUBSTRATE_PROFILES[id].alpha})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Window / door perimeter (LM)
          </label>
          <input
            type="number"
            min={0}
            value={windowDoorPerimeterM}
            onChange={(e) => setWindowDoorPerimeterM(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-charcoal-border px-3 py-2 text-sm text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/20"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Structural cracking (LM)
          </label>
          <input
            type="number"
            min={0}
            value={crackLinearM}
            onChange={(e) => setCrackLinearM(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-charcoal-border px-3 py-2 text-sm text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/20"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Wall boundary run (LM)
          </label>
          <input
            type="number"
            min={0}
            value={wallBoundaryRunM}
            onChange={(e) => setWallBoundaryRunM(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-charcoal-border px-3 py-2 text-sm text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/20"
          />
        </div>
      </div>

      {result && (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            {(["tier1", "tier2", "tier3"] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => onTierChange(tier)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  selectedTier === tier
                    ? "bg-turquoise text-white"
                    : "border border-slate-400 text-slate-700 hover:border-turquoise hover:text-turquoise-dark"
                }`}
              >
                {result.tiers.find((t) => t.tier === tier)?.label ?? tier}
              </button>
            ))}
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Effective area", `${result.effectiveAreaSqm} m²`],
              ["Paint volume", `${activeTier?.paintLiters ?? "—"} L`],
              ["Primer volume", `${activeTier?.primerLiters ?? "—"} L`],
              ["20L drums", `${activeTier?.drumAllocation.drums20L ?? 0}`],
              ["5L buckets", `${activeTier?.drumAllocation.buckets5L ?? 0}`],
              ["Crack filler", `${result.fillerDryKg} kg dry`],
              ["Masking rolls", `${result.maskingTapeRolls}`],
              ["Drop sheets", `${result.dropSheets}`],
              ["Labour hours", `${activeTier?.laborHours ?? "—"} h`],
              [
                "Phase timeline",
                `${activeTier?.phasedMonths ?? "—"} months`,
              ],
              [
                "Monthly drawdown",
                formatZAR(activeTier?.monthlyReserveDrawdownZAR ?? 0),
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-charcoal-border bg-surface-muted px-3 py-2.5"
              >
                <dt className="text-xs font-medium text-slate-600">{label}</dt>
                <dd className="mt-0.5 font-mono text-sm font-semibold text-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </section>
  );
}
