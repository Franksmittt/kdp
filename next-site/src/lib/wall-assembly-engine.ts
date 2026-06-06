/**
 * Walk-around floorplan — A1 start, walk to A2, turn left/right 90°, repeat.
 * Auto-balances wall lengths so F2 connects back to A1.
 */

import type {
  FootprintVertex,
  Point2D,
  StartFacing,
  TurnDirection,
  WalkWallInput,
  WallOrientation,
  WallSegment,
} from "@/types/visual-quote";

export const CLOSURE_TOLERANCE_M = 0.25;

const FACING_DEG: Record<StartFacing, number> = {
  east: 0,
  south: 90,
  west: 180,
  north: 270,
};

const ORIENT_CYCLE: WallOrientation[] = ["east", "south", "west", "north"];

export function wallLabelFromIndex(index: number): string {
  return `Wall ${String.fromCharCode(65 + index)}`;
}

export function pointLabel(wallIndex: number, end: "1" | "2"): string {
  return `${String.fromCharCode(65 + wallIndex)}${end}`;
}

export function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function turnAngle(angleDeg: number, turn: TurnDirection): number {
  return normalizeAngle(turn === "right" ? angleDeg + 90 : angleDeg - 90);
}

export function angleToOrientation(deg: number): WallOrientation {
  const d = normalizeAngle(Math.round(deg / 90) * 90);
  if (d === 0) return "east";
  if (d === 90) return "south";
  if (d === 180) return "west";
  return "north";
}

export function orientationLabel(o: WallOrientation): string {
  switch (o) {
    case "east":
      return "→ East";
    case "west":
      return "← West";
    case "south":
      return "↓ South";
    case "north":
      return "↑ North";
  }
}

export function turnLabel(turn: TurnDirection): string {
  return turn === "right" ? "90° right (clockwise)" : "90° left (counter-clockwise)";
}

export function getWallEndpoints(wall: WallSegment): { start: Point2D; end: Point2D } {
  const start = { x: wall.startX, y: wall.startY };
  const len = wall.lengthM;
  switch (wall.orientation) {
    case "east":
      return { start, end: { x: start.x + len, y: start.y } };
    case "west":
      return { start, end: { x: start.x - len, y: start.y } };
    case "south":
      return { start, end: { x: start.x, y: start.y + len } };
    case "north":
      return { start, end: { x: start.x, y: start.y - len } };
    default:
      return { start, end: { x: start.x + len, y: start.y } };
  }
}

/** Heading in degrees for each wall segment from start facing + turns */
export function computeWallHeadings(
  inputs: WalkWallInput[],
  startFacing: StartFacing,
): number[] {
  let angle = FACING_DEG[startFacing];
  const headings: number[] = [];
  for (const w of inputs) {
    headings.push(angle);
    if (w.turnAfter) angle = turnAngle(angle, w.turnAfter);
  }
  return headings;
}

function endpointFromLengths(lengths: number[], headings: number[]): Point2D {
  let x = 0;
  let y = 0;
  for (let i = 0; i < lengths.length; i++) {
    const rad = (headings[i] * Math.PI) / 180;
    x += lengths[i] * Math.cos(rad);
    y += lengths[i] * Math.sin(rad);
  }
  return { x, y };
}

export function computeWalkGapM(
  inputs: WalkWallInput[],
  startFacing: StartFacing,
  lengths?: number[],
): number {
  const lens = lengths ?? inputs.map((w) => w.lengthM);
  const headings = computeWallHeadings(inputs, startFacing);
  const end = endpointFromLengths(lens, headings);
  return round(Math.hypot(end.x, end.y), 2);
}

type Cardinal = "E" | "W" | "S" | "N";

function headingToCardinal(deg: number): Cardinal {
  return angleToOrientation(deg) === "east"
    ? "E"
    : angleToOrientation(deg) === "west"
      ? "W"
      : angleToOrientation(deg) === "south"
        ? "S"
        : "N";
}

/**
 * Distribute closure error across walls on each axis (E/W and S/N).
 * Measurements are approximate — this nudges lengths so F2 meets A1.
 */
