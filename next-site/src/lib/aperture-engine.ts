import type { ApertureSpec, ApertureType } from "@/types/visual-quote";

export const APERTURE_CATALOG: Record<
  ApertureType,
  { label: string; widthM: number; heightM: number; sillHeightM: number; color: string }
> = {
  window: {
    label: "Window",
    widthM: 1.2,
    heightM: 1.2,
    sillHeightM: 1.0,
    color: "#38BDF8",
  },
  door: {
    label: "Door",
    widthM: 0.9,
    heightM: 2.1,
    sillHeightM: 0,
    color: "#A78BFA",
  },
  sliding_door: {
    label: "Sliding door",
    widthM: 1.8,
    heightM: 2.1,
    sillHeightM: 0,
    color: "#34D399",
  },
};

export const ELEVATION_PX_PER_M = 28;
export const ELEVATION_SNAP_M = 0.1;

export function snapElevationM(value: number): number {
  return Math.round(value / ELEVATION_SNAP_M) * ELEVATION_SNAP_M;
}

/** Centre of opening measured along wall from wall start (for 3D placement) */
export function apertureCenterAlongWall(ap: ApertureSpec): number {
  return ap.leftOffsetM + ap.widthM / 2;
}

export function createAperture(
  type: ApertureType,
  wallIndex: number,
  wallLengthM: number,
  wallHeightM: number,
  existing: ApertureSpec[],
): ApertureSpec {
  const spec = APERTURE_CATALOG[type];
  const leftOffsetM = findDefaultLeftOffset(
    wallLengthM,
    spec.widthM,
    existing.filter((a) => a.wallIndex === wallIndex),
  );
  return {
    id: `ap-${Date.now().toString(36)}`,
    type,
    wallIndex,
    leftOffsetM: snapElevationM(leftOffsetM),
    widthM: spec.widthM,
    heightM: Math.min(spec.heightM, wallHeightM),
    sillHeightM: Math.min(spec.sillHeightM, Math.max(0, wallHeightM - spec.heightM)),
  };
}

export function findDefaultLeftOffset(
  wallLengthM: number,
  widthM: number,
  onWall: ApertureSpec[],
): number {
  if (onWall.length === 0) return Math.max(0, (wallLengthM - widthM) / 2);
  const sorted = [...onWall].sort((a, b) => a.leftOffsetM - b.leftOffsetM);
  const last = sorted[sorted.length - 1];
  const afterLast = last.leftOffsetM + last.widthM + 0.5;
  if (afterLast + widthM <= wallLengthM) return afterLast;
  return Math.max(0, (wallLengthM - widthM) / 2);
}

export function clampAperture(
  ap: ApertureSpec,
  wallLengthM: number,
  wallHeightM: number,
): ApertureSpec {
  const widthM = Math.min(Math.max(0.3, ap.widthM), wallLengthM);
  const heightM = Math.min(Math.max(0.3, ap.heightM), wallHeightM);
  const maxLeft = Math.max(0, wallLengthM - widthM);
  const maxSill = Math.max(0, wallHeightM - heightM);
  return {
    ...ap,
    widthM: snapElevationM(widthM),
    heightM: snapElevationM(heightM),
    leftOffsetM: snapElevationM(Math.min(Math.max(0, ap.leftOffsetM), maxLeft)),
    sillHeightM: snapElevationM(Math.min(Math.max(0, ap.sillHeightM), maxSill)),
  };
}

export function wallNetPaintSqm(
  wallLengthM: number,
  wallHeightM: number,
  onWall: ApertureSpec[],
): { gross: number; openings: number; net: number } {
  const gross = wallLengthM * wallHeightM;
  const openings = onWall.reduce((s, a) => s + a.widthM * a.heightM, 0);
  return { gross, openings, net: Math.max(0, gross - openings) };
}
