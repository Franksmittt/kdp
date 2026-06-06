import {
  calculateLinearJoints,
  computeGeometryFromFootprint,
  offsetPolygonOutward,
  polygonAreaSqm,
  polygonPerimeterLm,
  roofSurfaceAreaSqm,
} from "@/lib/geometry-engine";
import { ridgeLabel, ridgeLineLengthM } from "@/lib/ridge-engine";
import { wallLabelFromIndex } from "@/lib/wall-assembly-engine";
import type {
  ApertureSpec,
  FloorplanExport,
  FootprintVertex,
  RidgeLine,
  RoofStructuralStyle,
  StartFacing,
  WalkWallInput,
  WallSegment,
} from "@/types/visual-quote";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function buildFloorplanExport(params: {
  projectReference: string;
  startFacing: StartFacing;
  walkInputs: WalkWallInput[];
  wallSegments: WallSegment[];
  vertices: FootprintVertex[];
  wallHeightM: number;
  apertures: ApertureSpec[];
  facadePlasterRatio: number;
  roofStyle: RoofStructuralStyle;
  roofPitchDeg: number;
  roofOverhangM: number;
  ridgeLines?: RidgeLine[];
}): FloorplanExport {
  const {
    projectReference,
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
  } = params;

  const ridgeLines = params.ridgeLines ?? [];
  const outline = offsetPolygonOutward(vertices, roofOverhangM);
  const linearJoints = calculateLinearJoints(vertices, roofOverhangM, roofPitchDeg, roofStyle);
  const surfaceArea = roofSurfaceAreaSqm(vertices, roofOverhangM, roofPitchDeg, roofStyle);

  const geometry = computeGeometryFromFootprint({
    vertices,
    wallHeightM,
    apertures,
    roofStyle,
    roofPitchDeg,
    roofOverhangM,
    facadePlasterRatio,
  });

  const exportedRidges = ridgeLines.map((ridge, index) => ({
    ...ridge,
    label: ridgeLabel(index),
    length_m: round2(ridgeLineLengthM(ridge)),
  }));

  const exportedApertures = apertures.map((ap) => ({
    ...ap,
    wall_label: wallLabelFromIndex(ap.wallIndex),
    area_sqm: round2(ap.widthM * ap.heightM),
  }));

  return {
    version: 2,
    exported_at: new Date().toISOString(),
    project_reference: projectReference,
    walk: { start_facing: startFacing, inputs: walkInputs, segments: wallSegments },
    footprint: {
      vertices,
      offset_vertices: geometry.footprint.offset_vertices ?? vertices,
      area_sqm: round2(polygonAreaSqm(vertices)),
      perimeter_lm: round2(polygonPerimeterLm(vertices)),
    },
    roof: {
      structural_style: roofStyle,
      pitch_degrees: roofPitchDeg,
      overhang_m: roofOverhangM,
      outline_vertices: outline,
      ridge_lines: exportedRidges,
      drawn_ridge_length_lm: round2(exportedRidges.reduce((s, r) => s + r.length_m, 0)),
      surface_area_sqm: round2(surfaceArea),
      linear_joints: linearJoints,
    },
    wall_height_m: wallHeightM,
    facade_plaster_ratio: facadePlasterRatio,
    walls: geometry.walls,
    quantities: {
      total_aperture_area_sqm: geometry.total_aperture_area_sqm,
      net_wall_area_sqm: geometry.net_wall_area_sqm,
      net_plaster_area_sqm: geometry.net_plaster_area_sqm,
    },
    apertures: exportedApertures,
  };
}

export function downloadFloorplanJson(exportData: FloorplanExport, filename?: string): void {
  const safeName = (filename ?? exportData.project_reference ?? "floorplan")
    .replace(/[^\w\-]+/g, "-")
    .toLowerCase();
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${safeName}-floorplan.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
