/**
 * Headless architectural geometry engine.
 * Processes 2D footprint vertices → wall areas, roof surface, linear joints.
 * Blueprint: Visual Quoting Engine Architecture (June 2026).
 */

import ClipperLib from "clipper-lib";
import type {
  ApertureSpec,
  FootprintVertex,
  LinearJoints,
  Point2D,
  RoofStructuralStyle,
  WallGeometry,
} from "@/types/visual-quote";

/** Clipper uses integer coords — scale metres to sub-mm precision */
const CLIPPER_SCALE = 10000;

/** Standard double-brick exterior wall thickness (m) */
export const DEFAULT_WALL_THICKNESS_M = 0.22;

/** Pixel snap threshold for mobile floorplan nodes */
export const NODE_SNAP_THRESHOLD_PX = 18;

export function distance2D(a: Point2D, b: Point2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Shoelace formula — signed area in m² (absolute returned) */
export function polygonAreaSqm(vertices: FootprintVertex[]): number {
  if (vertices.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    sum += vertices[i].x * vertices[j].y;
    sum -= vertices[j].x * vertices[i].y;
  }
  return Math.abs(sum) / 2;
}

/** Signed shoelace area — positive = counter-clockwise */
export function signedPolygonArea(vertices: FootprintVertex[]): number {
  if (vertices.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    sum += vertices[i].x * vertices[j].y;
    sum -= vertices[j].x * vertices[i].y;
  }
  return sum / 2;
}

function lineIntersection(a1: Point2D, a2: Point2D, b1: Point2D, b2: Point2D): Point2D | null {
  const dxa = a2.x - a1.x;
  const dya = a2.y - a1.y;
  const dxb = b2.x - b1.x;
  const dyb = b2.y - b1.y;
  const denom = dxa * dyb - dya * dxb;
  if (Math.abs(denom) < 1e-9) return null;
  const t = ((b1.x - a1.x) * dyb - (b1.y - a1.y) * dxb) / denom;
  return { x: a1.x + t * dxa, y: a1.y + t * dya };
}

/**
 * Parallel edge offset — reliable for L-shaped and concave footprints.
 */
export function offsetPolygonByEdges(
  vertices: FootprintVertex[],
  distanceM: number,
): FootprintVertex[] {
  if (vertices.length < 3 || distanceM <= 0) return vertices;

  const n = vertices.length;
  const ccw = signedPolygonArea(vertices) >= 0;

  type OffsetLine = { p1: Point2D; p2: Point2D };
  const lines: OffsetLine[] = [];

  for (let i = 0; i < n; i++) {
    const a = vertices[i];
    const b = vertices[(i + 1) % n];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = (ccw ? 1 : -1) * (dy / len);
    const ny = (ccw ? -1 : 1) * (dx / len);
    lines.push({
      p1: { x: a.x + nx * distanceM, y: a.y + ny * distanceM },
      p2: { x: b.x + nx * distanceM, y: b.y + ny * distanceM },
    });
  }

  const result: FootprintVertex[] = [];
  for (let i = 0; i < n; i++) {
    const prev = lines[(i - 1 + n) % n];
    const curr = lines[i];
    const hit = lineIntersection(prev.p1, prev.p2, curr.p1, curr.p2);
    if (hit) {
      result.push(roundPoint(hit));
    } else {
      result.push(roundPoint(curr.p1));
    }
  }

  return result;
}

function roundCoord(n: number, d = 2): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

function roundPoint(p: Point2D): FootprintVertex {
  return { x: roundCoord(p.x), y: roundCoord(p.y) };
}

/** Perimeter by summing edge lengths (m) */
export function polygonPerimeterLm(vertices: FootprintVertex[]): number {
  if (vertices.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    total += distance2D(vertices[i], vertices[j]);
  }
  return total;
}

/**
 * Roof pitch factor Pf from degrees: Pf = sec(θ) = 1 / cos(θ)
 * Blueprint § Roof Surface Area Mathematics
 */
export function roofPitchFactorFromDegrees(pitchDegrees: number): number {
  const rad = (pitchDegrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  if (cos <= 0.001) return 1;
  return 1 / cos;
}

/**
 * Expand footprint outward by overhang using Clipper (true parallel offset).
 * Falls back to centroid scaling if offset fails.
 */
export function offsetPolygonOutward(
  vertices: FootprintVertex[],
  distanceM: number,
): FootprintVertex[] {
  if (vertices.length < 3 || distanceM <= 0) return vertices;
  return offsetPolygonByEdges(vertices, distanceM);
}

function expandFootprintByOverhangFallback(
  vertices: FootprintVertex[],
  overhangM: number,
): FootprintVertex[] {
  const minX = Math.min(...vertices.map((v) => v.x));
  const maxX = Math.max(...vertices.map((v) => v.x));
  const minY = Math.min(...vertices.map((v) => v.y));
  const maxY = Math.max(...vertices.map((v) => v.y));
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return vertices.map((v) => {
    const dx = v.x - cx;
    const dy = v.y - cy;
    const scale = 1 + overhangM / Math.max(maxX - minX, maxY - minY, 0.001);
    return { x: cx + dx * scale, y: cy + dy * scale };
  });
}

/**
 * Expand axis-aligned bounding box footprint by overhang (m).
 * @deprecated Prefer offsetPolygonOutward for irregular polygons
 */
export function expandFootprintByOverhang(
  vertices: FootprintVertex[],
  overhangM: number,
): FootprintVertex[] {
  if (vertices.length < 3 || overhangM <= 0) return vertices;
  return offsetPolygonOutward(vertices, overhangM);
}

/** True roof surface area = expanded footprint area × pitch factor */
export function roofSurfaceAreaSqm(
  footprintVertices: FootprintVertex[],
  overhangM: number,
  pitchDegrees: number,
  style: RoofStructuralStyle,
): number {
  const expanded = expandFootprintByOverhang(footprintVertices, overhangM);
  const planArea = polygonAreaSqm(expanded);
  if (style === "flat") return planArea;
  const pf = roofPitchFactorFromDegrees(pitchDegrees);
  const hipFactor = style === "hip" ? 1.04 : 1;
  return planArea * pf * hipFactor;
}

/**
 * Linear joints for waterproofing — ridges, hips, valleys, parapets.
 * Blueprint § Linear Mathematics for Ridges, Valleys, and Parapets
 */
export function calculateLinearJoints(
  vertices: FootprintVertex[],
  overhangM: number,
  pitchDegrees: number,
  style: RoofStructuralStyle,
): LinearJoints {
  const expanded = expandFootprintByOverhang(vertices, overhangM);

  if (vertices.length < 3) {
    return { ridges_lm: 0, hips_lm: 0, valleys_lm: 0, parapets_lm: 0 };
  }

  const minX = Math.min(...expanded.map((v) => v.x));
  const maxX = Math.max(...expanded.map((v) => v.x));
  const minY = Math.min(...expanded.map((v) => v.y));
  const maxY = Math.max(...expanded.map((v) => v.y));
  const lengthM = maxX - minX;
  const widthM = maxY - minY;

  if (style === "flat") {
    return {
      ridges_lm: 0,
      hips_lm: 0,
      valleys_lm: 0,
      parapets_lm: polygonPerimeterLm(vertices),
    };
  }

  const pf = roofPitchFactorFromDegrees(pitchDegrees);

  if (style === "gable") {
    const ridgeLm = Math.max(0, lengthM - widthM + 2 * overhangM);
    return {
      ridges_lm: ridgeLm,
      hips_lm: 0,
      valleys_lm: 0,
      parapets_lm: 0,
    };
  }

  // Hip roof
  const ridgeLm = Math.max(0, lengthM - widthM);
  const hipRun = widthM / 2;
  const hipRafterLm = hipRun * pf;
  const totalHipLm = 4 * hipRafterLm;

  // L-shape valley heuristic: internal reflex vertices
  const valleysLm = countReflexVertices(vertices) > 0 ? hipRafterLm * 2 : 0;

  return {
    ridges_lm: ridgeLm,
    hips_lm: totalHipLm,
    valleys_lm: valleysLm,
    parapets_lm: 0,
  };
}

function countReflexVertices(vertices: FootprintVertex[]): number {
  if (vertices.length < 4) return 0;
  let reflex = 0;
  for (let i = 0; i < vertices.length; i++) {
    const prev = vertices[(i - 1 + vertices.length) % vertices.length];
    const curr = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    const cross =
      (curr.x - prev.x) * (next.y - curr.y) - (curr.y - prev.y) * (next.x - curr.x);
    if (cross < 0) reflex++;
  }
  return reflex;
}

export function totalLinearJointsLm(joints: LinearJoints): number {
  return joints.ridges_lm + joints.hips_lm + joints.valleys_lm + joints.parapets_lm;
}

/**
 * Net wall area: Perimeter × Height − Aperture Area
 * Plaster treatable = net × plaster_ratio (applied per wall or globally)
 */
export function netWallAreaSqm(
  perimeterLm: number,
  heightM: number,
  apertureAreaSqm: number,
): number {
  return Math.max(0, perimeterLm * heightM - apertureAreaSqm);
}

export function apertureAreaSqm(apertures: ApertureSpec[]): number {
  return apertures.reduce((s, a) => s + a.widthM * a.heightM, 0);
}

/** Build per-edge wall records from closed polygon */
export function buildWallSegments(
  vertices: FootprintVertex[],
  heightM: number,
  apertures: ApertureSpec[],
  plasterRatio: number,
): WallGeometry[] {
  const facebrickRatio = 1 - plasterRatio;
  const walls: WallGeometry[] = [];

  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    const lengthM = distance2D(vertices[i], vertices[j]);
    const gross = lengthM * heightM;
    const wallApertures = apertures.filter((a) => a.wallIndex === i);
    const openArea = wallApertures.reduce((s, a) => s + a.widthM * a.heightM, 0);
    const net = Math.max(0, gross - openArea);

    walls.push({
      wall_id: `wall-${i}`,
      length_m: round(lengthM),
      height_m: round(heightM),
      gross_area_sqm: round(gross),
      apertures_area_sqm: round(openArea),
      net_area_sqm: round(net),
      finishes: {
        facebrick_ratio: round(facebrickRatio, 3),
        plaster_ratio: round(plasterRatio, 3),
      },
    });
  }

  return walls;
}

/**
 * Offset centerline path into closed wall polygon via clipper-lib.
 * Avoids Turf.js self-intersection artifacts (blueprint mandate).
 */
export function offsetFootprintToWallPolygon(
  vertices: FootprintVertex[],
  wallThicknessM: number = DEFAULT_WALL_THICKNESS_M,
): FootprintVertex[] {
  if (vertices.length < 3) return vertices;

  const path: ClipperLib.Path = vertices.map((v) => ({
    X: Math.round(v.x * CLIPPER_SCALE),
    Y: Math.round(v.y * CLIPPER_SCALE),
  }));

  const co = new ClipperLib.ClipperOffset();
  co.AddPath(path, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);

  const solution: ClipperLib.Paths = [];
  co.Execute(solution, (wallThicknessM / 2) * CLIPPER_SCALE);

  if (!solution.length || !solution[0].length) return vertices;

  return solution[0].map((p) => ({
    x: p.X / CLIPPER_SCALE,
    y: p.Y / CLIPPER_SCALE,
  }));
}

/** Snap dragged node to nearest other node if within threshold (metres) */
export function snapNodeToNearest(
  point: Point2D,
  nodes: Point2D[],
  excludeIndex: number,
  thresholdM: number,
): Point2D {
  let best: Point2D = point;
  let bestDist = thresholdM;

  nodes.forEach((n, i) => {
    if (i === excludeIndex) return;
    const d = distance2D(point, n);
    if (d < bestDist) {
      bestDist = d;
      best = { x: n.x, y: n.y };
    }
  });

  return best;
}

/** Convert pixel coords to metres given scale (px per metre) */
export function pxToMetres(px: number, pxPerMetre: number): number {
  return px / pxPerMetre;
}

export function metresToPx(m: number, pxPerMetre: number): number {
  return m * pxPerMetre;
}

/** Pinch-zoom: Euclidean distance between two touches */
export function touchDistance(t1: { clientX: number; clientY: number }, t2: { clientX: number; clientY: number }): number {
  return Math.sqrt(
    (t2.clientX - t1.clientX) ** 2 + (t2.clientY - t1.clientY) ** 2,
  );
}

export function touchMidpoint(
  t1: { clientX: number; clientY: number },
  t2: { clientX: number; clientY: number },
): { x: number; y: number } {
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  };
}

