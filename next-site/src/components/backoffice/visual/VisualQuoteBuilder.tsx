"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FacadeFinishSlider } from "@/components/backoffice/visual/FacadeFinishSlider";
import { WalkAroundWallEditor } from "@/components/backoffice/visual/WalkAroundWallEditor";
import type { EngineOverrides } from "@/lib/estimation-engine";
import {
  computeGeometryFromFootprint,
  offsetFootprintToWallPolygon,
  offsetPolygonOutward,
} from "@/lib/geometry-engine";
import {
  createRidgeLine,
  MIN_RIDGE_LENGTH_M,
  snapToRoofPlan,
  totalRidgeLengthLm,
} from "@/lib/ridge-engine";
import {
  buildFloorplanExport,
  downloadFloorplanJson,
} from "@/lib/floorplan-export";
import type { Point2D, RidgeLine } from "@/types/visual-quote";
import { RidgeLineEditor } from "@/components/backoffice/visual/RidgeLineEditor";
import { WallElevationEditor } from "@/components/backoffice/visual/WallElevationEditor";
import { toEngineOverrides, type StoredEngineOverrides } from "@/lib/backoffice-storage";
import {
  initialWalkState,
  extractFootprintFromWalkAround,
  wallLabelFromIndex,
} from "@/lib/wall-assembly-engine";
import type {
  ApertureSpec,
  BaseUnitObject,
  FloorplanPhase,
  QuoteCalculationResult,
  RoofStructuralStyle,
  ServicesRequested,
  StartFacing,
  WalkWallInput,
  WallSegment,
} from "@/types/visual-quote";

const BuildingPreview3D = dynamic(
  () =>
    import("@/components/backoffice/visual/BuildingPreview3D").then(
      (m) => m.BuildingPreview3D,
    ),
  { ssr: false, loading: () => <CanvasSkeleton label="Loading 3D preview…" /> },
);

const WalkAroundPreview = dynamic(
  () =>
    import("@/components/backoffice/visual/WalkAroundPreview").then(
      (m) => m.WalkAroundPreview,
    ),
  { ssr: false, loading: () => <CanvasSkeleton label="Loading plan…" /> },
);

function CanvasSkeleton({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-xl bg-[#1F2937] text-sm text-slate-400">
      {label}
    </div>
  );
}

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);
}

type Props = {
  engineValues: StoredEngineOverrides;
  clientName: string;
  schemeName: string;
  onClientChange: (v: string) => void;
  onSchemeChange: (v: string) => void;
};

