import { distance2D } from "@/lib/geometry-engine";
import type { FootprintVertex, Point2D, RidgeLine } from "@/types/visual-quote";

export const RIDGE_SNAP_M = 0.5;
export const MIN_RIDGE_LENGTH_M = 0.5;
export const ROOF_SNAP_VERTEX_M = 0.4;

export function ridgeLabel(index: number): string {
  return `R${index + 1}`;
}

export function ridgeLineLengthM(ridge: RidgeLine): number {
  return distance2D(ridge.start, ridge.end);
}

export function totalRidgeLengthLm(ridges: RidgeLine[]): number {
  return ridges.reduce((sum, r) => sum + ridgeLineLengthM(r), 0);
}

export function snapMetreCoord(value: number, step = RIDGE_SNAP_M): number {
  return Math.round(value / step) * step;
}

export function snapPoint(p: Point2D, step = RIDGE_SNAP_M): Point2D {
  return { x: snapMetreCoord(p.x, step), y: snapMetreCoord(p.y, step) };
}

function snapToVertices(
  p: Point2D,
  vertices: FootprintVertex[],
  thresholdM: number,
): Point2D | null {
  let best: Point2D | null = null;
  let bestD = thresholdM;
  for (const v of vertices) {
    const d = distance2D(p, v);
    if (d < bestD) {
      bestD = d;
      best = { x: v.x, y: v.y };
    }
  }
  return best;
}

function snapToEdges(
  p: Point2D,
  vertices: FootprintVertex[],
  thresholdM: number,
): Point2D | null {
  let best: Point2D | null = null;
  let bestD = thresholdM;
  for (let i = 0; i < vertices.length; i++) {
    const a = vertices[i];
    const b = vertices[(i + 1) % vertices.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lenSq = dx * dx + dy * dy;
    if (lenSq < 1e-9) continue;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
    const px = a.x + t * dx;
    const py = a.y + t * dy;
    const d = distance2D(p, { x: px, y: py });
    if (d < bestD) {
      bestD = d;
      best = { x: snapMetreCoord(px), y: snapMetreCoord(py) };
    }
  }
  return best;
}

/** Snap click to grid, then roof outline corners / edges */
export function snapToRoofPlan(
  raw: Point2D,
  roofOutline: FootprintVertex[],
  footprint: FootprintVertex[],
): Point2D {
  const grid = snapPoint(raw);
  const allVerts = [...roofOutline, ...footprint];
  return (
    snapToVertices(grid, allVerts, ROOF_SNAP_VERTEX_M) ??
    snapToEdges(grid, roofOutline, ROOF_SNAP_VERTEX_M) ??
    grid
  );
}

export function createRidgeLine(start: Point2D, end: Point2D, index: number): RidgeLine {
  return {
    id: `ridge-${Date.now().toString(36)}-${index}`,
    kind: "ridge",
    start: snapPoint(start),
    end: snapPoint(end),
  };
}