export function adjustWalkLengthsToClose(
  inputs: WalkWallInput[],
  startFacing: StartFacing,
): {
  adjusted: WalkWallInput[];
  gapBeforeM: number;
  gapAfterM: number;
  totalAdjustmentM: number;
} {
  const headings = computeWallHeadings(inputs, startFacing);
  const lengths = inputs.map((w) => w.lengthM);
  const gapBeforeM = computeWalkGapM(inputs, startFacing, lengths);

  if (gapBeforeM <= CLOSURE_TOLERANCE_M) {
    return {
      adjusted: inputs,
      gapBeforeM,
      gapAfterM: gapBeforeM,
      totalAdjustmentM: 0,
    };
  }

  const adjustedLengths = [...lengths];

  function balanceAxis(positive: Cardinal, negative: Cardinal) {
    const buckets: Record<Cardinal, number[]> = { E: [], W: [], S: [], N: [] };
    const sums: Record<Cardinal, number> = { E: 0, W: 0, S: 0, N: 0 };
    for (let i = 0; i < headings.length; i++) {
      const c = headingToCardinal(headings[i]);
      buckets[c].push(i);
      sums[c] += adjustedLengths[i];
    }
    const err = sums[positive] - sums[negative];
    if (Math.abs(err) < 0.001) return;

    if (err > 0 && sums[positive] > 0) {
      const factor = (sums[positive] - err) / sums[positive];
      buckets[positive].forEach((i) => {
        adjustedLengths[i] = round(Math.max(0.1, adjustedLengths[i] * factor), 2);
      });
    } else if (err < 0 && sums[negative] > 0) {
      const factor = (sums[negative] + err) / sums[negative];
      buckets[negative].forEach((i) => {
        adjustedLengths[i] = round(Math.max(0.1, adjustedLengths[i] * factor), 2);
      });
    }
  }

  balanceAxis("E", "W");
  balanceAxis("S", "N");

  const gapAfterM = computeWalkGapM(inputs, startFacing, adjustedLengths);
  let totalAdjustmentM = 0;
  lengths.forEach((l, i) => {
    totalAdjustmentM += Math.abs(adjustedLengths[i] - l);
  });

  const adjusted = inputs.map((w, i) => ({
    ...w,
    lengthM: adjustedLengths[i],
  }));

  return {
    adjusted,
    gapBeforeM,
    gapAfterM,
    totalAdjustmentM: round(totalAdjustmentM, 2),
  };
}

export const PREVIEW_PX_PER_METRE = 24;

export function buildWalkFromTurns(
  inputs: WalkWallInput[],
  startFacing: StartFacing,
  lengthsOverride?: number[],
  options?: { allowZeroLength?: boolean },
): WallSegment[] {
  let x = 0;
  let y = 0;
  let angle = FACING_DEG[startFacing];

  return inputs.map((w, i) => {
    const raw = lengthsOverride?.[i] ?? w.lengthM;
    const lengthM = options?.allowZeroLength ? raw : Math.max(0.1, raw);
    const orientation = angleToOrientation(angle);
    const seg: WallSegment = {
      id: w.id,
      label: w.label,
      lengthM,
      startX: round(x),
      startY: round(y),
      orientation,
    };
    const { end } = getWallEndpoints(seg);
    x = end.x;
    y = end.y;
    if (w.turnAfter) angle = turnAngle(angle, w.turnAfter);
    return seg;
  });
}

export type WalkClosure = {
  closed: boolean;
  gapM: number;
  lastPoint: Point2D;
  firstPoint: Point2D;
};

export function walkAroundClosure(walls: WallSegment[]): WalkClosure {
  if (walls.length < 3) {
    return {
      closed: false,
      gapM: Infinity,
      lastPoint: { x: 0, y: 0 },
      firstPoint: { x: 0, y: 0 },
    };
  }
  const firstPoint = getWallEndpoints(walls[0]).start;
  const lastPoint = getWallEndpoints(walls[walls.length - 1]).end;
  const gapM = Math.hypot(lastPoint.x - firstPoint.x, lastPoint.y - firstPoint.y);
  return {
    closed: gapM <= CLOSURE_TOLERANCE_M,
    gapM: round(gapM, 2),
    lastPoint,
    firstPoint,
  };
}