export function VisualQuoteBuilder({
  engineValues,
  clientName,
  schemeName,
  onClientChange,
  onSchemeChange,
}: Props) {
  const [phase, setPhase] = useState<FloorplanPhase>("walk");
  const [walkInputs, setWalkInputs] = useState<WalkWallInput[]>(() => initialWalkState());
  const [startFacing, setStartFacing] = useState<StartFacing>("east");
  const [wallSegments, setWallSegments] = useState<WallSegment[]>([]);
  const [wallHeightM, setWallHeightM] = useState(3);
  const [roofStyle, setRoofStyle] = useState<RoofStructuralStyle>("gable");
  const [roofPitchDeg, setRoofPitchDeg] = useState(30);
  const [roofOverhangM, setRoofOverhangM] = useState(0.5);
  const [facadePlasterRatio, setFacadePlasterRatio] = useState(1);
  const [unitCount, setUnitCount] = useState(12);
  const [apertures, setApertures] = useState<ApertureSpec[]>([]);
  const [services, setServices] = useState<ServicesRequested>({
    waterproofing_membrane: true,
    alkali_primer: false,
    crack_remediation: false,
    acrylic_topcoat: true,
  });
  const [crewSize, setCrewSize] = useState<1 | 2 | 3 | 4>(2);
  const [quote, setQuote] = useState<QuoteCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ridgeLines, setRidgeLines] = useState<RidgeLine[]>([]);
  const [ridgeDrawMode, setRidgeDrawMode] = useState(false);
  const [ridgePendingStart, setRidgePendingStart] = useState<Point2D | null>(null);
  const [selectedRidgeId, setSelectedRidgeId] = useState<string | null>(null);
  const [selectedWallIndex, setSelectedWallIndex] = useState<number | null>(null);

  const footprint = useMemo(() => {
    if (phase !== "locked" || wallSegments.length === 0) return null;
    return extractFootprintFromWalkAround(wallSegments);
  }, [phase, wallSegments]);

  const vertices = footprint?.vertices ?? [];

  const geometry = useMemo(() => {
    if (phase !== "locked" || vertices.length < 3) return null;
    const base = computeGeometryFromFootprint({
      vertices,
      wallHeightM,
      apertures,
      roofStyle,
      roofPitchDeg,
      roofOverhangM,
      facadePlasterRatio,
    });
    if (ridgeLines.length === 0) return base;
    const ridgesLm = totalRidgeLengthLm(ridgeLines);
    return {
      ...base,
      roof: {
        ...base.roof,
        linear_joints: {
          ...base.roof.linear_joints,
          ridges_lm: Math.round(ridgesLm * 100) / 100,
        },
      },
    };
  }, [
    phase,
    vertices,
    wallHeightM,
    apertures,
    roofStyle,
    roofPitchDeg,
    roofOverhangM,
    facadePlasterRatio,
    ridgeLines,
  ]);

  const offsetVertices = useMemo(
    () => (vertices.length >= 3 ? offsetFootprintToWallPolygon(vertices) : []),
    [vertices],
  );

  const roofOutlineVertices = useMemo(
    () =>
      vertices.length >= 3 && roofOverhangM > 0
        ? offsetPolygonOutward(vertices, roofOverhangM)
        : [],
    [vertices, roofOverhangM],
  );

  const ridgeLinesForExport = ridgeLines;

  function exportFloorplan() {
    if (vertices.length < 3) return;
    const payload = buildFloorplanExport({
      projectReference: schemeName || "draft",
      startFacing,
      walkInputs,
      wallSegments,
      vertices,
      wallHeightM,
      apertures,
      facadePlasterRatio,
      roofStyle,
      roofPitchDeg,
      roofOverhangM,
      ridgeLines: ridgeLinesForExport,
    });
    downloadFloorplanJson(payload, schemeName || "floorplan");
  }

  const engineOverrides: EngineOverrides = useMemo(
    () => toEngineOverrides(engineValues),
    [engineValues],
  );

  function handleLock(walls: WallSegment[], _meta: { adjusted: boolean; gapBeforeM: number }) {
    const fp = extractFootprintFromWalkAround(walls);
    if (!fp) {
      setError("Could not close the shape — check turns and lengths");
      return;
    }
    setWallSegments(walls);
    setPhase("locked");
    setRidgeLines([]);
    setRidgeDrawMode(false);
    setRidgePendingStart(null);
    setSelectedRidgeId(null);
    setSelectedWallIndex(walls.length > 0 ? 0 : null);
    setError(null);
  }

  function unlockFloorplan() {
    setPhase("walk");
    setQuote(null);
    setWalkInputs(initialWalkState());
    setRidgeLines([]);
    setRidgeDrawMode(false);
    setRidgePendingStart(null);
    setSelectedRidgeId(null);
  }

  function handleRidgePoint(raw: Point2D) {
    const point = snapToRoofPlan(raw, roofOutlineVertices, vertices);
    if (!ridgePendingStart) {
      setRidgePendingStart(point);
      return;
    }
    const len = Math.hypot(point.x - ridgePendingStart.x, point.y - ridgePendingStart.y);
    if (len >= MIN_RIDGE_LENGTH_M) {
      setRidgeLines((prev) => [
        ...prev,
        createRidgeLine(ridgePendingStart, point, prev.length),
      ]);
    }
    setRidgePendingStart(null);
  }

  function setWallApertures(wallIndex: number, wallAps: ApertureSpec[]) {
    setApertures((prev) => [
      ...prev.filter((a) => a.wallIndex !== wallIndex),
      ...wallAps.map((a) => ({ ...a, wallIndex })),
    ]);
  }

  function handleWallClick(wallIndex: number) {
    setRidgeDrawMode(false);
    setRidgePendingStart(null);
    setSelectedWallIndex(wallIndex);
  }

  function cancelRidgeDraw() {
    setRidgeDrawMode(false);
    setRidgePendingStart(null);
  }

  const selectedWallSegment =
    selectedWallIndex !== null ? wallSegments[selectedWallIndex] : null;

  const buildBaseUnit = useCallback((): BaseUnitObject | null => {
    if (!geometry) return null;
    return {
      base_unit_id: `unit-${Date.now().toString(36)}`,
      project_reference: schemeName || "draft",
      geometry,
      services_requested: services,
      labor_parameters: {
        allocated_crew_size: crewSize,
        standard_shift_hours: 8,
        blended_hourly_rate: engineOverrides.bibcHourlyRateZAR ?? 85,
      },
      facade_plaster_ratio: facadePlasterRatio,
    };
  }, [
    geometry,
    schemeName,
    services,
    crewSize,
    engineOverrides.bibcHourlyRateZAR,
    facadePlasterRatio,
  ]);

  const calculateQuote = useCallback(async () => {
    const baseUnit = buildBaseUnit();
    if (!baseUnit) {
      setError("Complete the floorplan first");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/quote/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base_unit: baseUnit,
          multiplier_count: unitCount,
          profit_margin_pct: engineValues.profitMarginPct,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Calculation failed");
      setQuote(data.quote);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Quote failed");
    } finally {
      setLoading(false);
    }
  }, [buildBaseUnit, unitCount, engineValues.profitMarginPct]);

  useEffect(() => {
    if (geometry && phase === "locked") {
      const t = setTimeout(() => void calculateQuote(), 400);
      return () => clearTimeout(t);
    }
  }, [geometry, phase, services, unitCount, crewSize, calculateQuote]);

  function toggleService(key: keyof ServicesRequested) {
    setServices((s) => ({ ...s, [key]: !s[key] }));
  }

  return (
    <div className="vqe-root space-y-6">
      <PhaseSteps phase={phase} />

      <section className="vqe-card rounded-xl border p-4 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-white">Visual quote builder</h2>
        <p className="mt-1 text-sm text-slate-400">
          Walk the unit wall by wall · lock the shape · add openings &amp; quote
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="vqe-label">Client</label>
            <input
              value={clientName}
              onChange={(e) => onClientChange(e.target.value)}
              className="vqe-input mt-1 w-full"
              placeholder="Body corporate"
            />
          </div>
          <div>
            <label className="vqe-label">Complex</label>
            <input
              value={schemeName}
              onChange={(e) => onSchemeChange(e.target.value)}
              className="vqe-input mt-1 w-full"
              placeholder="Complex A"
            />
          </div>
          <div>
            <label className="vqe-label">Identical units</label>
            <input
              type="number"
              min={1}
              max={999}
              value={unitCount}
              onChange={(e) => setUnitCount(Math.max(1, Number(e.target.value)))}
              className="vqe-input mt-1 w-full"
            />
          </div>
          <div>
            <label className="vqe-label">Wall height (m)</label>
            <input
              type="number"
              min={2}
              step={0.1}
              value={wallHeightM}
              onChange={(e) => setWallHeightM(Number(e.target.value))}
              className="vqe-input mt-1 w-full"
              disabled={phase !== "locked"}
            />
          </div>
        </div>
      </section>

      {phase === "walk" && (
        <WalkAroundWallEditor
          walkInputs={walkInputs}
          onWalkInputsChange={setWalkInputs}
          startFacing={startFacing}
          onStartFacingChange={setStartFacing}
          onLock={handleLock}
        />
      )}

      {phase === "locked" && (
        <>
          <section className="vqe-card rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-vqe-turquoise">
                Locked floorplan
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={exportFloorplan}
                  className="vqe-btn-secondary rounded-lg px-3 py-1.5 text-xs font-semibold"
                >
                  Export JSON
                </button>
                <button
                  type="button"
                  onClick={unlockFloorplan}
                  className="vqe-btn-secondary rounded-lg px-3 py-1.5 text-xs font-semibold"
                >
                  Edit walls
                </button>
              </div>
            </div>
            <div className="mt-4">
              <WalkAroundPreview
                walls={wallSegments}
                activeWallIndex={null}
                roofOutlineVertices={roofOutlineVertices}
                ridgeLines={ridgeLines}
                roofPlanMode
                selectedWallIndex={selectedWallIndex}
                onWallClick={handleWallClick}
                ridgeDraw={{
                  active: ridgeDrawMode,
                  pendingStart: ridgePendingStart,
                  onPoint: handleRidgePoint,
                  selectedRidgeId,
                }}
              />
            </div>

            <section className="mt-4 rounded-xl border-2 border-blue-500/50 bg-blue-500/5 p-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-blue-400">
                Windows &amp; doors — pick a wall
              </h4>
              <p className="mt-1 text-sm text-slate-300">
                Click a wall below or on the blue lines in the plan above to open its front view and
                add windows, doors, or sliding doors.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {wallSegments.map((w, i) => {
                  const count = apertures.filter((a) => a.wallIndex === i).length;
                  const selected = selectedWallIndex === i;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handleWallClick(i)}
                      className={`rounded-lg border px-3 py-3 text-left text-sm transition-colors ${
                        selected
                          ? "border-blue-400 bg-blue-500/20 text-white"
                          : "border-slate-600 bg-slate-800/80 text-slate-300 hover:border-blue-400 hover:text-white"
                      }`}
                    >
                      <span className="font-bold">{wallLabelFromIndex(i)}</span>
                      <span className="mt-0.5 block font-mono text-xs text-slate-400">
                        {w.lengthM} m long
                      </span>
                      {count > 0 && (
                        <span className="mt-1 block text-xs text-blue-400">
                          {count} opening{count !== 1 ? "s" : ""}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {selectedWallSegment && selectedWallIndex !== null && (
              <div className="mt-4">
                <WallElevationEditor
                  wallIndex={selectedWallIndex}
                  wallLabel={wallLabelFromIndex(selectedWallIndex)}
                  wallLengthM={selectedWallSegment.lengthM}
                  wallHeightM={wallHeightM}
                  apertures={apertures.filter((a) => a.wallIndex === selectedWallIndex)}
                  onChange={(wallAps) => setWallApertures(selectedWallIndex, wallAps)}
                  onClose={() => setSelectedWallIndex(null)}
                />
              </div>
            )}

            {vertices.length >= 3 && (
              <div className="mt-4">
                <RidgeLineEditor
                  ridgeLines={ridgeLines}
                  onChange={setRidgeLines}
                  drawMode={ridgeDrawMode}
                  onDrawModeChange={setRidgeDrawMode}
                  pendingStart={ridgePendingStart}
                  onCancelDraw={cancelRidgeDraw}
                  selectedId={selectedRidgeId}
                  onSelect={setSelectedRidgeId}
                />
              </div>
            )}
            {geometry && (
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400 sm:grid-cols-4">
                <div>
                  Footprint: <span className="text-white">{geometry.footprint.area_sqm} m²</span>
                </div>
                <div>
                  Perimeter: <span className="text-white">{geometry.footprint.perimeter_lm} lm</span>
                </div>
                <div>
                  Net walls: <span className="text-white">{geometry.net_wall_area_sqm} m²</span>
                </div>
                <div>
                  Plaster: <span className="text-white">{geometry.net_plaster_area_sqm} m²</span>
                </div>
              </dl>
            )}
            <ul className="mt-3 hidden flex-wrap gap-2 text-xs text-slate-400">
              {wallSegments.map((w, i) => (
                <li key={w.id} className="rounded-full bg-slate-800 px-2 py-1">
                  <button
                    type="button"
                    onClick={() => handleWallClick(i)}
                    className={`hover:text-white ${selectedWallIndex === i ? "text-blue-400" : ""}`}
                  >
                    {wallLabelFromIndex(i)}: {w.lengthM}m
                    {apertures.filter((a) => a.wallIndex === i).length > 0 && (
                      <span className="ml-1 text-blue-400">
                        ({apertures.filter((a) => a.wallIndex === i).length} openings)
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="vqe-card rounded-xl border p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-vqe-turquoise">
                3D preview
              </h3>
              <BuildingPreview3D
                vertices={vertices}
                offsetVertices={offsetVertices}
                wallHeightM={wallHeightM}
                apertures={apertures}
                plasterRatio={facadePlasterRatio}
                roofPitchDeg={roofPitchDeg}
                roofOverhangM={roofOverhangM}
                roofStyle={roofStyle}
                ridgeLines={ridgeLines}
              />
              <FacadeFinishSlider
                plasterRatio={facadePlasterRatio}
                onChange={setFacadePlasterRatio}
              />
            </section>

            <section className="vqe-card rounded-xl border p-4 sm:p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-vqe-turquoise">
                Roof &amp; services
              </h3>
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(["gable", "hip", "flat"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRoofStyle(s)}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold capitalize ${
                        roofStyle === s
                          ? "border-vqe-turquoise bg-vqe-turquoise/15 text-white"
                          : "border-slate-600 text-slate-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Pitch</span>
                    <span>{roofPitchDeg}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={45}
                    disabled={roofStyle === "flat"}
                    value={roofPitchDeg}
                    onChange={(e) => setRoofPitchDeg(Number(e.target.value))}
                    className="vqe-range mt-1 w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Overhang</span>
                    <span>{roofOverhangM} m</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1.5}
                    step={0.05}
                    value={roofOverhangM}
                    onChange={(e) => setRoofOverhangM(Number(e.target.value))}
                    className="vqe-range mt-1 w-full"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Red dashed line on plan = roof edge with this overhang
                  </p>
                </div>
                {geometry && (
                  <dl className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <dt>Roof slope area</dt>
                      <dd className="font-mono text-white">
                        {geometry.roof.surface_area_sqm} m²
                      </dd>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <dt>Ridge (knocks)</dt>
                      <dd className="font-mono text-white">
                        {geometry.roof.linear_joints.ridges_lm} lm
                      </dd>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <dt>Hips</dt>
                      <dd className="font-mono text-white">
                        {geometry.roof.linear_joints.hips_lm} lm
                      </dd>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <dt>Valleys</dt>
                      <dd className="font-mono text-white">
                        {geometry.roof.linear_joints.valleys_lm} lm
                      </dd>
                    </div>
                  </dl>
                )}
                <div className="space-y-2">
                  {(
                    [
                      ["waterproofing_membrane", "Waterproofing"],
                      ["alkali_primer", "Plaster primer"],
                      ["crack_remediation", "Crack fill"],
                      ["acrylic_topcoat", "Acrylic topcoat"],
                    ] as const
                  ).map(([key, label]) => (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                        services[key]
                          ? "border-vqe-turquoise bg-vqe-turquoise/10 text-white"
                          : "border-slate-600 text-slate-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={services[key]}
                        onChange={() => toggleService(key)}
                        className="vqe-checkbox"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <div>
                  <label className="vqe-label">Crew size</label>
                  <select
                    value={crewSize}
                    onChange={(e) => setCrewSize(Number(e.target.value) as 1 | 2 | 3 | 4)}
                    className="vqe-input mt-1 w-full"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} people
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          </div>

          <section className="vqe-card rounded-xl border p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-white">Quote</h3>
              <button
                type="button"
                onClick={() => void calculateQuote()}
                disabled={loading || !geometry}
                className="vqe-btn-primary rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                {loading ? "Calculating…" : "Recalculate"}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-slate-400">{error}</p>}
            {quote && (
              <>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Stat label="Total quote" value={formatZAR(quote.total_quote_zar)} highlight />
                  <Stat label="Nett profit" value={formatZAR(quote.profit_zar)} />
                  <Stat label="Labour hours" value={`${quote.aggregated.total_labor_hours} h`} />
                  <Stat
                    label="Crew days"
                    value={`~${quote.aggregated.crew_days} d (${crewSize} crew)`}
                  />
                </div>
                <table className="mt-6 w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-600 text-left text-xs uppercase text-slate-500">
                      <th className="pb-2">Line item</th>
                      <th className="pb-2 text-right">Qty</th>
                      <th className="pb-2 text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {quote.line_items.map((row) => (
                      <tr key={row.id}>
                        <td className="py-2 text-slate-200">{row.description}</td>
                        <td className="py-2 text-right font-mono text-xs text-slate-400">
                          {row.quantity} {row.unit}
                        </td>
                        <td className="py-2 text-right font-mono text-slate-200">
                          {formatZAR(row.cost_zar)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

          </section>
        </>
      )}
    </div>
  );
}

function PhaseSteps({ phase }: { phase: FloorplanPhase }) {
  const steps = [
    { id: "walk" as const, label: "Walk & measure" },
    { id: "locked" as const, label: "Details & quote" },
  ];
  const current = phase === "locked" ? 1 : 0;

  return (
    <nav className="flex flex-wrap gap-2">
      {steps.map((s, i) => (
        <span
          key={s.id}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            i <= current
              ? "bg-vqe-turquoise/20 text-vqe-turquoise"
              : "bg-slate-800 text-slate-500"
          }`}
        >
          {i + 1}. {s.label}
        </span>
      ))}
    </nav>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg bg-charcoal-elevated px-4 py-3">
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p
        className={`mt-1 font-mono text-lg font-semibold ${highlight ? "text-vqe-turquoise" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}
