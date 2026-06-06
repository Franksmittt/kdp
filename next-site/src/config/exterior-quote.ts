import type { ExteriorServiceId, RoofTypeId, SurfaceCondition } from "@/types/quick-quote";

export const ROOF_TYPES: Record<
  RoofTypeId,
  { label: string; description: string; areaFactor: number }
> = {
  simple_pitch: {
    label: "Simple pitched (gable)",
    description: "Standard gable — ridge knock + eaves flashing",
    areaFactor: 1,
  },
  hip: {
    label: "Hip roof",
    description: "Four-sided hip — extra slope area + valley knocks",
    areaFactor: 1.08,
  },
  flat_parapet: {
    label: "Flat with parapet",
    description: "Flat deck — membrane on full parapet perimeter",
    areaFactor: 1,
  },
};

export const SURFACE_CONDITIONS: Record<
  SurfaceCondition,
  { label: string; description: string; prepMultiplier: number; defaultCrackLm: number }
> = {
  new_build: {
    label: "New build — never primed",
    description: "Raw cement/plaster — primer required",
    prepMultiplier: 1.3,
    defaultCrackLm: 5,
  },
  previously_painted: {
    label: "Previously painted — colour change",
    description: "Sound coating — scuff & topcoat, primer optional",
    prepMultiplier: 0.85,
    defaultCrackLm: 8,
  },
  degraded: {
    label: "Weathered / failing coating",
    description: "Cracks, peeling — filler + extra prep",
    prepMultiplier: 1.5,
    defaultCrackLm: 25,
  },
};

export const EXTERIOR_SERVICES: Record<
  ExteriorServiceId,
  { label: string; description: string; group: "walls" | "roof" }
> = {
  wall_paint: {
    label: "Wall painting",
    description: "Exterior acrylic topcoat on cement/plaster areas",
    group: "walls",
  },
  wall_primer: {
    label: "Wall primer",
    description: "1 coat bonding primer on bare or stripped areas",
    group: "walls",
  },
  crack_fill: {
    label: "Hairline crack filling",
    description: "V-groove & fill structural hairline cracks",
    group: "walls",
  },
  roof_paint: {
    label: "Roof painting",
    description: "Acrylic roof paint system (multi-coat)",
    group: "roof",
  },
  roof_waterproofing: {
    label: "Roof waterproofing",
    description: "Membrane / flashing on knocks, ridges & parapets",
    group: "roof",
  },
};

export const DEFAULT_UNIT_SPEC = {
  lengthM: 10,
  widthM: 5,
  heightM: 3,
  cementPercent: 100,
  roofType: "simple_pitch" as RoofTypeId,
  roofPitchDeg: 30,
  roofOverhangMm: 500,
  windows: { count: 2, widthM: 1.2, heightM: 1.2 },
  doors: { count: 2, widthM: 0.9, heightM: 2.1 },
  services: {
    wall_paint: true,
    wall_primer: false,
    crack_fill: false,
    roof_paint: false,
    roof_waterproofing: true,
  } satisfies Record<ExteriorServiceId, boolean>,
  condition: "previously_painted" as SurfaceCondition,
  crackLinearM: 8,
  wallCoats: 2,
  roofCoats: 3,
};

export const QUOTE_RATE_DEFAULTS = {
  membranePricePerLmZAR: 95,
  roofPaintSpreadingRateSqmL: 6,
  roofPaint20LPriceZAR: 1850,
  roofApplicationRateSqmHour: 10,
  waterproofingRateLmHour: 6,
  fillerPricePerKgZAR: 42,
  primer20LPriceZAR: 890,
};