function round(n: number, d = 2): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

/** Full geometry pass from floorplan inputs → BaseUnitGeometry partial */
export function computeGeometryFromFootprint(params: {
  vertices: FootprintVertex[];
  wallHeightM: number;
  apertures: ApertureSpec[];
  roofStyle: RoofStructuralStyle;
  roofPitchDeg: number;
  roofOverhangM: number;
  facadePlasterRatio: number;
}) {
  const {
    vertices,
    wallHeightM,
    apertures,
    roofStyle,
    roofPitchDeg,
    roofOverhangM,
    facadePlasterRatio,
  } = params;

  const footprintArea = polygonAreaSqm(vertices);
  const perimeter = polygonPerimeterLm(vertices);
  const offsetVertices = offsetFootprintToWallPolygon(vertices);
  const openArea = apertureAreaSqm(apertures);
  const netWall = netWallAreaSqm(perimeter, wallHeightM, openArea);
  const netPlaster = netWall * facadePlasterRatio;

  const walls = buildWallSegments(vertices, wallHeightM, apertures, facadePlasterRatio);
  const pitchFactor = roofStyle === "flat" ? 1 : roofPitchFactorFromDegrees(roofPitchDeg);
  const linearJoints = calculateLinearJoints(vertices, roofOverhangM, roofPitchDeg, roofStyle);
  const roofArea = roofSurfaceAreaSqm(vertices, roofOverhangM, roofPitchDeg, roofStyle);

  return {
    footprint: {
      area_sqm: round(footprintArea),
      perimeter_lm: round(perimeter),
      vertices,
      offset_vertices: offsetVertices,
    },
    walls,
    wall_height_m: wallHeightM,
    net_plaster_area_sqm: round(netPlaster),
    net_wall_area_sqm: round(netWall),
    total_aperture_area_sqm: round(openArea),
    roof: {
      structural_style: roofStyle,
      pitch_degrees: roofPitchDeg,
      pitch_factor: round(pitchFactor, 4),
      overhang_m: roofOverhangM,
      surface_area_sqm: round(roofArea),
      linear_joints: {
        ridges_lm: round(linearJoints.ridges_lm),
        hips_lm: round(linearJoints.hips_lm),
        valleys_lm: round(linearJoints.valleys_lm),
        parapets_lm: round(linearJoints.parapets_lm),
      },
    },
  };
}
