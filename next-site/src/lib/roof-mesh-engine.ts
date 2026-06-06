import { offsetPolygonOutward } from "@/lib/geometry-engine";
import type { FootprintVertex, Point2D, RidgeLine, RoofStructuralStyle } from "@/types/visual-quote";
import * as THREE from "three";

export type RoofMeshParams = {
  footprint: FootprintVertex[];
  wallHeightM: number;
  pitchDeg: number;
  overhangM: number;
  style: RoofStructuralStyle;
  ridgeLines: RidgeLine[];
};

function perpendicularDistanceToSegment(p: Point2D, a: Point2D, b: Point2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-9) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
  const px = a.x + t * dx;
  const py = a.y + t * dy;
  return Math.hypot(p.x - px, p.y - py);
}

function minDistanceToPolygonEdges(p: Point2D, outline: FootprintVertex[]): number {
  let min = Infinity;
  for (let i = 0; i < outline.length; i++) {
    const a = outline[i];
    const b = outline[(i + 1) % outline.length];
    min = Math.min(min, perpendicularDistanceToSegment(p, a, b));
  }
  return min;
}

/** Height from drawn ridge/hip lines — peaks on lines, eaves at roof outline edge */
function heightFromDrawnLines(
  p: Point2D,
  outline: FootprintVertex[],
  ridges: RidgeLine[],
  pitchDeg: number,
  wallH: number,
): number {
  const tanP = Math.tan((pitchDeg * Math.PI) / 180);
  const dEave = minDistanceToPolygonEdges(p, outline);
  let dRidge = Infinity;
  for (const r of ridges) {
    dRidge = Math.min(dRidge, perpendicularDistanceToSegment(p, r.start, r.end));
  }
  return wallH + tanP * Math.max(0, dEave - dRidge);
}

export function roofHeightAtPoint(
  p: Point2D,
  outline: FootprintVertex[],
  pitchDeg: number,
  wallH: number,
  style: RoofStructuralStyle,
  ridgeLines: RidgeLine[],
): number {
  if (style === "flat") return wallH + 0.08;
  if (ridgeLines.length === 0) return wallH;
  return heightFromDrawnLines(p, outline, ridgeLines, pitchDeg, wallH);
}

function verticesToShape(verts: FootprintVertex[]): THREE.Shape {
  const shape = new THREE.Shape();
  if (verts.length < 3) return shape;
  shape.moveTo(verts[0].x, verts[0].y);
  for (let i = 1; i < verts.length; i++) {
    shape.lineTo(verts[i].x, verts[i].y);
  }
  shape.closePath();
  return shape;
}

export function buildRoofGeometry(params: RoofMeshParams): THREE.BufferGeometry | null {
  const { footprint, wallHeightM, pitchDeg, overhangM, style, ridgeLines } = params;
  if (footprint.length < 3) return null;

  const outline =
    overhangM > 0 ? offsetPolygonOutward(footprint, overhangM) : footprint;

  if (style === "flat") {
    const shape = verticesToShape(outline);
    const geom = new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: false });
    geom.rotateX(-Math.PI / 2);
    geom.translate(0, wallHeightM, 0);
    geom.computeVertexNormals();
    return geom;
  }

  if (ridgeLines.length === 0) return null;

  const shape = verticesToShape(outline);
  const geom = new THREE.ShapeGeometry(shape);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const fpY = pos.getY(i);
    const h = roofHeightAtPoint(
      { x, y: fpY },
      outline,
      pitchDeg,
      wallHeightM,
      style,
      ridgeLines,
    );
    pos.setXYZ(i, x, h, -fpY);
  }

  pos.needsUpdate = true;
  geom.computeVertexNormals();
  return geom;
}

export function buildRidgeCapLines(
  params: RoofMeshParams,
): { start: THREE.Vector3; end: THREE.Vector3 }[] {
  const { footprint, wallHeightM, pitchDeg, overhangM, style, ridgeLines } = params;
  if (style === "flat" || ridgeLines.length === 0 || footprint.length < 3) return [];

  const outline =
    overhangM > 0 ? offsetPolygonOutward(footprint, overhangM) : footprint;

  return ridgeLines.map((ridge) => {
    const h0 = roofHeightAtPoint(ridge.start, outline, pitchDeg, wallHeightM, style, ridgeLines);
    const h1 = roofHeightAtPoint(ridge.end, outline, pitchDeg, wallHeightM, style, ridgeLines);
    return {
      start: new THREE.Vector3(ridge.start.x, h0 + 0.04, -ridge.start.y),
      end: new THREE.Vector3(ridge.end.x, h1 + 0.04, -ridge.end.y),
    };
  });
}
