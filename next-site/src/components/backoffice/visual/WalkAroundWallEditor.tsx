"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  adjustWalkLengthsToClose,
  buildWalkFromTurns,
  CLOSURE_TOLERANCE_M,
  computeWallHeadings,
  createWalkWall,
  orientationLabel,
  pointLabel,
  turnLabel,
  wallLabelFromIndex,
  walkAroundClosure,
  angleToOrientation,
} from "@/lib/wall-assembly-engine";
import type { StartFacing, TurnDirection, WalkWallInput } from "@/types/visual-quote";
import type { WallSegment } from "@/types/visual-quote";

const WalkAroundPreview = dynamic(
  () =>
    import("@/components/backoffice/visual/WalkAroundPreview").then(
      (m) => m.WalkAroundPreview,
    ),
  { ssr: false, loading: () => <div className="h-52 animate-pulse rounded-xl bg-[#1F2937]" /> },
);

const MAX_WALLS = 32;
const MIN_WALLS_TO_LOCK = 3;

type Props = {
  walkInputs: WalkWallInput[];
  onWalkInputsChange: (inputs: WalkWallInput[]) => void;
  startFacing: StartFacing;
  onStartFacingChange: (f: StartFacing) => void;
  onLock: (walls: WallSegment[], meta: { adjusted: boolean; gapBeforeM: number }) => void;
};

const FACING_OPTIONS: { id: StartFacing; label: string }[] = [
  { id: "east", label: "Facing → East" },
  { id: "south", label: "Facing ↓ South" },
  { id: "west", label: "Facing ← West" },
  { id: "north", label: "Facing ↑ North" },
];