export type FootprintExtractResult = {
  vertices: FootprintVertex[];
  wallOrder: string[];
  closed: boolean;
};

export function extractFootprintFromWalkAround(
  walls: WallSegment[],
): FootprintExtractResult | null {
  const closure = walkAroundClosure(walls);
  if (!closure.closed || walls.length < 3) return null;

  const vertices: FootprintVertex[] = walls.map((w) => {
    const { start } = getWallEndpoints(w);
    return { x: round(start.x), y: round(start.y) };
  });

  return {
    vertices,
    wallOrder: walls.map((w) => w.id),
    closed: true,
  };
}

export function extractFootprintFromWalls(walls: WallSegment[]) {
  return extractFootprintFromWalkAround(walls);
}

export function isFloorplanClosed(walls: WallSegment[]): boolean {
  return walkAroundClosure(walls).closed;
}

export function createWalkWall(index: number): WalkWallInput {
  return {
    id: `wall-${index}-${Date.now().toString(36)}`,
    label: wallLabelFromIndex(index),
    lengthM: 0,
  };
}

/** Start the walk with Wall A only — more walls added as you turn each corner */
export function initialWalkState(): WalkWallInput[] {
  return [createWalkWall(0)];
}

export function defaultWalkInputs(count: number): WalkWallInput[] {
  if (count <= 1) return initialWalkState();
  const defaultLengths = [8, 2, 10, 2, 8, 2, 4, 6, 3, 7, 5, 9];
  const defaultTurn: TurnDirection = "right";

  return Array.from({ length: count }, (_, i) => ({
    id: `wall-${i}`,
    label: wallLabelFromIndex(i),
    lengthM: defaultLengths[i] ?? 4,
    turnAfter: i < count - 1 ? defaultTurn : undefined,
  }));
}

export function defaultWallLengths(count: number): number[] {
  return defaultWalkInputs(count).map((w) => w.lengthM);
}

export function defaultWallPresets(count = 4) {
  return defaultWalkInputs(count).map((w) => ({
    id: w.id,
    label: w.label,
    lengthM: w.lengthM,
  }));
}

export function wallIdToFootprintIndex(wallId: string, walls: WallSegment[]): number {
  const idx = walls.findIndex((w) => w.id === wallId);
  return idx >= 0 ? idx : 0;
}

function round(n: number, d = 2): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

// Legacy stubs
export function buildWalkAroundWalls(lengthsM: number[], _firstHorizontal: boolean) {
  const inputs = defaultWalkInputs(lengthsM.length).map((w, i) => ({
    ...w,
    lengthM: lengthsM[i] ?? w.lengthM,
  }));
  return buildWalkFromTurns(inputs, "east");
}

export function orientationForWalkIndex(index: number, firstWallHorizontal: boolean) {
  const base = firstWallHorizontal ? 0 : 1;
  return ORIENT_CYCLE[(base + index) % 4];
}

export function scatterWallsForAssembly(presets: { id: string; label: string; lengthM: number }[]) {
  const inputs = presets.map((p, i) => ({
    ...defaultWalkInputs(presets.length)[i],
    ...p,
    turnAfter: i < presets.length - 1 ? ("right" as TurnDirection) : undefined,
  }));
  return buildWalkFromTurns(inputs, "east");
}

export function toggleWallOrientation(w: WallSegment) {
  const i = ORIENT_CYCLE.indexOf(w.orientation);
  return { ...w, orientation: ORIENT_CYCLE[(i + 1) % 4] };
}

export function snapWallMagnetic(w: WallSegment) {
  return w;
}

export function findSnapPreview() {
  return null;
}

export function moveWall(w: WallSegment, dx: number, dy: number) {
  return { ...w, startX: w.startX + dx, startY: w.startY + dy };
}

export function collectMagnetTargets(): Point2D[] {
  return [];
}
