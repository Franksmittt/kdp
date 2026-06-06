"use client";

import { useMemo, useState } from "react";
import {
  EXTERIOR_SERVICES,
  ROOF_TYPES,
  SURFACE_CONDITIONS,
} from "@/config/exterior-quote";
import type { EngineOverrides } from "@/lib/estimation-engine";
import { PRODUCT_TIERS } from "@/lib/estimation-engine";
import {
  defaultQuickQuoteJob,
  newManualLineItem,
  runQuickQuote,
  servicesForCondition,
} from "@/lib/quick-quote-engine";
import { QuoteProposalPreview } from "@/components/backoffice/QuoteProposalPreview";
import type {
  ExteriorServiceId,
  QuickQuoteJob,
  RoofTypeId,
  SurfaceCondition,
} from "@/types/quick-quote";

type Props = {
  engineOverrides: EngineOverrides;
  clientName: string;
  schemeName: string;
  onClientChange: (v: string) => void;
  onSchemeChange: (v: string) => void;
};

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);
}

function inputClass() {
  return "kgp-bo-input mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/30";
}

function labelClass() {
  return "kgp-bo-label text-xs font-semibold uppercase tracking-wide";
}

function UnitPreview({ cementPercent }: { cementPercent: number }) {
  const cement = Math.min(100, Math.max(0, cementPercent));
  return (
    <div className="mx-auto w-full max-w-[140px]">
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-lg border-2 border-slate-500 bg-[#c4a574]"
        title="Facebrick = tan, cement = grey"
      >
        <div
          className="absolute inset-x-0 bottom-0 bg-slate-400 transition-all duration-200"
          style={{ height: `${cement}%` }}
        />
        <div className="absolute inset-x-2 top-2 h-3 rounded-sm bg-sky-200/80" />
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">
        {cement}% cement · {100 - cement}% facebrick
      </p>
    </div>
  );
}

export function QuickQuoteBuilder({
  engineOverrides,
  clientName,
  schemeName,
  onClientChange,
  onSchemeChange,
}: Props) {
  const [job, setJob] = useState<QuickQuoteJob>(() => defaultQuickQuoteJob());

  const result = useMemo(
    () => runQuickQuote(job, engineOverrides),
    [job, engineOverrides],
  );

  function patchJob(partial: Partial<QuickQuoteJob>) {
    setJob((j) => ({ ...j, ...partial }));
  }

  function patchSpec(partial: Partial<QuickQuoteJob["unitSpec"]>) {
    setJob((j) => ({ ...j, unitSpec: { ...j.unitSpec, ...partial } }));
  }

  function toggleService(id: ExteriorServiceId) {
    setJob((j) => ({
      ...j,
      unitSpec: {
        ...j.unitSpec,
        services: { ...j.unitSpec.services, [id]: !j.unitSpec.services[id] },
      },
    }));
  }

  function setCondition(condition: SurfaceCondition) {
    setJob((j) => {
      const cond = SURFACE_CONDITIONS[condition];
      return {
        ...j,
        unitSpec: {
          ...j.unitSpec,
          condition,
          crackLinearM: cond.defaultCrackLm,
          services: servicesForCondition(
            condition,
            j.unitSpec.services,
          ) as QuickQuoteJob["unitSpec"]["services"],
        },
      };
    });
  }

  function toggleLineItem(id: string) {
    setJob((j) => {
      const disabled = new Set(j.disabledLineItemIds);
      if (disabled.has(id)) disabled.delete(id);
      else disabled.add(id);
      return { ...j, disabledLineItemIds: [...disabled] };
    });
  }

  function addManualItem() {
    setJob((j) => ({
      ...j,
      manualLineItems: [...j.manualLineItems, newManualLineItem()],
    }));
  }

  function removeManualItem(id: string) {
    setJob((j) => ({
      ...j,
      manualLineItems: j.manualLineItems.filter((m) => m.id !== id),
    }));
  }

  function patchManualItem(id: string, partial: Partial<(typeof job.manualLineItems)[0]>) {
    setJob((j) => ({
      ...j,
      manualLineItems: j.manualLineItems.map((m) =>
        m.id === id ? { ...m, ...partial } : m,
      ),
    }));
  }

  const spec = job.unitSpec;

  return (
    <div className="space-y-6">
      {/* Job header */}
      <section className="kgp-bo-card-dark rounded-xl border p-6">
        <h2 className="font-display text-lg font-semibold text-slate-50">New quote</h2>
        <p className="kgp-bo-muted mt-1 text-sm">
          One unit type × how many — build the scope in minutes
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelClass()}>Job ref</label>
            <input
              value={job.jobRef}
              onChange={(e) => patchJob({ jobRef: e.target.value })}
              className={inputClass()}
            />
          </div>
          <div>
            <label className={labelClass()}>Client</label>
            <input
              value={clientName}
              onChange={(e) => onClientChange(e.target.value)}
              placeholder="Body corporate / agent"
              className={inputClass()}
            />
          </div>
          <div>
            <label className={labelClass()}>Complex / estate</label>
            <input
              value={schemeName}
              onChange={(e) => onSchemeChange(e.target.value)}
              placeholder="Complex A"
              className={inputClass()}
            />
          </div>
          <div>
            <label className={labelClass()}>How many units?</label>
            <input
              type="number"
              min={1}
              max={999}
              value={job.unitCount}
              onChange={(e) => patchJob({ unitCount: Math.max(1, Number(e.target.value)) })}
              className={inputClass()}
            />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass()}>Unit label</label>
            <input
              value={job.unitLabel}
              onChange={(e) => patchJob({ unitLabel: e.target.value })}
              placeholder="e.g. Type A — ground floor"
              className={inputClass()}
            />
          </div>
          <div>
            <label className={labelClass()}>Paint grade</label>
            <select
              value={job.productTier}
              onChange={(e) =>
                patchJob({ productTier: e.target.value as QuickQuoteJob["productTier"] })
              }
              className={inputClass()}
            >
              {(["tier1", "tier2", "tier3"] as const).map((id) => (
                <option key={id} value={id}>
                  {PRODUCT_TIERS[id].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass()}>Crew size</label>
            <select
              value={job.crewSize}
              onChange={(e) =>
                patchJob({ crewSize: Number(e.target.value) as QuickQuoteJob["crewSize"] })
              }
              className={inputClass()}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "person" : "people"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-5">
        {/* Left: unit builder */}
        <div className="space-y-6 xl:col-span-3">
          {/* Unit dimensions */}
          <section className="kgp-bo-card-dark rounded-xl border p-6">
            <h3 className="font-display font-semibold text-slate-50">Unit size</h3>
            <p className="kgp-bo-muted mt-1 text-sm">Length × width × wall height</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-4">
              <div>
                <label className={labelClass()}>Length (m)</label>
                <input
                  type="number"
                  min={1}
                  step={0.5}
                  value={spec.lengthM}
                  onChange={(e) => patchSpec({ lengthM: Number(e.target.value) })}
                  className={inputClass()}
                />
              </div>
              <div>
                <label className={labelClass()}>Width (m)</label>
                <input
                  type="number"
                  min={1}
                  step={0.5}
                  value={spec.widthM}
                  onChange={(e) => patchSpec({ widthM: Number(e.target.value) })}
                  className={inputClass()}
                />
              </div>
              <div>
                <label className={labelClass()}>Wall height (m)</label>
                <input
                  type="number"
                  min={2}
                  step={0.1}
                  value={spec.heightM}
                  onChange={(e) => patchSpec({ heightM: Number(e.target.value) })}
                  className={inputClass()}
                />
              </div>
              <div className="flex items-end justify-center pb-1">
                <UnitPreview cementPercent={spec.cementPercent} />
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-baseline justify-between gap-2">
                <label className={labelClass()}>Cement / plaster (% of walls)</label>
                <span className="font-mono text-sm font-semibold text-turquoise">
                  {spec.cementPercent}%
                </span>
              </div>
              <p className="kgp-bo-muted mt-1 text-xs">
                Rest is facebrick — we only quote paintable cement areas
              </p>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={spec.cementPercent}
                onChange={(e) => patchSpec({ cementPercent: Number(e.target.value) })}
                className="mt-2 w-full accent-turquoise"
              />
            </div>
            <div className="mt-4 rounded-lg bg-charcoal-elevated px-4 py-3 text-sm text-slate-300">
              <span className="font-semibold text-turquoise">Paintable walls:</span>{" "}
              {result.takeoff.paintableWallSqm} m² per unit
              <span className="kgp-bo-muted ml-2 text-xs">
                ({result.takeoff.grossWallSqm} m² gross − {result.takeoff.openingsSqm} m² openings)
              </span>
            </div>
          </section>

          {/* Openings */}
          <section className="kgp-bo-card-dark rounded-xl border p-6">
            <h3 className="font-display font-semibold text-slate-50">Windows &amp; doors</h3>
            <p className="kgp-bo-muted mt-1 text-sm">Deducted from wall area before painting</p>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div className="space-y-3 rounded-lg border border-slate-600 p-4">
                <p className="text-sm font-semibold text-slate-200">Windows</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-slate-400">Qty</label>
                    <input
                      type="number"
                      min={0}
                      value={spec.windows.count}
                      onChange={(e) =>
                        patchSpec({
                          windows: { ...spec.windows, count: Number(e.target.value) },
                        })
                      }
                      className={inputClass()}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">W (m)</label>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={spec.windows.widthM}
                      onChange={(e) =>
                        patchSpec({
                          windows: { ...spec.windows, widthM: Number(e.target.value) },
                        })
                      }
                      className={inputClass()}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">H (m)</label>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={spec.windows.heightM}
                      onChange={(e) =>
                        patchSpec({
                          windows: { ...spec.windows, heightM: Number(e.target.value) },
                        })
                      }
                      className={inputClass()}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3 rounded-lg border border-slate-600 p-4">
                <p className="text-sm font-semibold text-slate-200">Doors</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-slate-400">Qty</label>
                    <input
                      type="number"
                      min={0}
                      value={spec.doors.count}
                      onChange={(e) =>
                        patchSpec({
                          doors: { ...spec.doors, count: Number(e.target.value) },
                        })
                      }
                      className={inputClass()}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">W (m)</label>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={spec.doors.widthM}
                      onChange={(e) =>
                        patchSpec({
                          doors: { ...spec.doors, widthM: Number(e.target.value) },
                        })
                      }
                      className={inputClass()}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">H (m)</label>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={spec.doors.heightM}
                      onChange={(e) =>
                        patchSpec({
                          doors: { ...spec.doors, heightM: Number(e.target.value) },
                        })
                      }
                      className={inputClass()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Roof */}
          <section className="kgp-bo-card-dark rounded-xl border p-6">
            <h3 className="font-display font-semibold text-slate-50">Roof</h3>
            <p className="kgp-bo-muted mt-1 text-sm">Pick the closest layout — we calc area &amp; membrane</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {(Object.keys(ROOF_TYPES) as RoofTypeId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => patchSpec({ roofType: id })}
                  className={`rounded-lg border p-3 text-left text-sm transition ${
                    spec.roofType === id
                      ? "border-turquoise bg-turquoise/10 text-slate-50"
                      : "border-slate-600 text-slate-300 hover:border-slate-400"
                  }`}
                >
                  <span className="font-semibold">{ROOF_TYPES[id].label}</span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {ROOF_TYPES[id].description}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-baseline justify-between">
                  <label className={labelClass()}>Pitch (degrees)</label>
                  <span className="font-mono text-sm text-turquoise">{spec.roofPitchDeg}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={45}
                  step={1}
                  disabled={spec.roofType === "flat_parapet"}
                  value={spec.roofPitchDeg}
                  onChange={(e) => patchSpec({ roofPitchDeg: Number(e.target.value) })}
                  className="mt-2 w-full accent-turquoise disabled:opacity-40"
                />
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <label className={labelClass()}>Overhang</label>
                  <span className="font-mono text-sm text-turquoise">{spec.roofOverhangMm} mm</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={50}
                  value={spec.roofOverhangMm}
                  onChange={(e) => patchSpec({ roofOverhangMm: Number(e.target.value) })}
                  className="mt-2 w-full accent-turquoise"
                />
              </div>
            </div>
            <div className="mt-4 grid gap-2 rounded-lg bg-charcoal-elevated px-4 py-3 text-sm sm:grid-cols-2">
              <p>
                <span className="font-semibold text-turquoise">Roof area:</span>{" "}
                {result.takeoff.roofSlopeSqm} m² slope
              </p>
              <p>
                <span className="font-semibold text-turquoise">Membrane:</span>{" "}
                {result.takeoff.membraneLinearM} linear metres
              </p>
            </div>
          </section>

          {/* Services & condition */}
          <section className="kgp-bo-card-dark rounded-xl border p-6">
            <h3 className="font-display font-semibold text-slate-50">What work?</h3>
            <p className="kgp-bo-muted mt-1 text-sm">Tick the scope — primer &amp; cracks depend on condition</p>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {(Object.keys(SURFACE_CONDITIONS) as SurfaceCondition[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCondition(id)}
                  className={`rounded-lg border p-3 text-left text-sm transition ${
                    spec.condition === id
                      ? "border-turquoise bg-turquoise/10 text-slate-50"
                      : "border-slate-600 text-slate-300 hover:border-slate-400"
                  }`}
                >
                  <span className="font-semibold">{SURFACE_CONDITIONS[id].label}</span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {SURFACE_CONDITIONS[id].description}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {(Object.keys(EXTERIOR_SERVICES) as ExteriorServiceId[]).map((id) => (
                <label
                  key={id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                    spec.services[id]
                      ? "border-turquoise bg-turquoise/5"
                      : "border-slate-600 opacity-70"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={spec.services[id]}
                    onChange={() => toggleService(id)}
                    className="mt-1 accent-turquoise"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-100">
                      {EXTERIOR_SERVICES[id].label}
                    </span>
                    <span className="text-xs text-slate-400">
                      {EXTERIOR_SERVICES[id].description}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {spec.services.crack_fill && (
                <div>
                  <label className={labelClass()}>Crack fill (lm per unit)</label>
                  <input
                    type="number"
                    min={0}
                    value={spec.crackLinearM}
                    onChange={(e) => patchSpec({ crackLinearM: Number(e.target.value) })}
                    className={inputClass()}
                  />
                </div>
              )}
              {spec.services.wall_paint && (
                <div>
                  <label className={labelClass()}>Wall coats</label>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    value={spec.wallCoats}
                    onChange={(e) => patchSpec({ wallCoats: Number(e.target.value) })}
                    className={inputClass()}
                  />
                </div>
              )}
              {spec.services.roof_paint && (
                <div>
                  <label className={labelClass()}>Roof coats</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={spec.roofCoats}
                    onChange={(e) => patchSpec({ roofCoats: Number(e.target.value) })}
                    className={inputClass()}
                  />
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right: totals + line items */}
        <div className="space-y-6 xl:col-span-2">
          <section className="kgp-bo-card-dark rounded-xl border p-6">
            <h3 className="font-display font-semibold text-slate-50">Totals</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-600 pb-2">
                <span className="kgp-bo-muted">Per unit</span>
                <span className="font-mono font-semibold text-slate-100">
                  {formatZAR(result.perUnit.totalZAR)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-600 pb-2">
                <span className="kgp-bo-muted">× {job.unitCount} units</span>
                <span className="font-mono text-lg font-bold text-turquoise">
                  {formatZAR(result.project.totalZAR)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <p className="kgp-bo-muted">
                  Cost: <span className="text-slate-200">{formatZAR(result.project.subtotalZAR)}</span>
                </p>
                <p className="kgp-bo-muted">
                  Profit:{" "}
                  <span className="text-emerald-400">{formatZAR(result.project.profitZAR)}</span>
                </p>
                <p className="kgp-bo-muted">
                  Hours: <span className="text-slate-200">{result.project.laborHours} h</span>
                </p>
                <p className="kgp-bo-muted">
                  Duration:{" "}
                  <span className="text-slate-200">
                    ~{result.project.calendarDays} days ({job.crewSize} crew)
                  </span>
                </p>
              </div>
            </div>
          </section>

          <section className="kgp-bo-card-dark rounded-xl border p-6">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display font-semibold text-slate-50">Line items</h3>
              <button
                type="button"
                onClick={addManualItem}
                className="text-xs font-semibold text-turquoise hover:underline"
              >
                + Add item
              </button>
            </div>
            <p className="kgp-bo-muted mt-1 text-xs">Toggle off anything you don&apos;t want on the quote</p>
            <ul className="mt-4 space-y-2">
              {result.lineItems.map((item) => {
                const off = job.disabledLineItemIds.includes(item.id);
                return (
                  <li
                    key={item.id}
                    className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
                      off ? "border-slate-700 opacity-50" : "border-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!off}
                      onChange={() => toggleLineItem(item.id)}
                      className="mt-1 accent-turquoise"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-100">{item.description}</p>
                      <p className="text-xs text-slate-400">
                        {item.quantity} {item.unit} · {formatZAR(item.totalPriceZAR)}/unit
                        {job.unitCount > 1 && (
                          <> · {formatZAR(item.totalPriceZAR * job.unitCount)} total</>
                        )}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {job.manualLineItems.length > 0 && (
              <div className="mt-4 space-y-3 border-t border-slate-600 pt-4">
                <p className="text-xs font-semibold uppercase text-slate-400">Custom items</p>
                {job.manualLineItems.map((m) => (
                  <div key={m.id} className="grid gap-2 rounded-lg border border-slate-600 p-3">
                    <input
                      value={m.description}
                      onChange={(e) => patchManualItem(m.id, { description: e.target.value })}
                      className={inputClass()}
                      placeholder="Description"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        min={0}
                        value={m.quantity}
                        onChange={(e) =>
                          patchManualItem(m.id, { quantity: Number(e.target.value) })
                        }
                        className={inputClass()}
                        placeholder="Qty"
                      />
                      <input
                        value={m.unit}
                        onChange={(e) => patchManualItem(m.id, { unit: e.target.value })}
                        className={inputClass()}
                        placeholder="Unit"
                      />
                      <input
                        type="number"
                        min={0}
                        value={m.unitCostZAR}
                        onChange={(e) =>
                          patchManualItem(m.id, { unitCostZAR: Number(e.target.value) })
                        }
                        className={inputClass()}
                        placeholder="Cost R"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeManualItem(m.id)}
                      className="text-left text-xs text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <QuoteProposalPreview
        job={job}
        result={result}
        onPrint={() => window.print()}
      />
    </div>
  );
}