export function WalkAroundWallEditor({
  walkInputs,
  onWalkInputsChange,
  startFacing,
  onStartFacingChange,
  onLock,
}: Props) {
  const [stepIndex, setStepIndex] = useState(0);

  const wallCount = walkInputs.length;
  const isOnLatestWall = stepIndex === wallCount - 1;

  const { adjusted, gapBeforeM, gapAfterM, totalAdjustmentM } = useMemo(
    () => adjustWalkLengthsToClose(walkInputs, startFacing),
    [walkInputs, startFacing],
  );

  const rawWalls = useMemo(
    () => buildWalkFromTurns(walkInputs, startFacing, undefined, { allowZeroLength: true }),
    [walkInputs, startFacing],
  );

  const adjustedWalls = useMemo(
    () => buildWalkFromTurns(adjusted, startFacing, undefined, { allowZeroLength: true }),
    [adjusted, startFacing],
  );

  const closure = walkAroundClosure(adjustedWalls);
  const headings = computeWallHeadings(walkInputs, startFacing);
  const current = walkInputs[stepIndex];
  const prevTurn = stepIndex > 0 ? walkInputs[stepIndex - 1]?.turnAfter : undefined;
  const canLock = closure.closed && wallCount >= MIN_WALLS_TO_LOCK;

  function patchWall(index: number, partial: Partial<WalkWallInput>) {
    onWalkInputsChange(
      walkInputs.map((w, i) => (i === index ? { ...w, ...partial } : w)),
    );
  }

  function selectTurn(turn: TurnDirection) {
    const updated = walkInputs.map((w, i) =>
      i === stepIndex ? { ...w, turnAfter: turn } : w,
    );

    if (isOnLatestWall && wallCount < MAX_WALLS) {
      const nextWall = createWalkWall(wallCount);
      onWalkInputsChange([...updated.slice(0, stepIndex + 1), nextWall]);
      setStepIndex(wallCount);
    } else {
      onWalkInputsChange(updated);
    }
  }

  function finishWalkHere() {
    const updated = walkInputs.map((w, i) =>
      i === stepIndex ? { ...w, turnAfter: undefined } : w,
    );
    onWalkInputsChange(updated);
  }

  function goPrev() {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  }

  function resetWalk() {
    onWalkInputsChange([createWalkWall(0)]);
    setStepIndex(0);
  }

  return (
    <section className="vqe-card rounded-xl border p-4 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-vqe-turquoise">
        Walk the unit — corner by corner
      </h3>
      <p className="mt-1 text-sm text-slate-400">
        Start at <strong className="text-white">A1</strong> with Wall A only. Each time you turn a
        corner, the next wall is added automatically.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-600 bg-[#1F2937] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {wallCount} wall{wallCount !== 1 ? "s" : ""} so far
          </p>
          <h4 className="mt-1 font-display text-xl font-semibold text-white">
            {wallLabelFromIndex(stepIndex)}
          </h4>

          {stepIndex === 0 ? (
            <>
              <p className="mt-2 text-sm text-slate-400">
                Standing at <span className="text-vqe-turquoise">A1</span>. Which way are you
                facing?
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {FACING_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onStartFacingChange(f.id)}
                    className={`rounded-lg border px-2 py-2 text-xs font-semibold ${
                      startFacing === f.id
                        ? "border-vqe-turquoise bg-vqe-turquoise/15 text-white"
                        : "border-slate-600 text-slate-400"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Walk <span className="text-vqe-turquoise">A1 → A2</span>{" "}
                ({orientationLabel(angleToOrientation(headings[0] ?? 0))})
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-400">
              At <span className="text-vqe-turquoise">{pointLabel(stepIndex - 1, "2")}</span> you
              turned{" "}
              <span className="text-vqe-turquoise">{prevTurn ? turnLabel(prevTurn) : "—"}</span>.
              Walk <span className="text-vqe-turquoise">{pointLabel(stepIndex, "1")} → {pointLabel(stepIndex, "2")}</span>{" "}
              ({orientationLabel(angleToOrientation(headings[stepIndex] ?? 0))})
            </p>
          )}

          <div className="mt-4">
            <label className="vqe-label">
              {pointLabel(stepIndex, "1")} → {pointLabel(stepIndex, "2")} (metres)
            </label>
            <input
              type="number"
              min={0.5}
              step={0.1}
              value={current?.lengthM || ""}
              placeholder="e.g. 8"
              onChange={(e) => patchWall(stepIndex, { lengthM: Number(e.target.value) })}
              className="vqe-input mt-1 w-full text-lg font-mono"
            />
            {totalAdjustmentM > 0 && adjusted[stepIndex]?.lengthM !== current?.lengthM && (
              <p className="mt-1 text-xs text-slate-500">
                Adjusted to close:{" "}
                <span className="font-mono text-vqe-turquoise">
                  {adjusted[stepIndex]?.lengthM} m
                </span>
              </p>
            )}
          </div>

          {isOnLatestWall && (current?.lengthM ?? 0) > 0 && wallCount < MAX_WALLS && (
            <div className="mt-4">
              {canLock && (
                <p className="mb-2 text-sm text-vqe-turquoise">
                  ✓ Shape closes at A1 — lock when ready, or keep walking for more walls
                </p>
              )}
              <label className="vqe-label">
                At {pointLabel(stepIndex, "2")} — turn to add{" "}
                {wallLabelFromIndex(stepIndex + 1)}
              </label>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => selectTurn("left")}
                  className="flex-1 rounded-lg border px-3 py-3 text-sm font-semibold border-slate-600 text-slate-400 hover:border-vqe-turquoise hover:text-white"
                >
                  ↺ Left 90°
                </button>
                <button
                  type="button"
                  onClick={() => selectTurn("right")}
                  className="flex-1 rounded-lg border px-3 py-3 text-sm font-semibold border-slate-600 text-slate-400 hover:border-vqe-turquoise hover:text-white"
                >
                  ↻ Right 90°
                </button>
              </div>
            </div>
          )}

          {canLock && isOnLatestWall && wallCount >= MAX_WALLS && (
            <p className="mt-4 text-sm text-vqe-turquoise">
              ✓ Back at A1 — you can lock the floorplan
            </p>
          )}

          {!canLock && isOnLatestWall && wallCount >= MIN_WALLS_TO_LOCK && (
            <p className="mt-4 text-xs text-slate-400">
              Gap to A1: {gapAfterM} m — keep walking or tweak lengths
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={stepIndex === 0}
              className="vqe-btn-secondary rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-40"
            >
              ← Previous
            </button>
            {canLock && (
              <button
                type="button"
                onClick={() => {
                  finishWalkHere();
                  onLock(adjustedWalls, { adjusted: totalAdjustmentM > 0, gapBeforeM });
                }}
                className="vqe-btn-primary ml-auto rounded-lg px-4 py-2 text-sm font-semibold"
              >
                Lock floorplan
              </button>
            )}
            <button
              type="button"
              onClick={resetWalk}
              className="text-xs text-slate-500 hover:text-white"
            >
              Start over
            </button>
          </div>

          {gapBeforeM > CLOSURE_TOLERANCE_M && wallCount >= 2 && (
            <p className="mt-3 text-xs text-slate-400">
              Raw gap: {gapBeforeM} m
              {totalAdjustmentM > 0 && (
                <> → adjusted to {gapAfterM} m</>
              )}
            </p>
          )}

          {wallCount > 1 && (
            <div className="mt-6 flex flex-wrap gap-1">
              {walkInputs.map((_, i) => (
                <button
                  key={walkInputs[i].id}
                  type="button"
                  onClick={() => setStepIndex(i)}
                  className={`h-8 w-8 rounded-full text-xs font-bold ${
                    stepIndex === i
                      ? "bg-vqe-turquoise text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <WalkAroundPreview walls={rawWalls} activeWallIndex={stepIndex} />
          <dl className="mt-3 space-y-1 text-xs text-slate-400">
            <div>
              Total measured:{" "}
              <span className="font-mono text-white">
                {walkInputs.reduce((s, w) => s + (w.lengthM || 0), 0).toFixed(1)} m
              </span>
            </div>
            <div>
              {canLock ? (
                <span className="text-vqe-turquoise">Closes at A1</span>
              ) : wallCount < MIN_WALLS_TO_LOCK ? (
                <span>Need at least {MIN_WALLS_TO_LOCK} walls to close a shape</span>
              ) : (
                <span>Gap: {gapAfterM} m</span>
              )}
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
